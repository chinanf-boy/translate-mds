const path = require('path')
const {
	setDefault,
	debugTodo,
	fromTodo,
	toTodo,
	apiTodo,
	rewriteTodo,
	numTodo,
	matchAndSkip,
	typesTodo
} = require('./optionsTodo.js')
let workOptions = require('./work-options')

function mergeConfig(cli) {
    let defaultConfig = workOptions.getOptions()

	let debug = setDefault(cli.flags['D'], debugTodo, defaultConfig)
	let tranFr = setDefault(cli.flags['f'], fromTodo, defaultConfig)
	let tranTo = setDefault(cli.flags['t'], toTodo, defaultConfig)
	let api = setDefault(cli.flags['a'], apiTodo, defaultConfig)
	let rewrite = setDefault(cli.flags['R'], rewriteTodo, defaultConfig)
    let asyncNum = setDefault(cli.flags['N'], numTodo, defaultConfig)

	setDefault({
		n: cli.flags['M'],
		type: 'M'
	}, matchAndSkip, defaultConfig)
	setDefault({
		n: cli.flags['S'],
		type: 'S'
	}, matchAndSkip, defaultConfig)
	setDefault({
		n: cli.flags['T'],
		type: 'T'
    }, typesTodo, defaultConfig)

    let Force = cli.flags['F'] ? true : false
    if(Force){
        defaultConfig.force = Force
    }

    let COM = cli.flags['G'] ? true : false
    if(COM){
        defaultConfig.com = COM
    }

    let Cache = cli.flags['C'] ? true : false
    if(Cache){
        defaultConfig.cache = Cache
    }

    let values = cli.flags['values']
    if(values){
        defaultConfig.getvalues = (typeof values === 'string') ? path.resolve(values) : path.resolve('./translate-values.md')
    }

    let translate = cli.flags['translate']
    if(typeof translate === 'string'){
        defaultConfig.translate = path.resolve(translate)
    }

	let wait = cli.flags['timewait']
	if(wait && !isNaN(+wait)){
		defaultConfig.timewait = wait
	}

    let ignores = cli.flags['ignore']
    if(typeof ignores === 'string'){
        ignores = ignores.split(',')
    }else{
        ignores = false
    }
	defaultConfig.ignore = ignores

    let glob = cli.flags['glob']
    if(typeof glob === 'string'){
        glob = glob.split(',')
    }else{
        glob = false
    }
    defaultConfig.glob = glob

    let textGlob = cli.flags['textGlob']
    if(typeof textGlob === 'string'){
        textGlob = textGlob.split(',')
    }else{
        textGlob = false
    }
    defaultConfig.textGlob = textGlob

    // disk
    defaultConfig.disk = cli.flags['disk'] == undefined
    // zh symbal
    defaultConfig.zh = cli.flags['zh'] == undefined

    let cacheName = cli.flags['cacheName']
    if(typeof cacheName === 'string'){
        defaultConfig.cacheName = cacheName
    }

	workOptions.setOptions(defaultConfig)
    console.log(cli.flags)
	return {
		debug,
		tranFr,
		tranTo,
		api,
		rewrite,
		asyncNum,
        Force,
        ignores,
        glob,
        Cache
	}
}

function main(opts) {
    let defaultConfig = workOptions.getOptions()

	let {
		debug,
		tranFrom,
		tranTo,
		api,
		options
	} = opts

	debug = setDefault(debug, debugTodo, defaultConfig)
	tranFrom = setDefault(tranFrom, fromTodo, defaultConfig)
	tranTo = setDefault(tranTo, toTodo, defaultConfig)
    api = setDefault(api, apiTodo, defaultConfig)

	setDefault({
		n: options.Matchs,
		type: 'M'
	}, matchAndSkip, defaultConfig)
	setDefault({
		n: options.Skips,
		type: 'S'
	}, matchAndSkip, defaultConfig)
	setDefault({
		n: options.Types,
		type: 'T'
	}, typesTodo, defaultConfig)
	// rewrite config.json
	workOptions.setOptions(defaultConfig)

	return {
		debug,
		tranFrom,
		tranTo,
		api
	}
}


exports = module.exports = mergeConfig
exports.main =  main
