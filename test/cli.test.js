const { test } = require('ava')
const path = require('path')
const execa = require('execa')
process.chdir(path.resolve(__dirname+'/..'));

let a = `./test/feature/testWrite3.en.md`
let b = `./test/translate-file/translate-values.md`


test('show help screen', async t => {
    t.regex(await execa.shell('node cli.js').then(x=>x.stderr).catch(x =>x.stderr), /translate/)
});

test('--glob', async t => {
    t.regex(await execa.shell(`node cli.js ${b} --glob *.js -D`).then(x=>x.stderr), /glob/)
});

test('--ignore', async t => {
    t.regex(await execa.shell(`node cli.js ${b} --ignore ${b} -D`).then(x=>x.stderr), /ignore/)
});

test('已翻译', async t => {
    t.regex(await execa.shell(`node cli.js ./md -D`).then(x=>x.stderr), /已翻译/)
});

test('国家后缀', async t => {
    t.regex(await execa.shell(`node cli.js ${a} -D`).then(x=>x.stderr), /国家/)
});

test('show version', async t => {
	t.is(await execa.shell('node cli.js --version').then(x=>x.stdout), require('../package').version);
});
