const { test } = require('ava')
const fs = require('fs')
const [tree, truetree ] = require('./setObjectKey.Object.js')
const {setObjectKey, translateValue} = require('../src/setObjectKey.js')
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

test(' test translateValue ',async t =>{
    let value = ['hello world','hello world']
    let result = await translateValue(value, 'baidu').then(x => x)
    t.deepEqual(result, [`你好世界`,`你好世界`])
})

// test.before('test only code AST ', t =>{
//     let obj = {
//         "type": "root",
//         "children": [
//           {
//             "type": "code",
//             "lang": "js",
//             "value": "var a = 'asdf'",
//             "position": {
//               "start": {
//                 "line": 1,}}}
//         ]}
//     let tranArray = []
//     let sum = 0
//     sum = deep(obj, tranArray)
//     t.is(sum, 0)
// })

// test.before(" test deep func get values from obj", t =>{
//     let obj = {'id':1,children:{
//         id:2,
//         value: 'hello world'
//     },position:[{value:"hello"}]};

//     let tranArray = []
//     let sum = 0
//     sum = deep(obj,tranArray)

//     t.is(sum,2)
// })

// test.before(" test setdeep func set values from resultArray", t =>{
//     let obj = {'id':1,children:{
//         id:2,
//         value: 'hello world'
//     },position:[{value:"hello"}]};
//     let sum = 2
//     sum = setdeep(obj, ['你好世界', '你好'])
//     let newobj = {'id':1,children:{
//         id:2,
//         value: '你好世界'
//     },position:[{value:"你好"}]};
//     t.is(sum, 0)
//     t.deepEqual(obj,newobj)
// })