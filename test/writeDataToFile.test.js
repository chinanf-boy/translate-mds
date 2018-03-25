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

test.cb("write data to zh", t =>{

    fs.readFile(__dirname + '/testWrite3.md', 'utf8', (err, data) =>{
        if (err) throw err;
        writeDataToFile(data, __dirname + '/testWrite3.md')

        fs.readFile(__dirname + '/testWrite3.zh.md', 'utf8', (err, insidedata) =>{
            if (err) throw err;
            t.true(insidedata.length > 0)
        });
    });
    t.end()
})

test("filename no .md", t =>{
            let result = writeDataToFile('data', __dirname + '')
            t.false(result)
    })

test.failing("filename Array ", t =>{
        let result = writeDataToFile(['data','data'], __dirname + '')
        t.fail("no md file")
})
