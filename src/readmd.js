const fs = require('mz/fs')
  
const  readMdir = async (Dir) =>{

    
    var dirlist = await fs.readdir(Dir, 'utf8').then( files => files).catch(err => err)
    return dirlist
} 

function unique5(array){ var r = []; for(var i = 0, l = array.length; i < l; i++) { for(var j = i + 1; j < l; j++) if (array[i] === array[j]) j = ++i; r.push(array[i]); } return r; }

var output = []

const Listmd = async (contentDir) =>{

    if( ! contentDir.endsWith('/') ){
        contentDir += '/'   
    }
    
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
    
    
    return Promise.resolve( unique5(output) )

}

module.exports = {Listmd, unique5};