const { test } = require('ava')
const fs = require('fs')
const [tree, truetree ] = require('./setObjectKey.Object.js')
const setObjectKey = require('../src/setObjectKey.js')

test(' test ',async t =>{
    let newTree = await setObjectKey(tree)
    t.deepEqual(newTree, truetree)
})

