'use script'
const fs = require('mz/fs')
const path = require('path')
const tjs = require('translation.js')
const {Listmd} = require('../src/readmd.js')
const { writeDataToFile } = require('../src/writeDataToFile.js')
const meow = require('meow');
const chalk = require('chalk');
const cutMdhead = require('../src/cutMdhead.js')
const remark = require('remark')
const { logger } = require('../config/loggerConfig.js') // winston config
let defaultJson = '../config/defaultConfig.json' // default config---
let jsonText = require(defaultJson) //---
let jsonFile = path.resolve(__dirname, '../config.json')
const writeJson  = require('../util/writeJson.js')


async function translateMds(options,debug){
if(!(options instanceof Array)){
    throw logger.error('args options is Array [absoluteFile, api]')
}
let [absoluteFile, api] = options
let results = []
if(!absoluteFile || !path.isAbsolute(absoluteFile)){
    throw logger.error('translateMds no absoluteFile arg or absoluteFile is no absolute ')
}else if(!api){
    api = jsonText.api
}

if(debug){
    jsonText.logger.level = 'debug'
    await writeJson(jsonFile, jsonText) 
  }else{
    // rewrite config.json  
    await writeJson(jsonFile, jsonText)
  }


logger.info(chalk.blue('Starting 翻译')+chalk.red(absoluteFile));
// get floder markdown files Array
const getList = await Listmd(absoluteFile)
const {setObjectKey} = require('../src/setObjectKey.js') 

for (i in getList){
    let value = getList[i]
    
    if(value.endsWith('.zh.md'))continue
    
    let _translate = await fs.readFile(value, 'utf8').then(async (data) =>{
        
                let head
                [body, head] = cutMdhead(data)

                // to AST
                let mdAst = remark.parse(body)
                
                mdAst = await setObjectKey(mdAst, api)
                
                // Ast to markdown
                body = remark.stringify(mdAst)

            
                return head+'\n'+body
                // writeDataToFile(head+'\n'+body, value) 
            
            }).catch(x => logger.error('can not translate'))

    // logger.info(_translate)
    results.push(_translate)
}
return results
}


module.exports = translateMds