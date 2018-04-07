function translateLengthEquals( source, tranTxt){

    let matchArr = [ ". ", "！","; "]
    let trim = ["'", '"']
    let ReturnArr = []
    let Tindex = 0

    for( let i in source){ // typeof i == string
        
        source[i] = source[i].trim()
        let howMany = 0
            // let s = source[i]

        matchArr.map(function( val ){
        if(trim.some(x =>(source[i].startsWith(x) && source[i].endsWith(x)))){
            return val
        }
        
        while (source[i].indexOf(val) != -1  // string with match
            && source[i].indexOf(val) != (source[i].length - val.length) ){ 
            // string ending  with match, don't Add number
            
            source[i] = source[i].replace(val, "?")
            howMany ++ // how many ". "/ etc
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
