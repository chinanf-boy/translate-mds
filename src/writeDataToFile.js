const fs = require('fs')
const { m,insert_flg,relaPath,g } = require('./util')
const {
	logger
} = require('./config/loggerConfig.js')
const {
	getOptions
} = require('./config/work-options.js')
let configs = getOptions()
const tranT = configs.to


const writeDataToFile = async (data, file_dir) => {
	return new Promise((ok, Err) => {
		try{

			let zhfile
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
				ok(`4. ${m(tranT)} file saved! -->> ${g(relaPath(zhfile))}`)
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
