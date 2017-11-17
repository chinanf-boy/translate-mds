const fs = require('mz/fs')
  
const  readMdir = async (Dir) =>{

    var dirlist = await fs.readdir(Dir, 'utf8').then( files => files).catch(err => err)
    return dirlist
} 

var output = []

const Listmd = async (contentDir) =>{
    let input = await readMdir(contentDir)
    if (input instanceof Error)
        return Promise.reject(input)

    while ( input.length ){
        let path_string = input.shift()
        if(await fs.lstat(contentDir + path_string).then(x =>x.isDirectory())){
            await Listmd(contentDir + path_string + '/')
        }else{
            output.push(contentDir + path_string)
        }
    }
    return Promise.resolve(output)
}

module.exports = Listmd;