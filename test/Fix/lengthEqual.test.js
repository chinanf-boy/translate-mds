const { test } = require('ava')
const fs = require('fs')

const { translateLengthEquals, mergeAndCut } = require('../../src/Fix/lengthEqual.js')

test("mergeAndCut String", t =>{
    let a =["a","b","c","d","e","f","g"]
    mergeAndCut(a, 2, 2)
    t.deepEqual(a, ["a", "b", "cde", "f", "g"])
})

test("mergeAndCut String", t =>{
    let a =["asdf. ", "asdf. "]
    mergeAndCut(a, 0, 2)
    t.deepEqual(a, ["asdf. asdf. "])
})

test("translateLengthEquals with '. '", t =>{
    let b =["asdf. asdf. . "]
    let c =["asdf. ", "asdf. ", ". "]
    translateLengthEquals(b, c)
    console.log(c)
    t.deepEqual(c, ["asdf. asdf. . "])
})

test("translateLengthEquals with '. ' and '！' ", t =>{
    let b =["asdf！. asdf. ！"]
    let c =["asdf！", ". ", "asdf. ", "！"]
    translateLengthEquals(b, c)
    console.log(c)
    t.deepEqual(c, ["asdf！. asdf. ！"])
})