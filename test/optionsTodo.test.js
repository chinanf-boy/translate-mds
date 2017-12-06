const { test } = require('ava')
const fs = require('fs')

const {setDefault} = require('../src/optionsTodo.js')

test("test setDefault",t=>{
    function sum(a,b){return a+b}
    const s = setDefault(1, sum, 1)
    t.is(s,2)
})