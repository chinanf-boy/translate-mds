const path = require('path')
const fs = require('mz/fs')

const contentDir = __dirname + '/../md/'
  

const  readMdir = async (Dir) =>{

    let _files = await fs.readdir(Dir, 'utf8').then((files) => {

            return files

            }).catch(err => console.log(err))


    return _files
    
}

var output = []

const Listmd = async (contentDir) =>{
    let input = await readMdir(contentDir)
    while ( input.length ){
        let path_string = input.shift()
        if(await fs.lstat(contentDir + path_string).then(x =>x.isDirectory())){
            await Listmd(contentDir + path_string + '/')
        }else{
            output.push(contentDir + path_string)
        }
    }
    return output
}

Listmd(contentDir).then(x =>{
    for( i in x){

        console.log(x[i])
    }
})
