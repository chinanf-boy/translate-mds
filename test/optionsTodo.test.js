const { test } = require('ava')
const fs = require('fs')
let p = '../src/optionsTodo.js'
const defaultArgs = {
    "logger": {
      "level": "verbose"
    },
    "api":"baidu",
    "from":"en",
    "to":"zh",
    "num": 5,
    "rewrite": false
  }
const {setDefault} = require(p)

const rNobj =(obj) =>JSON.parse(JSON.stringify(obj))

test("setDefault",t=>{
    function sum(a,b){return a+b}
    const s = setDefault(1, sum, 1)
    t.is(s,2)
})

const {debugTodo} = require(p)

test("debugTodo",t=>{
    const s = debugTodo(true,rNobj(defaultArgs))
    t.is(s, 'debug')
    const s2 = debugTodo('info',rNobj(defaultArgs))
    t.is(s2,'info')
})

const {matchAndSkip} = require(p)

test("matchAndSkip",t=>{
    const s = matchAndSkip({n:"info,nihao",type:'M'},rNobj(defaultArgs))
	t.is(s.length, 2)
	const s2 = matchAndSkip({n:"info",type:'M'},rNobj(defaultArgs))
	t.is(s2.length, 1)
	console.log(s2)
	const s3 = matchAndSkip("",rNobj(defaultArgs))
	t.is(s3.length, 0)
})

const {fromTodo} = require(p)

test("fromTodo",t=>{
    const s = fromTodo('zh',rNobj(defaultArgs))
    t.is(s,'zh')
    const s2 = fromTodo('',rNobj(defaultArgs))
    t.is(s2,'en')
})
const {toTodo} = require(p)

test("toTodo",t=>{
    const s = toTodo('ja',rNobj(defaultArgs))
    t.is(s,'ja')
    const s2 = toTodo('',rNobj(defaultArgs))
    t.is(s2,'zh')
})
const {apiTodo} = require(p)

test("apiTodo",t=>{
    const s = apiTodo('',rNobj(defaultArgs))
    t.is(s,'baidu')
    const s2 = apiTodo('google',rNobj(defaultArgs))
    t.is(s2,'google')
})
const {rewriteTodo} = require(p)

test("rewriteTodo",t=>{
    const one = rewriteTodo(true,rNobj(defaultArgs))
    t.is(one,true)

    const two = rewriteTodo('google',rNobj(defaultArgs))
    t.is(two,true)

    const three = rewriteTodo('',rNobj(defaultArgs))
    t.is(three,false)
})
const {numTodo} = require(p)

test("numTodo",t=>{
    const s = numTodo(10,rNobj(defaultArgs))
    t.is(s,10)

    const s2 = numTodo('google',rNobj(defaultArgs))
    t.is(s2,5)
})
