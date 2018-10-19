const tjs = require('translation.js')

// log
const debug = require("debug")("mds:tran")
const {logger, loggerStart, loggerText, oneOra } = require('./config/loggerConfig.js')

// get config.json
const {getOptions} = require('./config/work-options.js')
const configs = getOptions()

let tranF = configs['from'],
tranT = configs['to'],
COM   = configs['com'],
Force = configs['force']
timeWait = configs['timewait'],
getValuesFile = configs['getvalues'],
gotTranslateFile = configs['translate'],
apis = configs['apis'];
// Fix china symbal
const fixZhtoEn = require("./Fix/fixZhtoEn.js")
// Fix result.length no equal
const { translateLengthEquals } = require("./Fix/lengthEqual.js")
// Fix Too Big Array to Chunk
const { fixFileTooBig, indexMergeArr } = require("./Fix/fixFileTooBig.js")
const {tc,time,g,y,yow,m,b,r,relaPath,newObject,asyncWrite,asyncRead} = require('./util/util.js')

const MAXstring = 1300

//
// get translate result

/**
 * @description
 * @param {String|String[]} value
 * @param {String} api
 * @returns {String[]}
 */
async function translateValue(value, api) {
	let thisTranString
	if (value instanceof Array) {
		thisTranString = value.join('\n')
	} else {
		thisTranString = value
	}
	await time(timeWait)

	if (tranT === 'zh') tranT = 'zh-CN'

    let tjsOpts = {
		text: thisTranString,
		to: tranT,
		com: COM
    }
    
    if(tranF){
        tjsOpts['from'] = tranF
    }

	return tjs[api].translate(tjsOpts).then(result => {
		if (!result.result) {
			throw new Error('「结果为空」')
		}

		if (value.length == result.result.length) {
			return result.result
		}

		if (value.length > result.result.length) {
			return translateValue(value.slice(result.result.length), api).then(youdao => {
				// tjs translate youdao BUG and tjs baidu will return undefined
				if (youdao) {
					if (youdao instanceof Array) {
						youdao.forEach(x => result.result.push(x))
					} else {
						result.result.push(youdao)
					}
				}
				return result.result

			}).catch(x => logger.error(`${youdao}炸了`, x))
			// Promise.reject("bad youdao fanyi no get \\n")
		}

		return result.result

	}).catch(err => {
		throw err
	})

}

const { getTypeValue, setTypeValue} = require('./typeSetAndGet')

/**
 * @description translate AST Key == value, return new Object
 * @param {Object} obj - AST
 * @param {Object} Opts - options
 * @param {String} Opts.api - defuault api
 * @param {String} Opts.name - file name

 * @returns {Object} - newObject
 */
