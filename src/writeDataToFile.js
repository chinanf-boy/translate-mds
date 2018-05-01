const fs = require('fs')
const chalk = require('chalk');
const { logger } = require('../config/loggerConfig.js')
const { getOptions } = require('../config/work-options.js')
let configs = getOptions()
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
    if(data instanceof Array){
        data = data.join("\n")
    }


    fs.writeFile(zhfile+'', data, (err) => {
        if (err)
            throw err;
        logger.debug(chalk.magenta( `\n ${tranT} file saved! -->> \n`),chalk.blue(zhfile));
    });
}

module.exports = {writeDataToFile, insert_flg}
