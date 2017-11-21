const { test } = require('ava')
const fs = require('fs')
const [tree, truetree ] = require('./setObjectKey.Object.js')
const {setObjectKey, translateValue, deep, setdeep} = require('../src/setObjectKey.js')

var newObject = (oldObject) =>JSON.parse(JSON.stringify(oldObject));

test(' test baidu',async t =>{
    let newTree = await setObjectKey(newObject(tree), 'baidu')
    t.deepEqual(newTree, truetree)
})

test(' test youdao',async t =>{
    let newTree = await setObjectKey(newObject(tree), 'youdao')
    t.deepEqual(newTree, truetree)
})

test(' test google',async t =>{
    let newTree = await setObjectKey(newObject(tree), 'google')
    t.deepEqual(newTree, truetree)
})


test(' test translateValue ',async t =>{
    let value = ['hello world','hello world']
    let result = await translateValue(value, 'baidu').then(x => x)
    t.deepEqual(result, [`你好世界`,`你好世界`])
})

test.before(" test deep func get values from obj", t =>{
    let obj = {'id':1,children:{
        id:2,
        value: 'hello world'
    },position:[{value:"hello"}]};

    let sum = deep(obj)

    t.is(sum,2)
})

test.before(" test setdeep func set values from resultArray", t =>{
    let obj = {'id':1,children:{
        id:2,
        value: 'hello world'
    },position:[{value:"hello"}]};

    let sum = setdeep(obj, ['你好世界', '你好'])
    let newobj = {'id':1,children:{
        id:2,
        value: '你好世界'
    },position:[{value:"你好"}]};
    t.is(sum, 0)
    t.deepEqual(obj,newobj)
})