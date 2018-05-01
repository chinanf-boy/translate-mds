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

test("indexMergeArr Arr ", t =>{
    let a = [1,2,3,4]
    let b = indexMergeArr(a, 1, 1)
    t.is(b.length, 1)
    t.is(b[0], 2)
})

test.failing("indexMergeArr B fail", t =>{
    let a = [1,2,3,4]
    t.throws(indexMergeArr(a, -1, 7))
})

test("indexMergeArr Arr >[0] + [1]", t =>{
    let a = [1,2,2.5,3,4,]
    let b = []
    b[0] = indexMergeArr(a, 0, 3)
    b[1] = indexMergeArr(a, 3, (5-3))
    t.deepEqual(b, [[1,2,2.5],[3,4]])
})
