import test from 'ava';
process.chdir(__dirname + '/../../');

const path = require('path');
const execa = require('execa');

test('use --values [path]', async t => {
  let err = await t.throws(
    execa.shell(
      'node cli.js ./test/translate-file/source.md --values ./test/translate-file/translate-values.md -R'
    )
  );
  t.regex(err.message, /values save/);
});

test('use --translate [path]', async t => {
  let err = await execa.shell(
    'node cli.js ./test/translate-file/source.md --translate ./test/translate-file/translate.md -R'
  );
  t.regex(err.stderr, /be The translation/);
});
