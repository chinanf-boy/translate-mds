'use script'
const fs = require('mz/fs')
const path = require('path')
const tjs = require('translation.js')
const {Listmd} = require('../src/readmd.js')
const meow = require('meow');
const chalk = require('chalk');
const cutMdhead = require('../src/cutMdhead.js')
const remark = require('remark')
const { logger } = require('../config/loggerConfig.js') // winston config
let defaultJson = '../config/defaultConfig.json' // default config---
let defaultConfig = require(defaultJson) //---
let jsonFile = path.resolve(__dirname, '../config.json')
const writeJson  = require('../util/writeJson.js')
//
let done = 0
const { setDefault, debugTodo, fromTodo, toTodo, apiTodo } = require('../src/optionsTodo.js')
// Main Function
function O2A(options){
    let {aFile, api, tF, tT} = options
    return [aFile, api, tF, tT]
}

/**
 * @description translateMds main 
 * @param {Array|Object} options 
 * @param {Boolean|String} debug 
 * @returns {Array<String>}
 */
async function translateMds(options,debug){

    let absoluteFile, api, tranFrom, tranTo
    if(!options) throw logger.error('options is NULL')

    // options is Array or Object
    if(options instanceof Array){
        [absoluteFile, api, tranFrom, tranTo] = options
    }else if(options instanceof Object){
        [absoluteFile, api, tranFrom, tranTo] = O2A(options)
    }
    // file is absolute
    if(!absoluteFile || !path.isAbsolute(absoluteFile)){
        throw logger.error('translateMds absoluteFile is no absolute ')
    }
    // change defaultConfig from options
    // return first option
    debug = setDefault(debug, debugTodo, defaultConfig)
    logger.level = debug
    tranFrom = setDefault(tranFrom, fromTodo, defaultConfig)
    tranTo = setDefault(tranTo, toTodo, defaultConfig)
    api = setDefault(api, apiTodo, defaultConfig)

    // rewrite config.json
    // Error: this json error here , see test "async translate"
await writeJson(jsonFile, defaultConfig) 

// and then, setObjectKey.js can require the new config.json 
const {setObjectKey} = require('../src/setObjectKey.js') 
// const { writeDataToFile } = require('../src/writeDataToFile.js')

async function t(data){

    let head,mdAst,translateMdAst
    [body, head] = cutMdhead(data)
    // to AST
    try{
    mdAst = remark.parse(body)
    }catch(x){
    console.log('remark parse error')
    throw x
    }
    try{
        // translate AST value
    translateMdAst = await setObjectKey(mdAst, api)
    }catch(x){
    console.log(' translate error')
    throw x
    }
    try{
    if(translateMdAst){
        // Ast to markdown 
        body = remark.stringify(translateMdAst)
        return head+'\n'+body
    }
    }catch(x){
    console.log(chalk.red('remark stringify error'))
        throw x
    }
    // console.log('t','-----------t')
    return translateMdAst
}
//
let results = []

logger.verbose(chalk.blue('Starting 翻译')+chalk.red(absoluteFile));
// get floder markdown files Array
const getList = await Listmd(absoluteFile)

for (i in getList){
    let value = getList[i]
    // 去掉 .**.zh 的后缀 和 自己本身 .match(/\.[a-zA-Z]+\.md+/)
    if(value.endsWith(`.${tranTo}.md`) || value.match(/\.[a-zA-Z]+\.md+/) || !value.endsWith('.md'))continue
    let readfile = await fs.readFile(value, 'utf8')
    let _translate = await t(readfile).then(x =>x).catch(x => {
                    console.log(x)
                    return false
                    })

    // logger.info(_translate)
        if(_translate){
            results.push(_translate)
        }else{
            results.push('')
        }
        // console.trace(chalk.red('look me'))

    }
// logger.error(++done,'---------------------')
return results
}


module.exports = translateMds