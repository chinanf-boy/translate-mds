const { test } = require('ava')

const translate = require('../bin/translateExports.js')

let trueResult = `---\ntitle: Hugo Documentation\nlinktitle: Hugo\ndescription: Hugo is the world\'s fastest static website engine. It\'s written in Go (aka Golang) and developed by bep, spf13 and friends.\ndate: 2017-02-01\npublishdate: 2017-02-01\nlastmod: 2017-02-01\nmenu:\n  main:\n    parent: "section name"\n    weight: 01\nweight: 01\t#rem\ndraft: false\nslug:\naliases: []\ntoc: false\nlayout: documentation-home\n---\n雨果是一**世界上最快的静态网站引擎。**它是用Go(aka Golang)写成的[cep](https://github.com/bep)，[spf13](https://github.com/spf13)和[朋友](https://github.com/gohugoio/hugo/graphs/contributors)的。\n`

test.failing('translate no absolute file fail', async t =>{
    let results = await translate(['./testWrite1.md'])
    t.fail()
})
test.failing('translate input Object fail', async t =>{
    let results = await translate({})
    t.fail()
})

test('translate absolute file ', async t =>{
    let results = await translate([__dirname+'/testWrite1.md'])
    results = results.join('\n')
    t.is(JSON.stringify(results), JSON.stringify(trueResult))
})

test('translate absolute folder ', async t =>{
    let results = await translate([__dirname+'/../md/','youdao'])
    // console.log('-----------',results)
    t.is(results.length,5)
})

test('translate absolute folder ', async t =>{
    let results = await translate([__dirname+'/../md/','google'])
    // console.log('-----------',results)
    t.is(results.length,5)
})