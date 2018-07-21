const {
	getOptions
} = require('../../config/work-options.js')
let configs = getOptions()
const { matchs, skips } = configs

let Equal;
function translateLengthEquals( source, tranTxt){

    let skipArr = ["... ", "etc. ", "i.e. ", "e.g. "].concat(skips)
	let matchArr = [ ". ", "! ", "; ", "！", "? "].concat(matchs)
    let trim = ["'", '"']
    let ReturnArr = []
    let Tindex = 0
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

			while( source[i].indexOf(val) != -1 ){

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

function mergeAndCut(Arr, index, howMany){

    if(Arr.length < (index+1+howMany)){
        howMany = Arr.length - index - 1
    }

    (howMany > 1) && mergeAndCut(Arr, index+1, (howMany-1))
	if(Equal == Arr.length) {
		return
	}
	// if(Equal == Arr.length) return
    // [1,2,3] => [12,2,3]
    Arr[index] = Arr[index] + Arr[index+1]
    // [12,2,3] => [12,3]
    for(let i = index+1; i < Arr.length; i ++){
        if( i == (Arr.length - 1)){
            Arr.pop()
            break
        }
        Arr[i] = Arr[i + 1]
	}
}

module.exports = { translateLengthEquals, mergeAndCut }
