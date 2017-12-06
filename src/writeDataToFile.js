const fs = require('fs')
const { fixEntoZh } = require('./fixEntoZh')
const chalk = require('chalk');
const { logger } = require('../config/loggerConfig.js')
const configs = require('../config.json')
const tranT = configs.to
function insert_flg(str, flg, Uindex) {
    var newstr = "";
    if(!str || !flg){
        throw logger.error('filename<',str,'>can not add',flg) 
    }
    var len = str.length
    var tmp = str.substring(0, len - Uindex);
    newstr = tmp + flg + str.substring(len-Uindex, len)
    return newstr;
}

const writeDataToFile = (data, file_dir) => {
    var zhfile
    if(!file_dir.endsWith('.md')){
        logger.verbose(file_dir,chalk.green('no md file,just go away'))
        return false
    }
    zhfile = insert_flg(file_dir, `.${tranT}`, 3)

    // data is Array
    //fixE2Z
    
    if(data instanceof Array){
        data = fixEntoZh(data).join("\n")
    }
    
    
    fs.writeFile(zhfile+'', data, (err) => {
        if (err) 
            throw err;
        logger.log('verbose',chalk.magenta( `\n ${tranT} file saved! -->> \n`),chalk.blue(zhfile));
        logger.debug(chalk.red('translate-info.log in your Project'))
    });
}

module.exports = {writeDataToFile, insert_flg}