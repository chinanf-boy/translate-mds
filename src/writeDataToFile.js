const fs = require('fs')
const { fixEntoZh } = require('./fixEntoZh')
const chalk = require('chalk');
const { logger } = require('../config/loggerConfig.js')
function insert_flg(str, flg, Uindex) {
    var newstr = "";
    if(!str || !flg){
        throw logger.error('你把什么放进来啦') 
    }
    var len = str.length
    var tmp = str.substring(0, len - Uindex);
    newstr = tmp + flg + str.substring(len-Uindex, len)
    return newstr;
}

const writeDataToFile = (data, file_dir) => {
    var zhfile
    if(!file_dir.endsWith('.md')){
        throw logger.error('没有 获得 md 文章') 
    }
    zhfile = insert_flg(file_dir, '.zh', 3)

    // data is Array
    //fixE2Z
    
    if(data instanceof Array){
        data = fixEntoZh(data).join("\n")
    }
    
    
    fs.writeFile(zhfile+'', data, (err) => {
        if (err) 
            throw err;
        logger.log('info',chalk.magenta( 'The new Zh file has been saved! -->> \n'),chalk.blue(zhfile));
        if(logger.level == 'debug'){
            logger.debug(chalk.red('translate-info.log in your Project'))
        }
    });
}

module.exports = {writeDataToFile, insert_flg}