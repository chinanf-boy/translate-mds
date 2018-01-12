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

/**
 * @description 
 * @param {String|String[]} value 
 * @param {String} api 
 * @returns {String}
 */
async function translateValue(value, api){
    let thisTranString
    if(value instanceof Array){
        thisTranString = value.join('\n')
    }else{
      thisTranString = value
    }
    if(api == 'youdao' && tranT === 'zh'){
      tranT = tranT + '-CN'
    }
    // logger.log('debug',thisTranString,value,'----- first')
    return tjs.translate({
                      text: thisTranString,
                      api: api,
                      from: tranF,
                      to: tranT
                    }).then(result => {
                      if(!result.result){
                        throw new Error('「结果为空」')
                      }
                      if(value.length ==  result.result.length){
                        return result.result
                      }
                      // result.result.length,value.length
                      logger.debug(chalk.yellow(`获得 ${api} 数据了~`));
                      // get zh and -> write down same folder { me.md => me.zh.md }
                      logger.log('debug','----------\n')                      
                      for (i in result.result){
                        if(!value[i]){

                          logger.log('debug','--no equal--------\n')
                        }
                        logger.log('debug','set- '+ chalk.green(value[i]) + ' to-> '+ chalk.yellow(result.result[i]))
                        
                      }
                      
                      // logger.log('error',value.length)
                      if(value.length > result.result.length){
                        return translateValue(value.slice(result.result.length),api).then(youdao =>{
                          // tjs translate youdao BUG and tjs baidu will return undefined
                          if(youdao){
                            if(youdao instanceof Array){
                              youdao.forEach(x => result.result.push(x))
                            }else{
                              result.result.push(youdao)
                            }
                          }
                          logger.log('debug',JSON.stringify(result.result,null,2),chalk.cyan('集合 --------中 '))
                          return result.result
                      
                        }).catch(x => logger.error(`${youdao}炸了`,x))
                        // Promise.reject("bad youdao fanyi no get \\n")

                      }

                      // Bug translate.js return result.result Array
                      if(value.length < result.result.length){
                        logger.debug(`___________
                        get the result is not equal , so + the final result 
                        ************`)
                        let r_v = result.result.length - value.length
                        for(let i= 0;i<r_v;i++){
                          result.result[value.length-1] += result.result[value.length + i]
                        }
                        // when \n in text medium，return 2 size Array
                        return result.result
                      }


                    }).catch(error => {
                      if(!error.code){
                        logger.debug(api,chalk.red( error,'tjs-程序错误'))
                      }else{
                        logger.debug(api,chalk.red( error.code,'出现了啦，不给数据'))
                      }
                      return ""

                    })
      
}

/**
 * @description translate AST Key == value, return new Object 
 * @param {Object} obj - AST
 * @param {String} api - defuault api
 * @returns {Object} - newObject 
 */
async function setObjectKey(obj, api) {

    let allAPi = ['baidu','google','youdao']
    let tranArray = []
    let thisTranArray = []
    let resultArray = []
    let newObj = JSON.parse(JSON.stringify(obj))
    let sum = 0 // single values
    /**
     * @description Find ``obj['type'] === 'value'`` ,and``tranArray.push(obj[key])``
     * @param {Object} obj 
     * @param {String[]} tranArray 
     * @returns {number} - find value number
     */
    function deep(obj, tranArray) {
      Object.keys(obj).forEach(function(key) {
        
        // no translate code content
      if(obj['type'] && ( obj['type'] === 'html' || obj['type'] === 'code')){
        return sum
      }
      (obj[key] && typeof obj[key] === 'object') && deep(obj[key], tranArray)
      

      if(key === 'value' && obj[key].trim()){
            tranArray.push(obj[key])
            sum++
      }
      });
      return sum
    };

    /**
     * @description Find ``obj['type'] === 'value'``, and use ``tranArrayZh.shift`` set ``obj['value']`` 
     * @param {any} obj - AST
     * @param {String[]} tranArrayZh 
     * @returns 
     */
    function setdeep(obj, tranArrayZh) {
      Object.keys(obj).forEach(function(key) {
        
      if(obj['type'] && ( obj['type'] === 'html' || obj['type'] === 'code')){
          return sum
      }
      
      (obj[key] && typeof obj[key] === 'object') && setdeep(obj[key], tranArrayZh)
  
      if(key === 'value' && obj[key].trim()){
            if(tranArrayZh.length){
              obj[key] = tranArrayZh.shift()
              sum--
            }
      }
      });
      return sum
      };

    // put obj values to tranArray
    if(!deep(obj, tranArray)){      
      logger.error('no value', sum)
      return false
    }
    if(tranArray.length){

      // remove all \n
      tranArray = tranArray.map(x=>{
        if(x.indexOf('\n')>=0){
          return x.replace(/[\n]/g,'')
        }
        return x
      })
      thisTranArray = tranArray
      tranArray = []
    }
    // translate tranArray to zh
    allAPi = allAPi.filter(x => x!=api)
    allAPi.push(api)
    for(let i in allAPi){
      logger.log('debug',chalk.yellow('使用',api,'\n'))  
      
      resultArray = await translateValue(thisTranArray, api)
      api = allAPi[i]

      if(resultArray && resultArray.length>=thisTranArray.length){
        break
      }
    }

    //BUG------
    // while(thisTranArray && (resultArray.length<thisTranArray.length) && allAPi.length >=0 && api){
    //   logger.log('debug',chalk.yellow('使用',api))  
    //   resultArray = await translateValue(thisTranArray, api)
    //   api = allAPi.shift()
    // }
    if(!resultArray ||(resultArray.length<thisTranArray.length)){
      logger.debug(`
      获取信息错误,原因有3
      - 网络失联
      - 翻译源 失败
      - 抽风
      `)
      return false
    }

    // if(sum != 0)console.log(resultArray.length,'sum', thisTranArray.length)
    logger.log('debug',chalk.whiteBright('Result -->>'),chalk.green(resultArray))
    setdeep(newObj, resultArray)
    // if(sum != 0)console.log(sum,'sum')
    
    return newObj
}

module.exports = { setObjectKey, translateValue }