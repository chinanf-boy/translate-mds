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

    fs.readFile(__dirname + '/testWrite.md', 'utf8', (err, data) =>{
        if (err) throw err;
        writeDataToFile(data, __dirname + '/testWrite.md')

        fs.readFile(__dirname + '/testWrite.zh.md', 'utf8', (err, insidedata) =>{
            if (err) throw err;
            console.log('inside')
            t.is(insidedata, data)
            t.end()
        });
    });
})

test.failing("filename no .md", t =>{
            writeDataToFile(data, __dirname + '/testWrite.md')
            t.fail('')
    })

