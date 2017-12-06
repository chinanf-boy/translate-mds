#!/usr/bin/env node
( async function(){
'use script'
const fs = require('fs')
const asyncfs = require('mz/fs')
const path = require('path')
const tjs = require('translation.js')
const {Listmd} = require('./src/readmd.js')
const meow = require('meow');
const ora = require('ora')
const chalk = require('chalk');
const cutMdhead = require('./src/cutMdhead.js')
const remark = require('remark')
// option todo list
const { setDefault, debugTodo, fromTodo, toTodo, apiTodo, rewriteTodo } = require('./src/optionsTodo.js')

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
  -a   API      : default baidu {google,baidu,youdao}

  -f   from     : default en

  -t   to       : default zh

  -D   debug    
  
  -R   rewrite  : default false {yes/no retranslate and rewrite translate file}
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
let rewrite = setDefault(cli.flags['R'], rewriteTodo, defaultConfig)

// Now rewrite config.json
await writeJson(configJson, defaultConfig) // 用 defaultConfig 写入 config.json

// and then, setObjectKey.js can require the new config.json 
const {setObjectKey} = require('./src/setObjectKey.js')
const { writeDataToFile, insert_flg } = require('./src/writeDataToFile.js')
//ready
logger.verbose(chalk.blue('Starting 翻译')+chalk.red(dir));

// main func

// get floder markdown files Array
const getList = await Listmd(path.resolve(process.cwd(),dir))

logger.info(chalk.blue(`总文件数 ${getList.length}, 有些文件会跳过`));

let Done = 0
let noDone = []
function doneShow(str) {
  if(Done >= getList.length){
    const s = new ora(str).start()
    s.succeed()
  }
}

getList.map(async function runTranslate(value){

  if(value.endsWith(`.${tranTo}.md`) || value.match(/\.[a-zA-Z]+\.md+/) || !value.endsWith('.md')) {
    logger.debug(chalk.blue(`翻译的 或者 不是 md 文件的 有 ${++Done}`));
    doneShow(`all done`)
    return true
  }
  if(!rewrite && fs.existsSync( insert_flg(value,`.${tranTo}`, 3 ))){
    logger.debug(chalk.blue(`已翻译, 不覆盖 ${++Done}`));
    doneShow(`all done`)
    
    return true
  }




  //read each file
  return await asyncfs.readFile(value, 'utf8').then(async (data) =>{
    
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
    if(noDone.some(x =>x==value)){
      logger.debug(`${path.basename(value)} try second fail`)
      // secondTry fail is translate false
    }

    const spinner = new ora(`Loading translate .. ${path.basename(value)}  `)
    spinner.color = 'yellow'
    spinner.start();
    
    mdAst = await setObjectKey(mdAst, api)
    
    if(!mdAst){
      if(noDone.some(x =>x==value)){
        return false
      }
      //await runTranslate(value)
      
      // later up up up
      noDone.push(value)
      let secondTry = await runTranslate(value)
      if(!secondTry){
        spinner.fail()
        return false
      }
    }else if(noDone.some(x =>x==value)){
      noDone = noDone.filter(x =>x!=value)
      return true
    }


    // Ast to markdown
    body = remark.stringify(mdAst)

    // write
    writeDataToFile(head+'\n'+body, value) 

    spinner.succeed()
    logger.verbose(chalk.blue(`已搞定 第 ${++Done} 文件`));
    doneShow(`all done`)
    
    return true
  })
})
// logger.info(getList) 
// false
// 因为 getList.map
// 困不住 await
// 用 for 才行
// ../bin/translateExports.js #44
})()
