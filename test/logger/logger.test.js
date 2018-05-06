import test from 'ava';
const {	logger,
	loggerStart,
	loggerText,
	loggerStop,
	getLogger } = require('../../config/loggerConfig')

const H = "hello world"

test.serial(' logger start', t => {
	loggerStart(H)
	let L = getLogger()
	t.true(L !== undefined)
});

test.serial('logger text', t => {
	loggerText(H)
	t.is(getLogger().text, H)
});

test.serial(' logger stop', t => {
	loggerStop()
	t.true(!getLogger())
});
