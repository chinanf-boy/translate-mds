# translate .md to \* .md

like

```bash
.md to .zh.md
```

[english](./README.en.md)
[translate-list](https://github.com/chinanf-boy/translate-list)

* * *

[![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/explain-translateMds)
[![Build Status](https://travis-ci.org/chinanf-boy/translate-js.svg?branch=master)](https://travis-ci.org/chinanf-boy/translate-js)
[![codecov](https://codecov.io/gh/chinanf-boy/translate-js/branch/master/graph/badge.svg)](https://codecov.io/gh/chinanf-boy/translate-js)
[![GitHub license](https://img.shields.io/github/license/chinanf-boy/translate-js.svg)](https://github.com/chinanf-boy/translate-js/blob/master/License)
[![NPM](https://nodei.co/npm/translate-mds.png)](https://nodei.co/npm/translate-mds/)

* * *

## This project is for hugo translation`tool`

```js
npm install -g translate-mds
```

```js
// all folder
translateMds md/

//or single file

translateMds test.md
```

## Command line options

```js
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

* * *

## Project reference

```js
const translate = require('translate-mds')
//
let results = await translate([__dirname+'/testWrite1.md'])
//or
let results = await translate([__dirname+'/md/'])
// results is Array
```

> ...

## translate (options, debug)

## options When using \[]

[afile, api, tf, tt]= options

## options when using {}

> optioins = {afile:`string`, api:`string`, tf:`string`tt:`string`}

* * *

-   afile

> absolute file

* * *

-   api

> `default: baidu`
>
> {'google', 'baidu', 'youdao'}

* * *

-   tf

> `default: en`

* * *

-   tt

> `default: zh`

* * *

-   debug

> `default: verbose`
>
> # The demo below should be

* * *

Download this project

    git clone https://github.com/chinanf-boy/translate-js.git

## demo

[![asciicast](https://asciinema.org/a/aPDJ0Vdt3awZs8NJV8DtYH0ww.png)](https://asciinema.org/a/aPDJ0Vdt3awZs8NJV8DtYH0ww)

# video sometime very quick

-   so the cmd step is

```js
node index.js md/
```

> done !! or

[Check me you dont know js translation](https://github.com/chinanf-boy/You-Dont-Know-JS)

* * *

all`Zh.md`Through the following orders

    tanslateMds <folder>

> ⏰ tips Sometimes smoke, looking for? Will jam stuck in the issue
>
> You just need to run again.

* * *

Sorry, my lack of capacity, node concurrency problem is that I do not know where the problem.

Question: Suddenly there is no network traffic speed, do not know if this is not forbidden IP ????

When the number is `` 1``, it is a coincidence that You-dont-know-js 68 md files can succeed several times, but when the number of concurrent occurrences exceeds 1, especially

Near the end of the few documents, the wait has been turn, then the network speed becomes 0, then you need ctrl c, terminated!

* * *

-   [x] Improve http md format accuracy

-   [x] Automatic translation source

-   [x] Enable md ast

* * *

Use[`remark`](https://github.com/wooorm/remark)Improve accuracy

Use[`translate.js`](https://github.com/Selection-Translator/translation.js)Complete the interaction with the translation website

There is one[Examples of asynchronous promise recursion](https://github.com/chinanf-boy/translate-js/blob/master/src/setObjectKey.js#L78)