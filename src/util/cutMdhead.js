module.exports = cutMdhead = (data) =>{
    let headlike = ['---','+++']
    for(let i in headlike)
    if(data.startsWith( headlike[i] )){
        let index = data.slice(3).indexOf( headlike[i] ) + 6
        return [data.slice(index), data.slice(0,index)]

    }
    return [data, ""]
}