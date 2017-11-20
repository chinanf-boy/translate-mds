#!/usr/bin/env node
'use script'
const fs = require('fs')
const tjs = require('translation.js')
const {Listmd} = require('./src/readmd.js')
const { writeDataToFile } = require('./src/writeDataToFile.js')
const meow = require('meow');
const chalk = require('chalk');
const cutMdhead = require('./src/cutMdhead.js')
const remark = require('remark')
const setObjectKey = require('./src/setObjectKey.js')
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
getList.map(async (value) =>{

  if(value.endsWith('.zh.md'))return
  //read each file
  fs.readFile(value, 'utf8',async (err, data) =>{
    
    console.log(chalk.green("翻译->"+value));

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
    mdAst = await setObjectKey(mdAst)

    // Ast to markdown
    body = remark.stringify(mdAst)

    writeDataToFile(head+body, value) 

    // console.log(chalk.red(bodyAll))

  })
})

})()
