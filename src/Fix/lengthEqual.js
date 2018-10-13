const {
	getOptions
} = require('../config/work-options.js')
let configs = getOptions()
const { matchs, skips } = configs
const { tc } = require('../util/util.js')

let Equal;
function translateLengthEquals( source, tranTxt){

    let skipArr = ["... ", "etc. ", "i.e. ", "e.g. "].concat(skips)
	let matchArr = [ ". ", "! ", "; ", "！", "? ", "。"].concat(matchs)
    let trim = ["'", '"']
    Equal = source.length
    let newSource = [].concat(source)
    for( let i in source){ // typeof i == string
		// if(Equal == tranTxt.length) return

        source[i] = source[i].trim()
        let idxStr = source[i]
        let howMany = 0
            // let s = source[i]

        matchArr.forEach(function( val ){
            if(trim.some(x =>(idxStr.startsWith(x) && idxStr.endsWith(x)))){
                // ' **  ' /"   ** "
                return val
            }

			while( val && idxStr.includes(val) ){

				let skipIndexs = []

				skipArr.forEach(function(skip){

					if(idxStr.includes(skip)){
						skipIndexs.push(skip)
					}

				})

				if(skipIndexs.length){

					skipIndexs.forEach(skip =>{
						idxStr = idxStr.replace(skip, tc.bgMagenta(`👌 `)) // over val
					})
					continue;

				}else{
					idxStr = idxStr.replace(val, tc.bgRed(`🥄 `)) // over val
					howMany ++ // how many ". "/ etc
				}

			}
		})
        !!(howMany) && mergeAndCut(tranTxt, +i, howMany) // pay attion two + ,  string/number
        newSource[i] = idxStr
    }

    return newSource

}

function mergeAndCut(Arr, index, howMany, TestLen){
	let E = Equal || TestLen
	let num = 0;
	// Merge howMany items to Index item
	for(let i = index; i < index + howMany ; i++){

		if(1 || Arr.length - num !== E){
			Arr[i+1] && (Arr[index] = Arr[index] + Arr[i+1])
			num ++
		}else{
			break;
		}

	}
	// splice Items : From the Index + 1 to ` i `
	Arr.splice(index+1, num)

}

module.exports = { translateLengthEquals, mergeAndCut }
