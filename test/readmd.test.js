const { test } = require('ava')

const Listmd = require('../src/readmd.js')

const opts = {deep:'all'}

test("read zh md folder", async t =>{
    const len = await Listmd(__dirname+"/../md/",opts).then(x => x)

    t.is(len.length, 10)
})

test("read md no / folder", async t =>{
    const len = await Listmd(__dirname+"/../md",opts).then(x => x)
    t.is(len.length, 10)
})

test("read no absolute dir", async t =>{
    const E = await Listmd("/../md",opts).then(x => x).catch(x =>x)
    t.true(E instanceof Error)
})

test.serial.before("read md file", async t =>{
    const len = await Listmd(__dirname+"/feature/testWrite.md", opts).then(x => x)


    t.is(len.length, 1)


})

// test.serial.before("read md no /", async t =>{

//     const len2 = await Listmd(__dirname+"/../md").then(x => x)
//     t.is(len2.length, 5)
// })

test("read md no Dir ",async t =>{

    const error = await Listmd("/../md/",opts).catch(x => x)

    t.true(error instanceof Error)
})
