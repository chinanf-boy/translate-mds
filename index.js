const tjs = require('translation.js')

var fileContent = ''

tjs
  .translate({
    text: fileContent,
    api: "baidu"
  })
  .then(result => {
    console.log(result) // result 的数据结构见下文
  }).catch(error => {
    console.log(error.code)
  })