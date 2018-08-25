#!/usr/bin/env node
( async function(){
'use script'
process.on('uncaughtException', function(err){
  console.error('got an error: %s', err);
  process.exitCode = 1;
});

const whatTime = require('what-time');
const async = require('async')
const fs = require('fs')
const asyncfs = require('mz/fs')
const path = require('path')
const {Listmd} = require('./src/readmd.js')
const meow = require('meow');
const ora = require('ora-min')
const remark = require('remark')

const mergeConfig = require('./config/mergeConfig')

let {g,y,yow,m,b,r} = require('./src/util')

// cli cmd
const cli = meow(`
Usage
  $ translateMds [folder name] [options]

Example
  $ translateMds md/

  ${b('[options]')}

  ${g('-a   API')}      : default < baidu >

  ${y('{google|baidu|youdao}')}

  ${g('-f   from ')}    : default < en >

  ${g('-t   to   ')}    : default < zh >

  ${g('-N   num  ')}    : default < 1 >

  ${y('{async number}')}

  ${g('-R   rewrite')}  : default < false >

  ${y('{yes/no rewrite translate file}')}

🌟${m('[high user options]')}❤️

  ${g('-D   debug')}

  ${g('-G   google.com')} : default < false >

  ${y('{ cn => com with Google api }')}

  ${g('-F   force')}    : default < false >

  ${y('{ If, translate result is no 100%, force wirte md file }')}

  ${g('-M   match')}    : default [ ". ", "! ", "; ", "！", "? ", "e.g. "]

  ${y('{match this str, merge translate result }')}

  > use: -M ". ,! ,"

  ${g('-S   skips')}    : default ["... ", "etc. ", "i.e. "]

  ${y('{match this str will, skip merge translate result }')}

  > use: -S "... ,etc. "

  ${g('-T   types')}    : default ["html", "code"]

  ${y('{pass the md AST type}')}

  > use: -T "h1"

  ${g('--timewait ')}    : default: 80

  ${y('{each fetch api wait time}')}

`);

const APIs = ['google','baidu','youdao']
// Fix write file Path is absoulte
var dir = cli.input[0]
if(!dir){
  return console.log(g("--> V"+cli.pkg.version),cli.help)
}

// merge config
let {
  debug,
  tranFr,
  tranTo,
  api,
  rewrite,
  asyncNum,
  Force
} = mergeConfig(cli)

const translateMds = require('./src/translateMds.js')

const { logger, loggerStart, loggerText, loggerStop } = require('./config/loggerConfig.js') // winston config

// after workOptions ready
const { writeDataToFile, insert_flg } = require('./src/writeDataToFile.js')

console.log(b('Starting 翻译')+r(dir));

// main func

// get floder markdown files Array
const getList = await Listmd(path.resolve(process.cwd(),dir))

console.log(b(`总文件数 ${getList.length}, 有些文件会跳过`));

let Done = 0
let noDone = []
function doneShow(str) {
    const s = ora(str).start()
    s.color = 'red'
    s.succeed()
}
let showAsyncnum = 0
loggerStart("++++ 😊")
async.mapLimit(getList, asyncNum, runTranslate,
  (err, IsTranslateS) =>{
                  if(err)throw err
                  Done++
                  if(IsTranslateS.every(x =>!!x)){
                      doneShow(`All Done`)
                  }else{
                      if(debug !== 'debug'){
                        doneShow(`Some No Done , ${yow("use")} cli-option${r(' { -D } ')} find the Err`)
                      }
                      if(!Force){
                        doneShow(`Or ${yow("use")} cli-option${r(' { -F } ')} Force put the translate Result`)
                      }
                      if(debug === 'debug' || Force){
                        doneShow(`[${g('DEBUG')}:${debug === 'debug'}|${g('Force')}:${Force}] mode`)
                      }
                  }
                  loggerStop()
                  doneShow(`time:${whatTime(process.uptime())}`)
                }
)

/**
 * @description async Translate filename value , Return true or false
 * @param {String} value
 * @returns {Boolean}
 */

async function runTranslate(value){
  let State = true

  Done++

  let localDone = Done


  // filter same file
  if(value.endsWith(`.${tranTo}.md`) || !value.endsWith('.md')) {
    loggerText(b(`- 已翻译的 - 或者 不是 md 文件的 ${localDone}`));
    return State
  }
  if( value.match(/\.[a-zA-Z]+\.md+/)){
    loggerText(b(`- 有后缀为 *.国家简写.md 之类 看起来名字已翻译的
    避免出现 .zh.ja.md 的 情况，情况选择 原文件 .md ${localDone}`));
    return State
  }

  if(!rewrite && fs.existsSync( insert_flg(value,`.${tranTo}`, 3 ))){
    loggerText(b(`已翻译, 不覆盖 ${localDone}`));
    return State
  }

  loggerText(`1. do 第${localDone}文件 ${path.basename(value)}`)

  // open async num
  showAsyncnum++
  let start = new Date().getTime();


  let _translateMds =  await translateMds([value, api, tranFr, tranTo],debug, true)
  let endtime = new Date().getTime() - start;

  const spinner = ora("single file final ending")
  let Err
  if(_translateMds.every(x =>!x.error && x.text) || Force ){ // translate no ok

    let _tranData = _translateMds.map(x =>x.text)

    await writeDataToFile(_tranData, value).then(text =>loggerText(text)).catch(Err =>{
      State = false // write data no ok
      Err = Err.message
      loggerText(Err.message, {level:"error"})
    })
  }

  for(let _t of _translateMds){
    if(_t.error){
      Err =  _t.error
      break
    }
  }

  let rePath = path.relative(process.cwd(),value)
  let humanTime = whatTime(endtime / 1000)
  if(State && !Err){
    spinner.start()
    spinner.text = `已搞定 第 ${localDone} 文件 - 并发${b(showAsyncnum)} -- ${b(humanTime)} - ${rePath} `
    spinner.succeed()
  }else{
  State = false // translate no ok
  if(!State){ // write data no ok | translate no ok
    noDone.push(value) // if process exit code
    spinner.start()
    spinner.text = `没完成 第 ${localDone} 文件 - 并发${b(showAsyncnum)} -- ${b(humanTime)} - ${rePath} \n ${Err}`
    spinner.fail()
  }}

  showAsyncnum--
  loggerText('++++ 😊')

  return State
}

const { time } = require('./src/util')

// async.mapLimit will outside, must lock in
while(Done){
  const t = 100
  await time(t)

  if(Done > getList.length){
    break;
  }
}
if(noDone.length){
  process.exitCode = 1
}
process.on('exit', function(err){
  loggerStop()
});
})()
