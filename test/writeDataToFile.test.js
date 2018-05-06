const { test } = require('ava')
const fs = require('fs')

const { writeDataToFile, insert_flg } = require('../src/writeDataToFile.js')

test("get new filename ",t =>{
    let result = insert_flg('aaaa.md', '.zh', 3)
    t.is(result, 'aaaa.zh.md')
})

test.failing("get bad filename ",t =>{
    insert_flg('', '.zh', 3)
    t.fail('这里是传入不正确的文件名')
})

test.failing("filename no .md", async t =>{
        await writeDataToFile('data', __dirname + '')

})

test.serial("writeData with Array ", async t =>{
    let result = await writeDataToFile(["hello！", "world"], __dirname + '/testWrite3.md')
    t.true(result.includes('file saved'))
})

test.failing("filename Array ", async t =>{
        await writeDataToFile(['data','data'], __dirname + '')
})
