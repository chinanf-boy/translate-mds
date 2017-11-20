const { test } = require('ava')
const fs = require('fs')
const [tree, truetree ] = require('./setObjectKey.Object.js')
const setObjectKey = require('../src/setObjectKey.js')

test(' test ',async t =>{
    let newTree = await setObjectKey(Array.from(tree), 'baidu')
    t.deepEqual(newTree, Array.from(truetree))
})


test(' test youdao',async t =>{
    let newTree = await setObjectKey(Array.from(tree), 'youdao')
    t.deepEqual(newTree, Array.from(truetree))
})
