# translate .md to *.md 

like

``` bash
.md to .「all-language」.md
```

[english](./README.en.md) 

> check [翻译列表](https://github.com/chinanf-boy/translate-list)

---

[![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/explain-translateMds)
[![Build Status](https://travis-ci.org/chinanf-boy/translate-mds.svg?branch=master)](https://travis-ci.org/chinanf-boy/translate-mds)
[![codecov](https://codecov.io/gh/chinanf-boy/translate-mds/branch/master/graph/badge.svg)](https://codecov.io/gh/chinanf-boy/translate-mds)
[![GitHub license](https://img.shields.io/github/license/chinanf-boy/translate-mds.svg)](https://github.com/chinanf-boy/translate-mds/blob/master/License)
[![NPM](https://nodei.co/npm/translate-mds.png)](https://nodei.co/npm/translate-mds/)

---

## 0. 这个项目是 为了 所有-的-markdown-编写-文件📃 翻译 的 `工具`

``` js
npm install -g translate-mds
```

``` js
// all folder
translateMds md/

//or single file

translateMds test.md
```

## 1. 命令行选项

``` js
Usage
  $ translateMds [folder name] [options]

Example
  $ translateMds md/ 
  
  [options]
  -a   API      : default < baidu > {google,baidu,youdao}

  -f   from     : default < en >

  -t   to       : default < zh >

  -N   num      : default < 5 > {async number}

  -D   debug    : default < false >
  
  -R   rewrite  : default < false > {yes/no retranslate and rewrite translate file}

```
---

## 2. 项目引用

``` js
const translate = require('translate-mds')
//
let results = await translate([__dirname+'/testWrite1.md'])
//or
let results = await translate([__dirname+'/md/'])
// results is Array


```

> ...

---

## 3. translate(options,debug)

## options 当用 []

[ aFile,api,tF,tT ] = options
## options 当 用 {}

> optioins = {aFile: `String` ,api: `String` ,tF: `String` tT: `String` }

---

- aFile 

> absolute file

---

- api

>``default : baidu``

>{'google','baidu','youdao'}

---

- tF

>``default : en``

---

- tT

>``default : zh``

---

- debug

> ``default : verbose``

---

## 4. Demo

[![asciicast](https://asciinema.org/a/aPDJ0Vdt3awZs8NJV8DtYH0ww.png)](https://asciinema.org/a/aPDJ0Vdt3awZs8NJV8DtYH0ww)

## 5. My-example

[翻译列表](https://github.com/chinanf-boy/translate-list) or
[查看我 you dont know js 翻译](https://github.com/chinanf-boy/You-Dont-Know-Js)

---


## 5.5 欢迎👏 ISSUE 和 PULL

---

### 6. Tips

~~> ⏰ tips 有时会抽风，正在查找 会卡住 Issue~~

>你只要再运行.·

---

## 7. 问题

~~- 并发问题，停滞ip~~ ， 通过升级 api 获取完成

~~- 文件过大，无法翻译~~

---

### 8. 特性

- [x] 提高http之类的md格式准确率

- [x] 自动换 翻译源

- [x] 启用 md AST

---

使用 [``remark``](https://github.com/wooorm/remark) 提高精准度

使用 [``translate.js``](https://github.com/Selection-Translator/translation.js) 完成 与翻译网站的交互

还有个 [异步Promise 递归的 例子](https://github.com/chinanf-boy/translate-mds/blob/master/src/setObjectKey.js#L78)
