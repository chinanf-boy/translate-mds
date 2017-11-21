const fs = require('mz/fs')
const path = require('path')

const  readMdir = async (Dir) =>{

    
    var dirlist = await fs.readdir(Dir, 'utf8').then( files => files).catch(err => err)
    return dirlist
} 

function unique5(array){ var r = []; for(var i = 0, l = array.length; i < l; i++) { for(var j = i + 1; j < l; j++) if (array[i] === array[j]) j = ++i; r.push(array[i]); } return r; }

const Listmd = async (contentDir, output = []) =>{
    var input = []

    if( await fs.lstat(contentDir).then(x =>x.isFile())){
        input.push(path.basename(contentDir))
        contentDir = path.dirname(contentDir)
    }
    else{
        if( ! contentDir.endsWith('/') ){
            contentDir += '/'   
        }
        input = await readMdir(contentDir)
    }

    if (input instanceof Error)
        return Promise.reject(input)

    while ( input.length ){
        let path_string = input.shift()
        if(await fs.lstat( path.join(contentDir,path_string)).then(x =>x.isDirectory())){

            await Listmd(path.join(contentDir, path_string), output)

        }else{
            output.push(path.join(contentDir, path_string))
        }
    }
    
    
    return Promise.resolve( output )

}

module.exports = {Listmd, unique5};