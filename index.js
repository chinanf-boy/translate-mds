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
const ora = require('ora-min')
const chalk = require('chalk');
const remark = require('remark')

// option todo list
const { setDefault, debugTodo, fromTodo, toTodo, apiTodo, rewriteTodo, numTodo,matchAndSkip,typesTodo } = require('./src/optionsTodo.js')

// config
let defaultJson = './config/defaultConfig.json' // default config---
let defaultConfig = require(defaultJson) //---
let workOptions = require('./config/work-options')
let g = chalk.green
let y = chalk.cyan
let yow = chalk.yellow

// cli cmd
const cli = meow(`
Usage
  $ translateMds [folder name] [options]

Example
  $ translateMds md/

  ${chalk.blue('[options]')}

  ${g('-a   API')}      : default < baidu >

  ${y('{google|baidu|youdao}')}

  ${g('-f   from ')}    : default < en >

  ${g('-t   to   ')}    : default < zh >

  ${g('-N   num  ')}    : default < 5 >

  ${y('{async number}')}

  ${g('-R   rewrite')}  : default < false >

  ${y('{yes/no rewrite translate file}')}

🌟${chalk.magenta('[high user options]')}❤️

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

`);

const APIs = ['google','baidu','youdao']
// Fix write file Path is absoulte
var dir = cli.input[0]
if(!dir){
  return console.log(g("--> V"+cli.pkg.version),cli.help)
}

// default config
let debug = setDefault(cli.flags['D'], debugTodo, defaultConfig)
let tranFr = setDefault(cli.flags['f'], fromTodo, defaultConfig)
let tranTo = setDefault(cli.flags['t'], toTodo, defaultConfig)
let api = setDefault(cli.flags['a'], apiTodo, defaultConfig)
let rewrite = setDefault(cli.flags['R'], rewriteTodo, defaultConfig)
let asyncNum = setDefault(cli.flags['N'], numTodo, defaultConfig)
setDefault({n:cli.flags['M'],type:'M'}, matchAndSkip, defaultConfig)
setDefault({n:cli.flags['S'],type:'S'}, matchAndSkip, defaultConfig)
setDefault({n:cli.flags['T'],type:'T'}, typesTodo, defaultConfig)
let Force = cli.flags['F'] ? true : false
let COM = cli.flags['G'] ? true : false
defaultConfig.com = COM

// 用 更改的 defaultConfig 写入 workOptions
workOptions.setOptions(defaultConfig)

const { logger, loggerStart, loggerText, loggerStop } = require('./config/loggerConfig.js') // winston config
const translateMds = require('./src/translateMds.js')

// after workOptions ready
const { writeDataToFile, insert_flg } = require('./src/writeDataToFile.js')

console.log(chalk.blue('Starting 翻译')+chalk.red(dir+" with China source"));

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
loggerStart("++++ 😊")
async.mapLimit(getList, asyncNum, runTranslate,
  (err, IsTranslateS) =>{
                  if(err)throw err
                  Done++
                  if(IsTranslateS.every(x =>!!x)){
                      doneShow(`All Done`)
                  }else{
											if(debug !== 'debug'){
												doneShow(`Some No Done , ${yow("use")} cli-option${chalk.red(' { -D } ')} find the Err`)
											}
											if(!Force){
												doneShow(`Or ${yow("use")} cli-option${chalk.red(' { -F } ')} Force put the translate Result`)
											}
											if(debug === 'debug' || Force){
												doneShow(`[${g('DEBUG')}:${debug === 'debug'}|${g('Force')}:${Force}] mode`)
											}
									}
									loggerStop()
                  console.timeEnd("time")
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
    loggerText(chalk.blue(`- 已翻译的 - 或者 不是 md 文件的 ${localDone}`));
    return State
  }
  if( value.match(/\.[a-zA-Z]+\.md+/)){
		loggerText(chalk.blue(`- 有后缀为 *.国家简写.md 之类 看起来名字已翻译的
		避免出现 .zh.ja.md 的 情况，情况选择 原文件 .md ${localDone}`));
    return State
  }

  if(!rewrite && fs.existsSync( insert_flg(value,`.${tranTo}`, 3 ))){
    loggerText(chalk.blue(`已翻译, 不覆盖 ${localDone}`));
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

	if(State && !Err){
		spinner.start()
		spinner.text = `已搞定 第 ${localDone} 文件 - 并发${chalk.blue(showAsyncnum)} -- ${chalk.blue(endtime+'ms')} - ${path.basename(value)} `
		spinner.succeed()
	}else{
	State = false // translate no ok
	if(!State){ // write data no ok | translate no ok
		spinner.start()
		spinner.text = `没完成 第 ${localDone} 文件 - 并发${chalk.blue(showAsyncnum)} -- ${chalk.blue(endtime+'ms')} - ${path.relative(process.cwd(),value)} \n ${Err}`
		spinner.fail()
	}}

  showAsyncnum--
	loggerText('++++ 😊')

  return State
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

  if(Done > getList.length){
    break
	}
}
process.exit(0)
})()
