const { test } = require('ava')
const fs = require('fs')

const { fixFileTooBig, indexMergeArr, thirdArray } = require('../../src/Fix/fixFileTooBig.js')

test("fixFileTooBig 1 <= length <= 30 & 1<= string<=300", t =>{
    let a = []
    let n = 30;
    let n1 = n
    
    while(n--){
        a.push(`${n}+hello`)
    }
    t.is(a.length, n1)
    let b = fixFileTooBig(a)
    t.is(b.length, 1)
})

test("fixFileTooBig length > 30 & 1<= string<=300 ", t =>{
    let a = []
    let n = 31
    let n1 = n
    while(n--){
        a.push(`${n}+hello`)
    }
    t.is(a.length, n1)
    let b = fixFileTooBig(a)
    t.is(b.length, 2)
})

test("fixFileTooBig length > 30 & string > 300 ", t =>{
    let a = []
    let n = 60;
    let n1 = n
    
    let str = `helloworlsaldfjlsajdfaslkdfsdjlfj`
    str = str+ str + str + str
    while(n--){
        a.push(`${n}+${str}`)
    }
    t.is(a.length, n1)
    let b = fixFileTooBig(a)
    t.is(b.length, 2)
    t.true(thirdArray(b).length > 0)
})

test("thirdArray Arr ", t =>{
    let a = [ [ [], [] ] ]
    let b = thirdArray(a)
    t.is(b.length, 2)
    t.deepEqual(b[0],["0","0"])
})

test("indexMergeArr Arr ", t =>{
    let a = [1,2,3,4]
    let b = indexMergeArr(a, 1, 1)
    t.is(b.length, 1)
    t.is(b[0], 2)
})

test.failing("indexMergeArr Arr fail", t =>{
    let a = [1,2,3,4]
    let b = indexMergeArr(a, -1, 7)
    t.fail('out Arr.length');
})

test("indexMergeArr Arr >[0] + [1]", t =>{
    let a = [1,2,2.5,3,4,]
    let b = []
    b[0] = indexMergeArr(a, 0, 3)
    b[1] = indexMergeArr(a, 3, (5-3))
    t.deepEqual(b, [[1,2,2.5],[3,4]])
})