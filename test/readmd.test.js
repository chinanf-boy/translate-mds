const { test } = require('ava')

const Listmd = require('../src/readmd.js')

test("read md ",async t =>{
    const len = await Listmd(__dirname+"/../md/")

    t.is(len.length, 5)
})

test("read md no Dir ",async t =>{
    
    const error = await Listmd("/../md/").catch(x => x)
	
    t.true(error instanceof Error)
})

// const promise = () => Promise.reject(new TypeError('🦄'));

// test('rejects', async t => {
// 	const error = await t.throws(promise);
// 	t.is(error.message, '🦄');
// });