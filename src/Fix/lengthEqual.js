const {
	getOptions
} = require('../../config/work-options.js')
let configs = getOptions()
const { matchs, skips } = configs

let Equal;
function translateLengthEquals( source, tranTxt){

    let skipArr = ["... ", "etc. ", "i.e. ", "e.g. "].concat(skips)
	let matchArr = [ ". ", "! ", "; ", "！", "? ", "。"].concat(matchs)
    let trim = ["'", '"']
    let ReturnArr = []
	Equal = source.length
    for( let i in source){ // typeof i == string
		// if(Equal == tranTxt.length) return

        source[i] = source[i].trim()
        let howMany = 0
            // let s = source[i]

        matchArr.map(function( val ){
            if(trim.some(x =>(source[i].startsWith(x) && source[i].endsWith(x)))){
                return val
            }

			while( val && source[i].indexOf(val) != -1 ){

				let skipIndexs = []

				skipArr.forEach(function(skip){

					if(source[i].includes(skip)){
						skipIndexs.push(skip)
					}

				})

				if(skipIndexs.length){

					skipIndexs.forEach(skip =>{
						source[i] = source[i].replace(skip, "👌 ") // over val
					})
					continue;

				}else{
					source[i] = source[i].replace(val, "🥄 ") // over val
					howMany ++ // how many ". "/ etc
				}

			}
		})
        !!(howMany) && mergeAndCut(tranTxt, +i, howMany) // pay attion two + ,  string/number
    }

}

function mergeAndCut(Arr, index, howMany, TestLen){
	let E = Equal || TestLen
	let num = 0;
	// Merge howMany items to Index item
	for(let i = index; i < index + howMany ; i++){

		if(Arr.length - num !== E){
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
