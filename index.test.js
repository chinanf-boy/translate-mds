const { test } = require('ava')
const path = require('path')
const execa = require('execa')
process.chdir(path.resolve(__dirname));

test('show help screen', async t => {
    t.regex(await execa.shell('node index.js').then(x=>x.stdout), /translate/)
});

test('show version', async t => {
	t.is(await execa.shell('node index.js --version').then(x=>x.stdout), require('./package').version);
});
