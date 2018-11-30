const { test } = require('ava')
const fs = require('fs')

const { translateLengthEquals, mergeAndCut } = require('../../src/Fix/lengthEqual.js')

test("mergeAndCut String asdf", t =>{
    let a =["a","b","c","d","e","f","g"]
	mergeAndCut(a, 2, 2, 5)
    t.deepEqual(a, ["a", "b", "cde", "f", "g"])
})

test("mergeAndCut String single", t =>{
    let a =["asdf. ", "asdf. "]
    mergeAndCut(a, 0, 2, 1)
    t.deepEqual(a, ["asdf. asdf. "])
})

test("translateLengthEquals String long", t =>{
    let a =[`excited. This an awesome (rigorous and respectful) and curated (I read every suggestion and make judgement calls) list of cold showers on overhyped topics. This does `]
    let b = ["1","2","4"]
	translateLengthEquals(a, b)
    t.is(b.length, 1)
})

test("translateLengthEquals String with \' or \"  ", t =>{
    let a =[`"excited. This an awesome (rigorous and respectful) and curated (I read every suggestion and make judgement calls) list of cold showers on overhyped topics. This does "`]
    let b = ["1","2","3","4"]
    translateLengthEquals(a, b)
    t.is(b.length, 4)
})

test("translateLengthEquals String with \' or \" has space", t =>{
    let a =[` "excited. This an awesome (rigorous and respectful) and curated (I read every suggestion and make judgement calls) list of cold showers on overhyped topics. This does "`]
    let b = ["1","2","3","4"]
    translateLengthEquals(a, b)
    t.is(b.length, 4)
})

test("translateLengthEquals with '. '", t =>{
    let b =["asdf. asdf. . "]
    let c =["asdf. ", "asdf. ", ". "]
    translateLengthEquals(b, c)
    t.deepEqual(c, ["asdf. asdf. . "])
})

test("translateLengthEquals with '. ' and '！' ", t =>{
    let b =["a,etc. sdf！. asdf. ！"]
    let c =["asdf！", ". ", "asdf. ", "！"]
    translateLengthEquals(b, c)
    t.deepEqual(c, ["asdf！. asdf. ！"])
})

test(`translateLengthEquals with '. ' and '。' `, t =>{
    let b =[`asdf。. asdf. 。`,`asdf`]
	let c =[`asdf。`, `. `, `asdf. `, `。`, `asdf`]
    translateLengthEquals(b, c)
    t.deepEqual(c, b)
})

