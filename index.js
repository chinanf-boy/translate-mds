#!/usr/bin/env node
( async function(){
'use script'
const fs = require('fs')
const tjs = require('translation.js')
const {Listmd} = require('./src/readmd.js')
const { writeDataToFile } = require('./src/writeDataToFile.js')
const meow = require('meow');
const chalk = require('chalk');
const cutMdhead = require('./src/cutMdhead.js')
const remark = require('remark')
const {setObjectKey} = require('./src/setObjectKey.js')
const { logger } = require('./config/loggerConfig.js') // winston config
let defaultJson = './config/defaultConfig.json' // default config---
let jsonText = require(defaultJson) //---
const writeJson  = require('./util/writeJson.js')
// const debuglog 
// next ready auto select api source
// cli cmd 
const cli = meow(`
Usage
  $ translateMds [folder name] [API]{google,baidu,youdao} [options]
  default:
    API:youdao
Example
  $ translateMds md/ 
  
  [options]

  -D debug 

`);
const APIs = ['google','baidu','youdao']
let api = jsonText.api
let jsonFile = './config.json'
var dir = cli.input[0]
if(!dir){
  return logger.info(chalk.green("--> V"+cli.pkg.version,cli.help))
}else if(cli.flags['D']){
  jsonText.logger.level = 'debug'
  await writeJson(jsonFile, jsonText) 
}else{
  // rewrite config.json  
  await writeJson(jsonFile, jsonText)
  console.log('Rewrite')
}
APIs.forEach(x =>{
  if( cli.input.join('\n').includes(x) ){
    api = x
  }
})

if(!dir.startsWith('/')){

  dir = '/' + dir
  logger.info(chalk.blue('Starting 翻译')+chalk.red(dir));
}

// main func

// get floder markdown files Array
const getList = await Listmd(process.cwd()+dir)

//
getList.map(async (value) =>{

  if(value.endsWith('.zh.md'))return
  //read each file
  fs.readFile(value, 'utf8',async (err, data) =>{
    
    // console.log(chalk.green("翻译->"+value));

    // 去掉 文件中头的 部分 
    // ---
    // thing
    // ---
    let head
    [body, head] = cutMdhead(data)

    // to AST
    let mdAst = remark.parse(body)
    // type <string>
    // 
    // chileren Array
    // postion Object 
    // {
    //   start,
    //   end
    // }

    // translate Object Key == value
    // en to zh
    mdAst = await setObjectKey(mdAst, api)

    // Ast to markdown
    body = remark.stringify(mdAst)

    writeDataToFile(head+'\n'+body, value) 


  })
})

})()
