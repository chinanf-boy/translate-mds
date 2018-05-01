#!/usr/bin/env node
( async function(){
'use script'
process.on('uncaughtException', function(err){
  console.error('got an error: %s', err);
  process.exit(1);
});
console.time("time")

const async = require('async')
const fs = require('fs')
const asyncfs = require('mz/fs')
const path = require('path')
const {Listmd} = require('./src/readmd.js')
const meow = require('meow');
const ora = require('ora')
const chalk = require('chalk');
const remark = require('remark')

// option todo list
const { setDefault, debugTodo, fromTodo, toTodo, apiTodo, rewriteTodo, numTodo } = require('./src/optionsTodo.js')

// config
const { logger } = require('./config/loggerConfig.js') // winston config
let defaultJson = './config/defaultConfig.json' // default config---
let defaultConfig = require(defaultJson) //---
let workOptions = require('./config/work-options')
let configJson = path.resolve(__dirname, 'config.json')

// write config.json
const writeJson  = require('./util/writeJson.js')

// cli cmd
const cli = meow(`
Usage
  $ translateMds [folder name] [options]

Example
  $ translateMds md/

  [options]
  -a   API      : default < baidu > {google,baidu,youdao}

  -f   from     : default < en >

  -t   to       : default < zh >

  -N   num      : default < 5 > {async number}

  -D   debug

  -R   rewrite  : default < false > {yes/no retranslate and rewrite translate file}

  -T   timeout  : default {this 功能 待续}
`);

const APIs = ['google','baidu','youdao']
// Fix write file Path is absoulte
var dir = cli.input[0]
if(!dir){
  return console.log(chalk.green("--> V"+cli.pkg.version,cli.help))
}

// default config
let debug = setDefault(cli.flags['D'], debugTodo, defaultConfig)
logger.level = debug
let tranFr = setDefault(cli.flags['f'], fromTodo, defaultConfig)
let tranTo = setDefault(cli.flags['t'], toTodo, defaultConfig)
let api = setDefault(cli.flags['a'], apiTodo, defaultConfig)
let rewrite = setDefault(cli.flags['R'], rewriteTodo, defaultConfig)
let asyncNum = setDefault(cli.flags['N'], numTodo, defaultConfig)

// Now rewrite config.json
await writeJson(configJson, defaultConfig) // 用 更改的 defaultConfig 写入 config.json

workOptions.setOptions(JSON.parse(defaultConfig))

const translateMds = require('./bin/translateExports.js')

// after config.json ready
const { writeDataToFile, insert_flg } = require('./src/writeDataToFile.js')

console.log(chalk.blue('Starting 翻译')+chalk.red(dir));

// main func

// get floder markdown files Array
const getList = await Listmd(path.resolve(process.cwd(),dir))

console.log(chalk.blue(`总文件数 ${getList.length}, 有些文件会跳过`));

let Done = 0
let noDone = []
function doneShow(str) {
    const s = ora(str).start()
    s.color = 'red'
    s.succeed()
}
let showAsyncnum = 0
async.mapLimit(getList, asyncNum, runTranslate,
  (err, IsTranslateS) =>{
                  if(err)throw err
                  Done++
                  if(IsTranslateS.every(x =>!!x)){
                      doneShow(`All Done`)
                  }else{
                      doneShow(`Some No Done`)
                  }
                  console.timeEnd("time")
                }
)

/**
 * @description async Translate filename value , Return true or false
 * @param {String} value
 * @returns {Boolean}
 */

async function runTranslate(value){
  Done++

  let localDone = Done


  // filter same file
  if(value.endsWith(`.${tranTo}.md`) || !value.endsWith('.md')) {
    logger.debug(chalk.blue(`- 已翻译的
    - 或者 不是 md 文件的
      ${localDone}`));
    return true
  }
  if( value.match(/\.[a-zA-Z]+\.md+/)){
    logger.debug(chalk.blue(`- 有后缀为 *.国家简写.md 之类 看起来名字已翻译的
      避免出现 .zh.ja.md 的 情况，情况选择 原文件 .md
      ${localDone}`));
    return true
  }

  if(!rewrite && fs.existsSync( insert_flg(value,`.${tranTo}`, 3 ))){
    logger.debug(chalk.blue(`已翻译, 不覆盖 ${localDone}`));
    return true
  }

  // open async num
  showAsyncnum++
  let start = new Date().getTime();

  const spinner = ora(`${process.pid} Loading translate .. ${path.basename(value)}  `)
  spinner.color = 'yellow'

  let _translateMds =  await translateMds([value, api, tranFr, tranTo],debug, true)
  let endtime = new Date().getTime() - start;

	spinner.start()
  if(_translateMds.every(x =>x!='')){
    writeDataToFile(_translateMds, value)
    spinner.text = `已搞定 第 ${localDone} 文件 - 并发${chalk.blue(showAsyncnum)} -- ${chalk.blue(endtime+'md')} - ${path.basename(value)} `
    spinner.succeed()
    showAsyncnum--
  return true
  }
  spinner.text = `没完成 第 ${localDone} 文件 - 并发${chalk.blue(showAsyncnum)} -- ${chalk.blue(endtime+'md')} - ${value} `
  spinner.fail()

  showAsyncnum--

  return false
}

function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

// async.mapLimit will outside, must lock in
while(Done){
  const time = 100
  await timeout(time)

  if(Done > getList.length)
    break
}
})()
