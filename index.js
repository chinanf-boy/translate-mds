#!/usr/bin/env node
( async function(){
'use script'
const fs = require('fs')
const path = require('path')
const tjs = require('translation.js')
const {Listmd} = require('./src/readmd.js')
const meow = require('meow');
const chalk = require('chalk');
const cutMdhead = require('./src/cutMdhead.js')
const remark = require('remark')
// option todo list
const { setDefault, debugTodo, fromTodo, toTodo, apiTodo } = require('./src/optionsTodo.js')

// config 
const { logger } = require('./config/loggerConfig.js') // winston config
let defaultJson = './config/defaultConfig.json' // default config---
let defaultConfig = require(defaultJson) //---
let configJson = path.resolve(__dirname, 'config.json')
// write config.json
const writeJson  = require('./util/writeJson.js')

// next ready auto select api source
// cli cmd 
const cli = meow(`
Usage
  $ translateMds [folder name] [options]
  default:
    API:youdao
Example
  $ translateMds md/ 
  
  [options]
  -a   API  : default baidu {google,baidu,youdao}

  -f   from : default en

  -t   to   : default zh

  -D debug 
  
`);

const APIs = ['google','baidu','youdao']
// Fix write file Path is absoulte
var dir = cli.input[0]
if(!dir){
  return console.log(chalk.green("--> V"+cli.pkg.version,cli.help))
}
// change defaultConfig from cli
// if true return first option
// else return 
let debug = setDefault(cli.flags['D'], debugTodo, defaultConfig)
logger.level = debug
let tranFr = setDefault(cli.flags['f'], fromTodo, defaultConfig)
let tranTo = setDefault(cli.flags['t'], toTodo, defaultConfig)
let api = setDefault(cli.flags['a'], apiTodo, defaultConfig)

// Now rewrite config.json
await writeJson(configJson, defaultConfig) // 用 defaultConfig 写入 config.json

// and then, setObjectKey.js can require the new config.json 
const {setObjectKey} = require('./src/setObjectKey.js')
const { writeDataToFile } = require('./src/writeDataToFile.js')
//ready
logger.verbose(chalk.blue('Starting 翻译')+chalk.red(dir));

// main func

// get floder markdown files Array
const getList = await Listmd(path.resolve(process.cwd(),dir))

//
getList.map(async (value) =>{

  if(value.endsWith(`.${tranTo}.md`) || value.match(/\.[a-zA-Z]+\.md+/) ) return

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
