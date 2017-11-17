const tjs = require('translation.js')
const fs = require('fs')
const Listmd = require('./src/readmd.js')
const { writeDataToFile } = require('./src/writeDataToFile.js')

var dir

const getList = Listmd(dir)

getList.map((value) =>{
  fs.readFile(value, 'utf8', (err, data) =>{
    
    
    tjs
    .translate({
      text: data,
      api: "baidu"
    })
    .then(result => {
      console.log(result) // result 的数据结构见下文
    }).catch(error => {
      console.log(error.code)
    })
  })
})

