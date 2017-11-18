#!/usr/bin/env node
'use script'
const fs = require('fs')
const tjs = require('translation.js')
const {Listmd} = require('./src/readmd.js')
const { writeDataToFile } = require('./src/writeDataToFile.js')
const meow = require('meow');
const chalk = require('chalk');

// cli cmd 
const cli = meow(`
Usage
  $ translate-md-content [folder name]
Example
  $ translate-md-content md/
  

`);

var dir = cli.input[0]
if(!dir){
  return console.log(chalk.green("--> V"+cli.pkg.version,cli.help))
}
if(!dir.startsWith('/')){

  dir = '/' + dir
  console.log(chalk.blue('Starting 翻译')+chalk.red(dir));
}
// main func

( async function(){

// get floder markdown files Array
const getList = await Listmd(process.cwd()+dir)

//
getList.map((value) =>{

  if(value.endsWith('.zh.md'))return
  //read each file
  fs.readFile(value, 'utf8', (err, data) =>{
    
    console.log(chalk.green("翻译->"+value));

    // 去掉 文件中头的 部分 
    // ---
    // thing
    // ---

    data = cutMdhead(data)

    // tjs make data en to zh
    let api = "baidu"

    tjs
    .translate({
      text: data,
      api: api
    })
    .then(result => {
      console.log(chalk.yellow(`获得 ${api} 数据了~`));
      // get zh and -> write down same folder { me.md => me.zh.md }
      writeDataToFile(result.result, value) 

      // result 的数据结构见下文
    }).catch(error => {
      console.log(error.code)
    })
  })
})

})()
