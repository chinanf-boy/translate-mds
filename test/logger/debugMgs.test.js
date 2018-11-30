import test from 'ava';
const debugMsg = require('../../src/util/debugMsg');
const debug = require('debug')('mds:tran');
const {
  logger,
  loggerStart,
  loggerText,
  oneOra,
  _SETDEBUG
} = require('../../src/config/loggerConfig.js');

const source1 = ['Hello', 'World'];
const result1 = ['你好', '世界', '. '];
const matstr = '2. set-';

test('debug msg step 1', t => {
  loggerStart('debug 1 running ...');

  debugMsg(1, source1, result1);
  t.pass('debug 1');
});

test('debug msg step 2', t => {
  loggerStart('debug 2 running ...');

  debugMsg(2, source1, result1);
  t.pass('debug 2');
});

test('debug msg step 1:debug', t => {
  process.env.DEBUG = '*';

  _SETDEBUG(true);

  loggerStart('debug 1 running ...');

  debugMsg(1, source1, result1);
  t.pass('debug 1');
});

test('debug msg step 2:debug', t => {
  process.env.DEBUG = '*';

  _SETDEBUG(true);
  loggerStart('debug 2 running ...');

  debugMsg(2, source1, result1);
  t.pass('debug 2');
});
