'use script'
const fs = require('mz/fs')
const path = require('path')
const tjs = require('translation.js')
const {
	Listmd
} = require('./readmd.js')
const meow = require('meow');
const cutMdhead = require('./cutMdhead.js')
const remark = require('remark')
const {
	logger
} = require('../config/loggerConfig.js') // winston config

// config
const mergeConfig = require('../config/mergeConfig')

let done = 0

// Object to Array
function O2A(options) {
	let {
		aFile,
		api,
		tF,
		tT
	} = options
	return [aFile, api, tF, tT]
}

/**
 * @description translateMds main
 * @param {Array|Object} options
 * @param {Boolean|String} debug
 * @param {boolean} [isCli=false]
 * @returns {Array<Object>} results
 * @returns {String} results[i].text
 * @returns {String} results[i].error
 */
async function translateMds(options, debug, isCli = false) {

	let absoluteFile, api, tranFrom, tranTo
	if (!options) throw logger.error('options is NULL')

	// options is Array or Object
	if (options instanceof Array) {
		[absoluteFile, api, tranFrom, tranTo] = options
	} else if (options instanceof Object) {
		[absoluteFile, api, tranFrom, tranTo] = O2A(options)
	}
	// file is absolute
	if (!absoluteFile || !path.isAbsolute(absoluteFile)) {
		throw logger.error(`translateMds absoluteFile is no absolute ${absoluteFile}`)
	}
	// change defaultConfig from options
	// return first option
	if (!isCli) {
		let opts = {
			debug,
			tranFrom,
			tranTo,
			api,
			options
		};

		let back =  mergeConfig.main(opts)
		debug = back.debug
		tranFrom = back.tranFrom
		tranTo = back.tranTo
		api = back.api
	}

	// setObjectKey.js after rewrite config.json
	const {
		setObjectKey
	} = require('./setObjectKey.js')

	async function t(data) {

		let head, body, mdAst,translateMdAst
		[body, head] = cutMdhead(data)

		// to AST
		mdAst = remark.parse(body)

		// translate Array
		translateMdAst = await setObjectKey(mdAst, api)

		if (translateMdAst) {
            let E = translateMdAst.Error
			// Ast to markdown
			body = remark().use({
				settings: {commonmark: true, emphasis: '*', strong: '*'}
			}).stringify(translateMdAst)

			return [head + '\n' + body, E]
		}

		return translateMdAst
	}

	let results = []

	// get floder markdown files Array
    const getList = isCli ? [absoluteFile] : await Listmd(absoluteFile)
	for (i in getList) {
		let value = getList[i]

        // 去掉 .**.zh 的后缀 和 自己本身 .match(/\.[a-zA-Z]+\.md+/)
        if(isCli){

        }else{
            if ( value.endsWith(`.${tranTo}.md`) || value.match(/\.[a-zA-Z]+\.md+/) || !value.endsWith('.md')){
                continue
            }
            const {insert_flg } = require('./writeDataToFile.js')

            if ( fs.existsSync( insert_flg(value,`.${tranTo}`, 3 ))){
                continue
              }
        }

		let readfile = await fs.readFile(value, 'utf8')
		let E
		let _translate = await t(readfile).then(x => {
			E = x[1]
			return x[0]
		}).catch(x => {
			E = x
			return ''
		})

		results.push({text:_translate, error:E})
	}

	return results
}


module.exports = translateMds
