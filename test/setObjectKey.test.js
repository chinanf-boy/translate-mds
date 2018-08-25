const { test } = require('ava')
const fs = require('fs')
const [tree, truetree ] = require('./setObjectKey.Object.js')
const {setObjectKey, translateValue} = require('../src/setObjectKey.js')
var newObject = (oldObject) =>JSON.parse(JSON.stringify(oldObject));

test(' test baidu',async t =>{
	let newTree = await setObjectKey(newObject(tree), 'baidu')
	delete newTree.Error
    t.deepEqual(newTree, truetree)
})

test(' test youdao',async t =>{
	let newTree = await setObjectKey(newObject(tree), 'youdao')
	delete newTree.Error
    t.deepEqual(newTree, truetree)
})

test(' test google',async t =>{
	let newTree = await setObjectKey(newObject(tree), 'google')
	delete newTree.Error

    t.deepEqual(newTree, truetree)
})


test(' test translate no key == value ',async t =>{
    let noValue = await setObjectKey(newObject({type:'asdf'}), 'baidu')
    t.false(noValue)
})

test(' test translate code or html false',async t =>{
    let noValue = await setObjectKey(newObject({
        "type": "html",
        "value": "<a href=\"http://www.ebooks.com/1993212/you-don-t-know-js-up-going/simpson-kyle/\">"
      }), 'baidu')
    t.false(noValue)
})

test.serial(' test translateValue ',async t =>{
    let value = ['hello world']
    let result = await translateValue(value, 'google')
    t.is(result.length,1)
})
