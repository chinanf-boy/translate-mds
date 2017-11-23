module.exports = cutMdhead = (data) =>{
    
    if(data.startsWith('---')){
        let index = data.slice(3).indexOf('---') + 6
        return [data.slice(index), data.slice(0,index)]

    }
    return data
}