const tjs = require('translation.js')
const chalk = require('chalk')

async function translateValue(value, api){
    let thisTranString
    if(value instanceof Array){
        thisTranString = value.join('\n')
    }
    // console.log(thisTranString,value,'----- first')
    return tjs.translate({
                      text: thisTranString,
                      api: api
                    }).then(result => {
                      console.log(chalk.yellow(`获得 ${api} 数据了~`,result.result.length,value.length));
                      // console.log(result.result)
                      // get zh and -> write down same folder { me.md => me.zh.md }
                      for (i in result.result){
                        console.log('set- '+ chalk.green(value[i]) + ' to-> '+ chalk.yellow(result.result[i]))
                      }
                      
                      if(value.length > result.result.length){
                        // console.log(value.slice(result.result.length),'-------youdao')

                        return translateValue(value.slice(result.result.length),api).then(youdao =>{
                          // console.log(youdao,'-------inside')
                          youdao.forEach(x => result.result.push(x))
                          // console.log(result.result,'all --------all ')
                          return result.result
                      
                        })
                        // Promise.reject("bad youdao fanyi no get \\n")

                      }
                      // console.log(result.result,'--------outside')

                      // Bug translate.js return result.result Array
                      // if(value.length != result.result.length){
                      //   return result.result
                      // }

                      if(value.length ==  result.result.length){
                        return result.result
                      }
                    }).catch(error => {
                      console.log(error.code)

                    })
      
}

let tranArray = []

async function setObjectKey(obj, api) {
    let thisTranArray 
    let newObj = JSON.parse(JSON.stringify(obj))

    // put obj values to tranArray
    if(!deep(obj)){
      throw new Error('no value', sum)
    }
    if(tranArray.length){
      thisTranArray = tranArray
      tranArray = []
    }
    // translate tranArray to zh
    // console.log(tranArray)
    
    let resultArray = await translateValue(thisTranArray, api)
    
    console.log(chalk.whiteBright('result'),chalk.green(resultArray))
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