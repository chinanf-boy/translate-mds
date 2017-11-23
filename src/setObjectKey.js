const tjs = require('translation.js')
const chalk = require('chalk')
const {logger} = require('../config/loggerConfig.js')
const configs = require('../config.json')
async function translateValue(value, api){
    let thisTranString
    if(value instanceof Array){
        thisTranString = value.join('\n')
    }
    // logger.log('debug',thisTranString,value,'----- first')
    return tjs.translate({
                      text: thisTranString,
                      api: api
                    }).then(result => {
                      logger.log('debug',chalk.yellow(`获得 ${api} 数据了~`,result.result.length,value.length));
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
                      logger.log('error',api,chalk.red( error.code,'出现了啦，不给数据'))

                    })
      
}

let tranArray = []

async function setObjectKey(obj, api) {
    for(i in configs.logger){
      logger[i] = configs.logger[i]
    }
    let allAPi = ['baidu','google','youdao']
    let thisTranArray 
    let resultArray
    let newObj = JSON.parse(JSON.stringify(obj))

    // put obj values to tranArray
    if(!deep(obj)){
      logger.log('error obj','里面没 value')
      throw logger.error('no value', sum)
    }
    if(tranArray.length){
      thisTranArray = tranArray
      tranArray = []
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