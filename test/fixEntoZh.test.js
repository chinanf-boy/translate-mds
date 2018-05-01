const { test } = require('ava')
const fs = require('fs')

const { fixEntoZh, charZh2En, reg, Store, halfStr ,reg2 } = require('../src/fixEntoZh.js')

test("fix EntoZh 二分法 分离 字符串", t =>{
    let result = fixEntoZh("你好阿baby'‘～｀！＠“＃＄＾")

    t.is(result,"你好阿baby''~`!@\"#$^")
})

test("fix EntoZh 二分法 分离 字符串 Array", t =>{
    let result = fixEntoZh(["你好阿baby'‘～｀","！＠“＃＄＾"])
    t.deepEqual(result,["你好阿baby''~`","!@\"#$^"])
})

test("二分法 分离 字符串", t =>{
    let result = halfStr("你好阿baby'‘～｀！＠“＃＄＾")

    t.is(result,"你好阿baby''~`!@\"#$^")
})

test("中文符号", t =>{

        t.true(reg2("＠＃＄＾％＆＊（"))

    })

test("是不是有中文符号", t =>{

    t.true(reg.test("～｀！＠＃＄＾％＆＊（）＿＋｜－＝｛｝［］ℴ：“‘；＜＞？，．／＼＇"))

})

test("特别 中文 单双引号", t =>{

    let re = Object.keys(Store)

    t.is(Store[re[0]],'"')
    t.is(Store[re[1]],'\'')

})

test(" 中文符号 变 英文符号 ",t =>{
    let result = charZh2En("～｀！＠＃＄＾％＆＊（）＿＋｜－＝｛｝［］：“‘；＜＞？，．／＼＇")
    t.is(result, "~`!@#$^%&* () _+|-={}[]: \"';<>?,./\\'")

    let re = charZh2En("＃")
    t.is(re, "#")

})

test("me.md E 2 Z 不管 中文字 ", t =>{
    let result = charZh2En(`---
    标题：雨果文档
    linktitle：雨果
    描述：雨果是世界上最快的静态网站引擎。它是用去（aka Golang）研制的BEP，spf13和朋友。
    日期：2017-02-01
    publishdate：2017-02-01
    lastmod：2017-02-01`)

    t.false(reg.test(result))

})
