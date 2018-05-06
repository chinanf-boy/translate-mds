const winston = require('winston');
const ora = require("ora")

// 获得日志等级
const {
	getOptions
} = require('./work-options.js')
const configs = getOptions()

var logger = new(winston.Logger)({
	level: 'info',
	transports: [
		new(winston.transports.Console)({
			datePattern: '.yyyy-MM-ddTHH-mm',
			colorize: true
		}),
		new(winston.transports.File)({
			filename: 'translate-info.log',
			handleExceptions: true,
			maxsize: 52000,
			maxFiles: 1,
			level: 'info',
			colorize: true
		})
	]
});

logger.level = configs.logger.level

const D = configs.logger.level === 'debug'

// 日志接口

let LOGGER;

/**
 * @description start logger
 * @param {any} str
 * @param {string} level
 */
function loggerStart(str, level = 'debug'){

	if (!D) {
		LOGGER = ora(str).start()
	} else {
		LOGGER = logger
		LOGGER[level](str)
	}
}

/**
 * @description set logger text
 * @param {String} str
 * @param {string} options.level
 * @param {string} options.color *
 */
function loggerText(str, options = {level:"debug",color:"green"}){
	if(!LOGGER) return

	if (!D) {
		LOGGER.text = str
		if (options.color) {
			LOGGER.color = options.color
		}
	} else {
		str += '\n'
		if (options.level) {
			let level = options.level
			LOGGER[level](str)
		} else {
			LOGGER.debug(str)
		}
	}
}

/**
 * @description logger stop
 * @param {string} str
 * @param {string} options.ora
 * @param {string} options.level
 */
function loggerStop(str, options = {level:"debug"}){
	if (!D) {
		if (options.ora && str) {
			let ora = options.ora
			LOGGER[ora](str)
		} else {
			LOGGER.stop()
		}
	} else {
		if (str) {

		}
	}

	LOGGER = null

}

const getLogger = () =>{
	return LOGGER
}



module.exports = {
	logger,
	loggerStart,
	loggerText,
	loggerStop,
	getLogger
}
