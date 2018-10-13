const Dconfig = require('./defaultConfig.json')

let Options = Dconfig

function setOptions(options){
	Options = options
}

function getOptions(){
	return Options
}

module.exports = {
	setOptions,
	getOptions
}
