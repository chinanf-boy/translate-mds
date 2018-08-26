#!/usr/bin/env node
( async function(){
'use script'
process.on('uncaughtException', function(err){
  console.error('got an error: %s', err);
  process.exitCode = 1;
});

const whatTime = require('what-time');
const minimatch = require('minimatch');
const async = require('async')
const fs = require('fs')
const asyncfs = require('mz/fs')
const path = require('path')
const {Listmd} = require('./src/readmd.js')
const meow = require('meow');
const remark = require('remark')

const mergeConfig = require('./config/mergeConfig.js')

let {g,y,yow,m,b,r,relaPath,insert_flg} = require('./src/util.js')

// cli cmd
const cli = meow(`
Usage
  $ translateMds [folder/file name] [options]

Example
  $ translateMds md/

  ${b('[options]')}
  ${g('-a   API')}      : default < baidu > ${y('{google|baidu|youdao}')}
  ${g('-f   from ')}    : default < en >
  ${g('-t   to   ')}    : default < zh >
  ${g('-N   num  ')}    : default < 1 > ${y('{async number}')}
  ${g('-R   rewrite')}  : default < false > ${y('{yes/no rewrite translate file}')}

🌟${m('[high user options]')}❤️

  ${g('-D   debug')}
  ${g('-G   google.com')}      : default: false  ${y('{ cn => com with Google api }')}
  ${g('-F   force')}           : default: false  ${y('{ If, translate result is no 100%, force wirte md file }')}
  ${g('-M   match')}           : default [ ". ", "! "//...] ${y('{match this str, merge translate result }')}
  ${g('-S   skips')}           : default ["... ", "etc. ", "i.e. "] ${y('{match this str will, skip merge translate result }')}
  ${g('-T   types')}           : default ["html", "code"] ${y('{pass the md AST type}')}
  ${g('--timewait ')}          : default < 80 > ${y('{each fetch api wait time}')}
  ${g('--values [path]')}      : default: false ${y('{write the original of wait for translate file}')} ${r('[single file])')}
  ${g('--translate [path]')}   : default: false ${y('{use this file translate}')} ${r('[single file]')}
  ${g('--glob [pattern]')}     : default: false ${y('{file must be match, then be transalte}')}
  ${g('--skip [relative file/folder]')} : default: false ${y('{skip the file/folder}')}

`);

// Fix write file Path is absoulte
var dir = cli.input[0]
if(!dir){
  return console.log(g("--> v"+cli.pkg.version),cli.help)
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

const { logger, loggerStart, loggerText, loggerStop, oneOra } = require('./config/loggerConfig.js') // winston config

// after workOptions ready
const { writeDataToFile } = require('./src/writeDataToFile.js')

console.log(b('Starting 翻译')+r(dir));

// get floder markdown files Array
const getList = await Listmd(path.resolve(process.cwd(),dir))

console.log(b(`总文件数 ${getList.length}, 有些文件会跳过`));

let Done = 0
let noDone = []
let showAsyncnum = 0
const pattern = cli.flags['glob'] || false

loggerStart("translate running ...")
async.mapLimit(getList, asyncNum, runTranslate,
  (err, IsTranslateS) =>{
                  loggerStop()

                  if(err)throw err

                  Done++
                  if(IsTranslateS.every(x =>!!x)){
                      oneOra(`All Done`)
                  }else{
                      if(debug !== 'debug'){
                        oneOra(`Some No Done , ${yow("use")} cli-option${r(' { -D } ')} find the Err`)
                      }
                      if(!Force){
                        oneOra(`Or ${yow("use")} cli-option${r(' { -F } ')} Force put the translate Result`)
                      }
                      if(debug === 'debug' || Force){
                        oneOra(`[${g('DEBUG')}:${debug === 'debug'}|${g('Force')}:${Force}] mode`)
                      }
                  }
                  oneOra(`time:${whatTime(process.uptime())}`)
                }
)

/**
 * @description async Translate filename value , Return true or false
 * @param {String} value
 * @returns {Boolean}
 */

async function runTranslate(value){
  let rePath = relaPath(value)
  loggerText(`++++ <😊 > ${rePath}`)

  let State = true
  Done++

  let localDone = Done

  // filter same file
  if(value.endsWith(`.${tranTo}.md`) || !value.endsWith('.md')) {
    loggerText(b(`- 翻译的 - 或者 不是 md 文件的 ${rePath}`));
    return State
  }
  if(value.match(/\.[a-zA-Z]+\.md+/)){
    loggerText(b(`- 有后缀为 *.国家简写.md  ${rePath}`));
    return State
  }
  if(!rewrite && fs.existsSync( insert_flg(value,`.${tranTo}`, 3 ))){
    loggerText(b(`已翻译, 不覆盖 ${rePath}`));
    return State
  }
  if(pattern && !minimatch(value,pattern,{ matchBase: true })){
    loggerText(b(`glob, no match ${rePath}`));
    return State
  }
  if(cli.flags['skip'] && value.includes(path.resolve(cli.flags['skip']))){
    loggerText(b(`skip, ${rePath}`));
    return State
  }

  loggerText(`1. do 第${localDone}文件 ${rePath}`)

  // open async num
  showAsyncnum++
  let startTime = new Date().getTime();


  let _translateMds =  await translateMds([value, api, tranFr, tranTo],debug, true)

  // succeed / force wirte data
  if(_translateMds.every(x =>!x.error && x.text) || Force ){ // translate no ok

    let _tranData = _translateMds.map(x =>x.text) // single file translate data

    await writeDataToFile(_tranData, value).then(text =>loggerText(text))
  }

  let Err
  for(let _t of _translateMds){
    if(_t.error){
      Err =  _t.error
      break
    }
  }

  let endtime = new Date().getTime() - startTime;
  let humanTime = whatTime(endtime / 1000)

  if(State && !Err){
    oneOra(`已搞定 第 ${localDone} 文件 - 并发${b(showAsyncnum)} -- ${b(humanTime)} - ${rePath}`)
  }else{
  State = false // translate no ok
  if(!State){ // write data no ok | translate no ok
    noDone.push(value) // if process exit code
    oneOra(`没完成 第 ${localDone} 文件 - 并发${b(showAsyncnum)} -- ${b(humanTime)} - ${rePath} \n ${Err}`,'fail')
  }}

  showAsyncnum--
  loggerText('++++ <😊 />')

  return State
}

const { time } = require('./src/util.js')

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
