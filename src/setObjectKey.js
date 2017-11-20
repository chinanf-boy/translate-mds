const tjs = require('translation.js')
const chalk = require('chalk')

function timeout(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  
function translateValue(value, api){
    return tjs.translate({
                      text: value,
                      api: api
                    })

}

let sum = 0

module.exports = async function setObjectKey(obj, api) {
    Object.keys(obj).forEach(async function(key) {
        
      (obj[key] && typeof obj[key] === 'object') && setObjectKey(obj[key], api)

      if(key === 'value' && obj[key] != null){
            sum = sum + 1
          obj[key] = await translateValue(obj[key], api).then(result => {
            console.log(chalk.yellow(`获得 ${api} 数据了~`));
            // get zh and -> write down same folder { me.md => me.zh.md }
            sum = sum - 1
          console.log('set- ',chalk.green(obj[key]),'to ', chalk.yellow(result.result[0]))
          
            return result.result[0]
          }).catch(error => {
            console.log(error.code)
            sum = sum - 1
          
          })
      }

    });
    while(sum > 0){
        await timeout(10)
    }
    return obj;
  };