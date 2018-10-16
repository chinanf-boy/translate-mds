const tc = require('turbocolor');
const relative = require('path').relative
let g = tc.green
let y = tc.cyan
let yow = tc.yellow
let m = tc.magenta
let b = tc.blue
let r = tc.red


function relaPath(p){
    return relative(process.cwd(),p)
}

const newObject = (obj) => JSON.parse(JSON.stringify(obj))

function time(ms) {
	return new Promise((resolve, reject) => {
	  setTimeout(resolve, ms);
	});
}

function insert_flg(str, flg, Uindex) {
    let newstr = "";
    if (!str || !flg) {
        throw TypeError('filename<' + str + '> can not add' + flg)
    }
    let len = str.length
    let tmp = str.substring(0, len - Uindex);
    newstr = tmp + flg + str.substring(len - Uindex, len)
    return newstr;
}

function O2A(options) {
	let {
		aFile,
		api,
		tF,
		tT
	} = options
	return [aFile, api, tF, tT]
}

const fs = require('mz/fs')
const EOL = `\n`

async function asyncWrite(p, arry){
    return await fs.writeFile(p,arry.join(EOL+EOL))
}
async function asyncRead(p){
    return await fs.readFileSync(p,"utf8").split(EOL+EOL).filter(ok => ok)
}
module.exports  = {
	time,
	g,
	y,
	yow,
	m,
	b,
    r,
    relaPath,
    newObject,
    insert_flg,
    O2A,
    asyncWrite,
    asyncRead,
    tc
}
