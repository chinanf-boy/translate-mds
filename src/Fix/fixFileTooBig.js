const MAXLENGTH = 30;
const MAXstring = 300
/**
 * @description fix file-value Too big
 * @param {Array} bigArr 
 */
function fixFileTooBig(bigArr){
    let chunkArr = []
    let bigL = bigArr.length
    let bigl_2 =  Math.ceil(bigL/2)
    // length > 30
    if(bigL > MAXLENGTH){
        let n = Math.ceil(bigL / MAXLENGTH) // how many chunk
        let chunkLength = Math.ceil(bigL/n) // single chunk:Array almost length

        for(let numChunk = 0; numChunk < n ; numChunk ++){ // for chunk length

            // while index+length > bigArr.length ,
            // we most shrot length in indexMergeArr
            chunkArr.push( indexMergeArr(bigArr, (numChunk*chunkLength), chunkLength) )
        } 
        // count string > 300

        for( let m in chunkArr){
            chunkArr[m] = fixFileTooBig(chunkArr[m])
        }
        // chunkArr.map(function(Arr){
            
        //     let backA = fixFileTooBig(Arr)
        //     return backA 
        // })

        //  *****  Bug message *******
        //      {map} fucntion can not
        // 
        // 「return」 struct:
        //                  backA: [[],[]]
        // *****   ___________ *******

        return chunkArr
    }else
    // length <= 30 
    if(bigArr.join("").length > MAXstring){ // & string > 100
// so deep  
// [       
//     [], 
//     [], 
//     [], 
//     []
// ] 
//   => 
// [
//     [
//         [], string < 100 , but more one Array ceil
//         [], string < 100 , we should thirdArray
//     ],
//     [],
//     [],
//     []
// ]
        chunkArr[0] = indexMergeArr(bigArr, 0, bigl_2)
        chunkArr[1] = indexMergeArr(bigArr, bigl_2, (bigL-bigl_2))
        return chunkArr
    }else { // string <= 100
        chunkArr.push(bigArr)
        return chunkArr
    }
}

/**
 * @description 
 * @param {Array} Arr 
 * @param {number} B begin
 * @param {number} L length
 * @returns 
 */
function indexMergeArr(Arr, B, L){
    if(B < 0){
        throw new Error("indexMergeArr Arr.length < index -- Error")
    }
    if(Arr.length < (B+L)){
//shrot length in indexMergeArr
        L = Arr.length - B
    }
    let backArr = []
    for(let index in Arr){
        if((B <= +index) && (+index < (B+L))){
            backArr.push(Arr[index])
        }
    }
    return backArr
}

/**
 * @description renturn the Array Third Arr
 * @param {Array} Arr 
 * @returns {Array}
 */
function thirdArray(Arr){
    let hasArr = []
    for(let one in Arr){

        if(Array.isArray(Arr[one])){

            for (let two in Arr[one]){

                if(Array.isArray(Arr[one][two])){
                    hasArr.push([one,two])
                }
            }
        }
    }
    return hasArr
}
module.exports = { fixFileTooBig, indexMergeArr, thirdArray }