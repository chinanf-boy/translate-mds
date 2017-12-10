#!/usr/bin/env node
( async function(){
'use script'
process.on('uncaughtException', function(err){
  console.error('got an error: %s', err);
  process.exit(1);
});
const async = require('async')

const fs = require('fs')
const asyncfs = require('mz/fs')
const path = require('path')
// const tjs = require('translation.js')
const {Listmd} = require('./src/readmd.js')
const meow = require('meow');
const ora = require('ora')
const chalk = require('chalk');
// const cutMdhead = require('./src/cutMdhead.js')
const remark = require('remark')
// option todo list
const { setDefault, debugTodo, fromTodo, toTodo, apiTodo, rewriteTodo, numTodo } = require('./src/optionsTodo.js')

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

Example
  $ translateMds md/ 
  
  [options]
  -a   API      : default baidu {google,baidu,youdao}

  -f   from     : default en

  -t   to       : default zh

  -N   num      : default 5 {async number}

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
let asyscNum = setDefault(cli.flags['N'], numTodo, defaultConfig)
// Now rewrite config.json
await writeJson(configJson, defaultConfig) // 用 defaultConfig 写入 config.json
const translateMds = require('./bin/translateExports.js')

// and then, setObjectKey.js can require the new config.json 
// const {setObjectKey} = require('./src/setObjectKey.js')
const { writeDataToFile, insert_flg } = require('./src/writeDataToFile.js')
//ready
logger.info(chalk.blue('Starting 翻译')+chalk.red(dir));

// main func

// get floder markdown files Array
const getList = await Listmd(path.resolve(process.cwd(),dir))

logger.info(chalk.blue(`总文件数 ${getList.length}, 有些文件会跳过`));

let Done = 0
let noDone = []
function doneShow(str) {
    const s = ora(str).start()
    s.color = 'red'
    s.succeed()
}
let showAsyncnum = 0
async.mapSeries(getList,
  /**
   * @description async Translate filename value , Return true or false
   * @param {String} value
   * @returns {Boolean}
   */
  
  async function runTranslate(value){
    Done++
    
    let localDone = Done
    if(value.endsWith(`.${tranTo}.md`) || value.match(/\.[a-zA-Z]+\.md+/) || !value.endsWith('.md')) {
      logger.debug(chalk.blue(`翻译的 或者 不是 md 文件的 有 ${localDone}`));
      return true
    }
    if(!rewrite && fs.existsSync( insert_flg(value,`.${tranTo}`, 3 ))){
      logger.debug(chalk.blue(`已翻译, 不覆盖 ${localDone}`));
      return true
    }
    // throw new Error('why')
    showAsyncnum++
    let start = new Date().getTime();
    //
    const spinner = ora(`${process.pid} Loading translate .. ${path.basename(value)}  `)
    spinner.color = 'yellow'
    spinner.start();
    let _translateMds =  await translateMds([value, api, tranFr, tranTo],debug).then(data =>{
      let endtime = new Date().getTime() - start;
      //
  
      spinner.text +='get data'
      if(data.every(x =>x!='')){
        writeDataToFile(data, value) 
        spinner.text = `已搞定 第 ${localDone} 文件 - 并发${chalk.blue(showAsyncnum)} -- ${chalk.blue(endtime+'md')} - ${path.basename(value)} ` 
        spinner.succeed()
        showAsyncnum--
      return true
      }     
      spinner.text = `没完成 第 ${localDone} 文件 - 并发${chalk.blue(showAsyncnum)} -- ${chalk.blue(endtime+'md')} - ${value} `
      spinner.fail()
      
      showAsyncnum--
      // if(asyscNum)
      // throw new Error(`translate ${value} fail`)
      return false
  
    }).catch(x =>{
      console.log('bad ass $$$$$$$$$')
      throw x
    })
    return _translateMds
    //read each file
  },
(err, IsTranslateS) =>{
  if(err)throw err
  Done++
  if(IsTranslateS.every(x =>!!x)){
      doneShow(`All Done`)
  }else{
      doneShow(`Some No Done`)
  }
  console.log('map Limit outting')
}
)


function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

const time = 5000
let timeoutDone
console.log('while running')
while(Done){
  timeoutDone = Done
  await timeout(time)  //translate will change Done num
  // if time ms , the Done num is no change
  // may the project if freeze, this is Bug
  // bug i dont know , Bug from where
  // seem like when project running and the network no download speed
  // just like Frozen
  // keep 
  // const spinner = ora(`Loading translate .. ${path.basename(value)}  `)
  // that running 
  if(Done > getList.length){
    console.log(Done)
    break
  }
}
console.log('while outting')

// if(Done == getList.length){
//   throw new Error(`${time} ok`)

  
// }
// if(Done == timeoutDone){
//   console.log('/###################',process.pid)  
//   console.log(':))))))))))')
//   throw  new Error(`${time} timeout`)
//   console.log('/###################',process.pid)
// }
// }

// logger.info(getList) 
// false
// 因为 getList.map
// 困不住 await
// 用 for 才行
// ../bin/translateExports.js #44
})()
