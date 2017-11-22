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
const {setObjectKey} = require('../src/setObjectKey.js') 
const writeJson  = require('../util/writeJson.js')


async function translateMds(absoluteFile, api){

let results = []
if(!absoluteFile || !path.isAbsolute(absoluteFile)){
    throw logger.error('translateMds no absoluteFile arg or absoluteFile is no absolute ')
}else if(!api){
    api = jsonText.api
}
logger.info(chalk.blue('Starting 翻译')+chalk.red(absoluteFile));
// get floder markdown files Array
const getList = await Listmd(absoluteFile)


for (i in getList){
    let value = getList[i]

    if(value.endsWith('.zh.md'))return
    
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

    results.push(_translate)
        }

return results
}


module.exports = translateMds