#!/usr/bin/env node
( async function(){
'use script'
const fs = require('fs')
const path = require('path')
const tjs = require('translation.js')
const {Listmd} = require('./src/readmd.js')
const { writeDataToFile } = require('./src/writeDataToFile.js')
const meow = require('meow');
const chalk = require('chalk');
const cutMdhead = require('./src/cutMdhead.js')
const remark = require('remark')
const { logger } = require('./config/loggerConfig.js') // winston config
let defaultJson = './config/defaultConfig.json' // default config---
let defaultConfig = require(defaultJson) //---
let configJson = path.resolve(__dirname, 'config.json')
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

  -f   from : default en

  -t   to   : default zh

  -D debug 
  
`);

function optionsTodo(option, callback, args){
      callback(option, args)
}

function debugTodo(option, args){
  if(option){
    args.logger.level = 'debug'
  }
}

function fromTodo(option, args){
  if(option){
    args.from = option
  }
}

function toTodo(option, args){
  if(option){
    args.to = option
  }
}




const APIs = ['google','baidu','youdao']
let api = defaultConfig.api
// Fix write file Path is absoulte
var dir = cli.input[0]
if(!dir){
  return console.log(chalk.green("--> V"+cli.pkg.version,cli.help))
}
// change defaultConfig from cli
optionsTodo(cli.flags['D'], debugTodo, defaultConfig)
optionsTodo(cli.flags['f'], fromTodo, defaultConfig)
optionsTodo(cli.flags['t'], toTodo, defaultConfig)

await writeJson(configJson, defaultConfig)



const {setObjectKey} = require('./src/setObjectKey.js')

APIs.forEach(x =>{
  if( cli.input.join('\n').includes(x) ){
    api = x
  }
})

if(!dir.startsWith('/')){

  dir = '/' + dir
  logger.verbose(chalk.blue('Starting 翻译')+chalk.red(dir));
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

// logger.info(getList) 
// false
// 因为 getList.map
// 困不住 await
// 用 for 才行
// ../bin/translateExports.js #44
})()
