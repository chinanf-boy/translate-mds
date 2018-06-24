const { test } = require('ava')
const path = require('path')
const translate = require('../src/translateMds.js')

let trueResult = `---\ntitle: Hugo Documentation\nlinktitle: Hugo\ndescription: Hugo is the world\'s fastest static website engine. It\'s written in Go (aka Golang) and developed by bep, spf13 and friends.\ndate: 2017-02-01\npublishdate: 2017-02-01\nlastmod: 2017-02-01\nmenu:\n  main:\n    parent: \"section name\"\n    weight: 01\nweight: 01\t#rem\ndraft: false\nslug:\naliases: []\ntoc: false\nlayout: documentation-home\n---\n雨果是**世界上最快的静态网站引擎。**它是用去（aka Golang）开发的[BEP](https://github.com/bep)，[spf13](https://github.com/spf13)和[朋友](https://github.com/gohugoio/hugo/graphs/contributors)。下面您将从我们的文档中找到一些最常见和最有用的页面。\n`

test.failing('translate no absolute file fail', async t =>{
    let results = await translate(['./testWrite1.md'])
    t.fail()
})

test.failing('translate nothing', async t =>{
    let results = await translate("")
    t.fail()
})
test.failing('translate input Object fail', async t =>{
    let results = await translate({})
    t.fail()
})
test.serial('translate absolute file ', async t =>{
	let results = await translate({aFile:__dirname+'/testWrite1.md', api:'google'})
	results = results.map(x =>x.text)
    results = results.join('')
    t.true(JSON.stringify(results).length > 10)
})

test.serial('translate absolute file from zh to en', async t =>{
	let results = await translate({'aFile':__dirname+'/testWrite1.md',tF:'en',tT:'zh'})
	results = results.map(x =>x.text)
    t.is(results.length, 1)
})

test.serial('translate absolute folder auto', async t =>{
	let results = await translate([path.resolve(__dirname,'../md/'),'google'], 'info')
	results = results.map(x =>x.text)
    t.is(results.length,5)
})

// test.serial('translate absolute big folder auto', async t =>{
//     let results = await translate([`*******/You_Don\'t\ _Know_JS/You-Dont-Know-JS`,'baidu'], 'verbose')
//     t.is(results.length,5)
// })
