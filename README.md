# translate .md to *.md 

like

``` bash
.md to .zh.md
```

[english](./README.en.md)
[翻译列表](https://github.com/chinanf-boy/translate-list)

---

[![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/explain-translateMds)
[![Build Status](https://travis-ci.org/chinanf-boy/translate-js.svg?branch=master)](https://travis-ci.org/chinanf-boy/translate-js)
[![codecov](https://codecov.io/gh/chinanf-boy/translate-js/branch/master/graph/badge.svg)](https://codecov.io/gh/chinanf-boy/translate-js)
[![GitHub license](https://img.shields.io/github/license/chinanf-boy/translate-js.svg)](https://github.com/chinanf-boy/translate-js/blob/master/License)
[![NPM](https://nodei.co/npm/translate-mds.png)](https://nodei.co/npm/translate-mds/)

---

## 这个项目是 为了 hugo 翻译 的 `工具`

``` js
npm install -g translate-mds
```

``` js
// all folder
translateMds md/

//or single file

translateMds test.md
```

## 命令行选项

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

## 项目引用

``` js
const translate = require('translate-mds')
//
let results = await translate([__dirname+'/testWrite1.md'])
//or
let results = await translate([__dirname+'/md/'])
// results is Array


```

> ...

## translate(options,debug)

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
# 下面的Demo 你 应该 

---

下载这个项目

```
git clone https://github.com/chinanf-boy/translate-js.git
```

## Demo

[![asciicast](https://asciinema.org/a/aPDJ0Vdt3awZs8NJV8DtYH0ww.png)](https://asciinema.org/a/aPDJ0Vdt3awZs8NJV8DtYH0ww)

# Video sometime very quick

- So the cmd Step is 

``` js
node index.js md/
```

> Done !! Or

[查看我 you dont know js 翻译](https://github.com/chinanf-boy/You-Dont-Know-JS)

---

所有的 ``.zh.md`` 都是通过 下面命令

```
tanslateMds <folder>
```

~~> ⏰ tips 有时会抽风，正在查找 会卡住 Issue~~

>你只要再运行.·

---

## 问题

~~- 并发问题，停滞ip~~ ， 通过升级 api 获取完成

- 文件过大，无法翻译

---

### 特性

- [x] 提高http之类的md格式准确率

- [x] 自动换 翻译源

- [x] 启用 md AST

---

使用 [``remark``](https://github.com/wooorm/remark) 提高精准度

使用 [``translate.js``](https://github.com/Selection-Translator/translation.js) 完成 与翻译网站的交互

还有个 [异步Promise 递归的 例子](https://github.com/chinanf-boy/translate-js/blob/master/src/setObjectKey.js#L78)
