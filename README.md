# translate en.md to zh.md

[![Build Status](https://travis-ci.org/chinanf-boy/translate-js.svg?branch=master)](https://travis-ci.org/chinanf-boy/translate-js)
[![codecov](https://codecov.io/gh/chinanf-boy/translate-js/branch/master/graph/badge.svg)](https://codecov.io/gh/chinanf-boy/translate-js)
[![GitHub license](https://img.shields.io/github/license/chinanf-boy/translate-js.svg)](https://github.com/chinanf-boy/translate-js/blob/master/License)
[![NPM](https://nodei.co/npm/translate-mds.png)](https://nodei.co/npm/translate-mds/)

递归 获取 目录下 所有文件 写入 数组


## 这个项目是 hugo 官方文档 

```
npm install -g translate-mds
```

```
// all folder
translateMds md/

//or single file

translateMds test.md
```

---

## 项目引用

```
const translate = require('translate-mds')
//
let results = await translate(__dirname+'/testWrite1.md')
//or
let results = await translate(__dirname+'/md/')

// results is Array


```

# 下面的Demo 你 应该 

下载这个项目

```
git clone https://github.com/chinanf-boy/translate-js.git
```

## Demo

[![asciicast](https://asciinema.org/a/aPDJ0Vdt3awZs8NJV8DtYH0ww.png)](https://asciinema.org/a/aPDJ0Vdt3awZs8NJV8DtYH0ww)

# Video sometime very quick

- So the cmd Step is 

```
node index.js md/
```

> Done !!


# [ X ] 提高http之类的md格式准确率
# [ X ] 自动换 翻译源

# [ x ] 启用 md AST
使用 [``remark``](https://github.com/wooorm/remark) 提高精准度
使用 [``translate.js``](https://github.com/Selection-Translator/translation.js) 完成 与翻译网站的交互

还有个 [异步Promise 递归的 例子](https://github.com/chinanf-boy/translate-js/blob/master/src/setObjectKey.js#L78)
