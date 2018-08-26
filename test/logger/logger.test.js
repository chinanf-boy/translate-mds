import test from 'ava';
const {	logger,
	loggerStart,
	loggerText,
	loggerStop,
	getLogger,
	_SETDEBUG } = require('../../config/loggerConfig')

const H = "hello world"

test.todo("logger")

test.serial('start', t => {
	loggerStart(H)
	let L = getLogger()
	t.true(L !== undefined)
});

test.serial('text', t => {
	loggerText(H)
	t.is(getLogger().text, H)
});

test.serial(' stop', t => {
	loggerStop()
	t.true(!getLogger())
});

test.serial(' stop with succeed', t => {
    loggerStart(H)
	loggerStop('ok',{ora:'succeed'})
	t.true(!getLogger())
});

test.serial('stop with no start ', t => {

	t.true(!loggerStop("ok done"))
});

test.todo("logger DEBUG")

test('start DEBUG', t => {
	_SETDEBUG(true)
	loggerStart(H)
	let L = getLogger()
	t.true(L !== undefined)
});

test('text DEBUG', t => {
	loggerText(H)
	t.is(!!getLogger().debug, true)
});

test(' stop DEBUG', t => {
	loggerStop(H)
	t.true(!getLogger())
});

test('stop with no start DEBUG', t => {

	t.true(!loggerStop("ok done"))
});
