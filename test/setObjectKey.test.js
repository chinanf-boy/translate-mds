const { test } = require('ava')
const fs = require('fs')
const [tree, truetree ] = require('./setObjectKey.Object.js')
const setObjectKey = require('../src/setObjectKey.js')

var newObject = (oldObject) =>JSON.parse(JSON.stringify(oldObject));

test(' test ',async t =>{
    let newTree = await setObjectKey(newObject(tree), 'baidu')
    t.deepEqual(newTree, truetree)
})


test(' test youdao',async t =>{
    let newTree = await setObjectKey(newObject(tree), 'youdao')
    t.deepEqual(newTree, truetree)
})
