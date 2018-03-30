const MAXLENGTH = 30;

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

module.exports = { fixFileTooBig, indexMergeArr }