const fs = require('fs')
const chalk = require('chalk');
const {
	logger
} = require('../config/loggerConfig.js')
const {
	getOptions
} = require('../config/work-options.js')
let configs = getOptions()
const tranT = configs.to

function insert_flg(str, flg, Uindex) {
	var newstr = "";
	if (!str || !flg) {
		throw TypeError('filename<' + str + '> can not add' + flg)
	}
	var len = str.length
	var tmp = str.substring(0, len - Uindex);
	newstr = tmp + flg + str.substring(len - Uindex, len)
	return newstr;
}

const writeDataToFile = async (data, file_dir) => {
	return new Promise((ok, Err) => {
		try{

			var zhfile
			if (!file_dir.endsWith('.md')) {
				Err("no md file,just go away")
			}
			require.resolve(file_dir)

			zhfile = insert_flg(file_dir, `.${tranT}`, 3)

			// data is Array
			if (data instanceof Array) {
				data = data.join("\n")
			}


			fs.writeFile(zhfile + '', data, (err) => {
				if (err)
					Err(err);
				ok(`4. ${chalk.magenta(tranT)} file saved! -->> \n ${zhfile}`)
			});

		}catch(err){
			Err(err)
		}
	})
}

module.exports = {
	writeDataToFile,
	insert_flg
}
