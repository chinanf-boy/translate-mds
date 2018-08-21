const tc = require('turbocolor');
let g = tc.green
let y = tc.cyan
let yow = tc.yellow
let m = tc.magenta
let b = tc.blue
let r = tc.red




function time(ms) {
	return new Promise((resolve, reject) => {
	  setTimeout(resolve, ms);
	});
	}

module.exports  = {
	time,
	g,
	y,
	yow,
	m,
	b,
	r
}
