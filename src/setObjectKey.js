const tjs = require('translation.js')
const chalk = require('chalk')

function translateValue(value, api){

    if(value instanceof Array){
        value = value.join('\n')
    }
    console.log(value,'=')
    return tjs.translate({
                      text: value,
                      api: api
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
    
    let resultArray = await translateValue(thisTranArray, api).then(result => {
      console.log(chalk.yellow(`获得 ${api} 数据了~`));
      // get zh and -> write down same folder { me.md => me.zh.md }
      for (i in result.result){
        console.log('set- '+ chalk.green(thisTranArray[i]) + ' to-> '+ chalk.yellow(result.result[i]))
      }
      // if(thisTranArray.length != )

      return result.result
    }).catch(error => {
      console.log(error.code)

    })
    
    console.log(resultArray)
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