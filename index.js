const fs = require('fs')
const tjs = require('translation.js')
const Listmd = require('./src/readmd.js')
const { writeDataToFile } = require('./src/writeDataToFile.js')
const meow = require('meow');

// cli cmd 
const cli = meow(`
Usage
  $ translate-md-content [folder name]
Example
  $ translate-md-content md/

`);

var dir = cli.input[0]

if(!dir.startsWith('/')){
  dir = '/' + dir
}

// main func

// get floder markdown files Array
const getList = Listmd(process.cwd()+dir)

//
getList.map((value) =>{
  //read each file
  fs.readFile(value, 'utf8', (err, data) =>{
    
    // tjs make data en to zh
    
    tjs
    .translate({
      text: data,
      api: "baidu"
    })
    .then(result => {

      // get zh and -> write down same folder { me.md => me.zh.md }
      writeDataToFile(result, value) 

      // result 的数据结构见下文
    }).catch(error => {
      console.log(error.code)
    })
  })
})

