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

// Object to Array
function O2A(options){
    let {aFile, api, tF, tT} = options
    return [aFile, api, tF, tT]
}

/**
 * @description translateMds main 
 * @param {Array|Object} options 
 * @param {Boolean|String} debug 
 * @param {boolean} [isCli=false] 
 * @returns {Array<String>}
 */
async function translateMds(options,debug,isCli = false){

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
    if(!isCli){
        debug = setDefault(debug, debugTodo, defaultConfig)
        tranFrom = setDefault(tranFrom, fromTodo, defaultConfig)
        tranTo = setDefault(tranTo, toTodo, defaultConfig)
        api = setDefault(api, apiTodo, defaultConfig)
    
        // rewrite config.json
        await writeJson(jsonFile, defaultConfig) 
    }
    logger.level = debug

    // setObjectKey.js after rewrite config.json
    const {setObjectKey} = require('../src/setObjectKey.js') 

    async function t(data){

        let head,mdAst,translateMdAst
        [body, head] = cutMdhead(data)
        
        // to AST
        mdAst = remark.parse(body)

        // translate Array
        translateMdAst = await setObjectKey(mdAst, api)

        if(translateMdAst){
            // Ast to markdown 
            body = remark.stringify(translateMdAst)
            return head+'\n'+body
        }

        return translateMdAst
    }

    let results = []

    // get floder markdown files Array
    const getList = await Listmd(absoluteFile)

    for (i in getList){
        let value = getList[i]

        // 去掉 .**.zh 的后缀 和 自己本身 .match(/\.[a-zA-Z]+\.md+/)
        if(value.endsWith(`.${tranTo}.md`) || value.match(/\.[a-zA-Z]+\.md+/) || !value.endsWith('.md'))continue
        
        let readfile = await fs.readFile(value, 'utf8')

        let _translate = await t(readfile).then(x =>x).catch(x => {
                        logger.debug(x)
                        return false
                        })

            if(_translate){
                results.push(_translate)
            }else{
                results.push('')
            }

    }

    return results
}


module.exports = translateMds