async function setObjectKey(obj, opts) {

    let allAPi = apis
    let api = opts.api

    let howManyValNoTran = 0
    let errMsg = ""

	let tranArray = []
	let thisTranArray = []
    let resultArray = []

    let newObj = newObject(obj)
    let tips = `${r("If slow/stagnant , should try again")}`
    // put obj values to tranArray
    let sum = getTypeValue(obj, tranArray)
	if (!sum || !tranArray.length) {
		loggerText("no value " + sum, {
			level: "error"
		})
		return "no value"
	}

	if (tranArray.length) {
		// remove all \n
		tranArray = tranArray.map(x => {
			if (x.indexOf('\n') >= 0) {
				return x.replace(/[\n]/g, ' ')
			}
			return x
		})
		thisTranArray = tranArray
        tranArray = []
        // --values {cli options}
		if(getValuesFile){
			await asyncWrite(getValuesFile,thisTranArray).then(function(ok){
				loggerText(`${getValuesFile} saved`)
            })

            return `you want ${g(relaPath(getValuesFile))} values save, so ${r('skip')} translate`
		}
	}

	if(gotTranslateFile){ // custom translate file with single file
        let tContent = await asyncRead(gotTranslateFile)
        let relaP =  relaPath(gotTranslateFile)
		if(tContent.length === thisTranArray.length){
            oneOra(`you choose ${y(relaP)} be The translation`)
			resultArray = tContent
		}else{
			throw new Error(`${g(relaP)} value length ${r('no equal')}\n translate-content:${y(tContent.length)}\n wait-translate:${y(thisTranArray.length)}`)
		}
	}else{
		// Fix file Too Big
		let chunkTranArray = fixFileTooBig(thisTranArray)

		for (let third in chunkTranArray) {

			let thisChunkTran = chunkTranArray[third]
			let isWork = true
			// auto change translate source
			allAPi = allAPi.filter(x => x != api)
			allAPi.push(api)
			let thisResult = []

			for (let i in allAPi) { // Auto next api

				loggerText(`2. ${yow(relaPath(opts.name))} use ${g(api)} ${resultArray.length}/${thisTranArray.length} - ${tips}`)

				try {

					if (thisChunkTran.join("").length > MAXstring) { // string > 300

						let thisChunkTranL_2 = Math.ceil(thisChunkTran.length / 2)

						let left = indexMergeArr(thisChunkTran, 0, thisChunkTranL_2)
						let right = indexMergeArr(thisChunkTran, thisChunkTranL_2, thisChunkTranL_2)

						let t0 = await translateValue(left, api)
						let t1 = await translateValue(right, api)

						thisResult = t0.concat(t1)

					} else {

						thisResult = await translateValue(thisChunkTran, api)
					} // get Result Arr

				} catch (error) {
					if (!error.code) {
						loggerText(`${error.message} tjs-error, api:${y(api)}`, {
							level: "error",
							color: "red"
						})
					} else {
						loggerText(`${error.code} ,api:${y(api)}`, {
							level: "error",
							color: "red"
						})
					}
					thisResult = []
				}

				// result-1 return translate value, break for allAPi
				if (thisResult.length > 0 && thisResult.length >= thisChunkTran.length) {
					break
				}

				api = allAPi[i]
				// result-2 return source value
				if ((+i + 1) == allAPi.length) {
					// ending is no result

					// count how many string no translate
					howManyValNoTran += thisChunkTran.length
					isWork = false
                    thisResult = thisChunkTran // Add source tran
                    errMsg = `PS: can not get translation from API`
				}

			}

			if (isWork) { // can fetch something result
                // Fix use Fix/lengthEqual.js in every Chunk

                let markChunkTran = [].concat(thisChunkTran); // mark some emoji, display the split
				if (thisChunkTran.length < thisResult.length) {

					markChunkTran = translateLengthEquals(thisChunkTran, thisResult) // Fix
				}

				let BigOne = markChunkTran.length > thisResult.length ? markChunkTran : thisResult
                let debugInfo = `-- source: ${markChunkTran.length}/${thisResult.length}: translte ---`
				if (debug.enabled) { // debug all
					debug(debugInfo)

                    for (let i in BigOne) { // Debug
                        if(!markChunkTran[i] || !thisResult[i]){
                            debug('2. set- ' + i + ': ' + g(markChunkTran[i]) + ` ${tc.bgMagenta('to-> ')} ${i} : ` + yow(thisResult[i]) )
                        }else{
                            debug('2. set- ' + i + ': ' + g(markChunkTran[i]) + ' to-> ' + i + ': ' + yow(thisResult[i]) )
                        }
					}

				} else if (markChunkTran.length != thisResult.length) { // debug only unequal

					loggerText(debugInfo)

                    for (let i in BigOne) { // Debug
                        if(!markChunkTran[i] || !thisResult[i]){
                            logger.debug('2. set- ' + i + ': ' + g(markChunkTran[i]) + ` ${tc.bgMagenta('to-> ')} ${i} : ` + yow(thisResult[i]))
                        }else{
                            logger.debug('2. set- ' + i + ': ' + g(markChunkTran[i]) + ' to-> ' + i + ': ' + yow(thisResult[i]))
                        }
					}

				}

				if (thisChunkTran.length == thisResult.length) {
					// Fix Upper/Lower case
					for (let i in thisChunkTran) {
						if (thisChunkTran[i].trim().toLowerCase() == thisResult[i].trim().toLowerCase()) {
							thisResult[i] = thisChunkTran[i]
						}
					}
				}

				if (thisChunkTran.length != thisResult.length) { // can't Fix
					howManyValNoTran += thisChunkTran.length
                    thisResult = thisChunkTran // Add source tran
                    errMsg = `PS: can not sort the translate Text`
				}
			}

			resultArray = resultArray.concat(thisResult) // Add result

            loggerText(`3. translate loading - ${resultArray.length}/${thisTranArray.length}`)

            if(errMsg && !Force){
                break;
            }

		}
	}

    if(!errMsg || Force){
        resultArray = fixZhtoEn(resultArray) // fix zh symbal to en

        setTypeValue(newObj, resultArray)
    }

	if (howManyValNoTran > 0) {
		newObj.Error = `no translate number: ${howManyValNoTran}/${thisTranArray.length} ${errMsg}`
	}


	return newObj
}

module.exports = {
	setObjectKey,
	translateValue
}
