const path = require('path')
const fs = require('mz/fs')

const contentDir = __dirname + '/../md/'

// const readFile = function (fileName) {
//     return new Promise(function (resolve, reject) {
//       fs.readFile(fileName, function(error, data) {
//         if (error) return reject(error);
//         resolve(data);
//       });
//     });
//   };
  

const  readMdir = async (Dir) =>{

    let _files = await fs.readdir(Dir, 'utf8').then((files) => {

            return files

            }).catch(err => console.log(err))

    let _filesContent

    for (i in _files) {

        _filesContent += await fs.readFile(Dir + _files[i], 'utf8').then(result =>{
            return result
        })}

    return _filesContent
    
}

readMdir(contentDir).then(x =>console.log(x))



// }