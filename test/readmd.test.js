const { test } = require('ava')

const Listmd = require('../src/util/readmd.js')

test("read zh md folder", async t =>{
    const len = await Listmd(__dirname+"/../md/",{ deep: 'all' })
    t.is(len.length, 10)
})

test("read md file", async t =>{
    const len = await Listmd(__dirname+"/feature/testWrite.md")
    t.is(len.length, 1)
})
