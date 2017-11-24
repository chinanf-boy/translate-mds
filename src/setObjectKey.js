const tjs = require('translation.js')
const chalk = require('chalk')
const {logger} = require('../config/loggerConfig.js')
// get config.json
const configs = require('../config.json')
let tranF, tranT
tranF = configs['from']
tranT = configs['to']
logger.level = configs.logger.level

// get translate result
async function translateValue(value, api){
    let thisTranString
    if(value instanceof Array){
        thisTranString = value.join('\n')
    }else{
      console.log('value is string')
    }
    
    // logger.log('debug',thisTranString,value,'----- first')
    return tjs.translate({
                      text: thisTranString,
                      api: api,
                      from: tranF,
                      to: tranT
                    }).then(result => {
                      // result.result.length,value.length
                      logger.debug(chalk.yellow(`获得 ${api} 数据了~`));
                      // get zh and -> write down same folder { me.md => me.zh.md }
                      for (i in result.result){
                        if(!value[i]){
                          logger.log('debug','----------')
                        }
                        logger.log('debug','set- '+ chalk.green(value[i]) + ' to-> '+ chalk.yellow(result.result[i]))
                      }
                      
                      if(value.length > result.result.length){
                
                        return translateValue(value.slice(result.result.length),api).then(youdao =>{
                          
                          youdao.forEach(x => result.result.push(x))
                          logger.log('debug',JSON.stringify(result.result,null,2),chalk.cyan('集合 --------中 '))
                          return result.result
                      
                        })
                        // Promise.reject("bad youdao fanyi no get \\n")

                      }

                      // Bug translate.js return result.result Array
                      if(value.length != result.result.length){
                        return result.result
                      }

                      if(value.length ==  result.result.length){
                        return result.result
                      }
                    }).catch(error => {
                      logger.warn(api,chalk.red( error.code,'出现了啦，不给数据'))

                    })
      
}

let tranArray = []

async function setObjectKey(obj, api) {

    let allAPi = ['baidu','google','youdao']
    let thisTranArray 
    let resultArray
    let newObj = JSON.parse(JSON.stringify(obj))

    // put obj values to tranArray
    if(!deep(obj)){
      throw logger.error('no value', sum)
    }
    if(tranArray.length){
      thisTranArray = tranArray
      tranArray = []
    }else{
      return newObj
    }
    // translate tranArray to zh
    // logger.log(tranArray)
    

    allAPi = allAPi.filter(x => x!=api)
    while(!resultArray && allAPi.length >=0 ){
      logger.log('verbose',chalk.yellow('使用',api))
      resultArray = await translateValue(thisTranArray, api)
      api = allAPi.shift()
    }
    if(!resultArray ){
      throw logger.error(`获取信息错误,原因有二
      - 网络失联
      - 翻译源 api 失败
      `)
    }

    logger.log('debug',chalk.whiteBright('Result -->>'),chalk.green(resultArray))
    setdeep(newObj, resultArray)

    return newObj
}

let sum = 0

function deep(obj) {
    Object.keys(obj).forEach(function(key) {
      
      // no translate code content
    if(obj['type'] && obj['type'] === 'code'){
      return sum
    }
    (obj[key] && typeof obj[key] === 'object') && deep(obj[key])
    

    if(key === 'value' && obj[key] != null){
          tranArray.push(obj[key])
          sum++
    }
    });
    return sum
  };

function setdeep(obj, tranArrayZh) {
    Object.keys(obj).forEach(function(key) {
      
    if(obj['type'] && obj['type'] === 'code'){
        return sum
    }
    
    (obj[key] && typeof obj[key] === 'object') && setdeep(obj[key], tranArrayZh)

    if(key === 'value'){
          obj[key] = tranArrayZh.shift()
          tranArray.shift()
          sum--
    }
    });
    return sum
  };

  module.exports = { setObjectKey, translateValue, deep, setdeep }