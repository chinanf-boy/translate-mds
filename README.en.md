# translate .md to \*.md[![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/explain-translateMds) [![install size](https://packagephobia.now.sh/badge?p=translate-mds)](https://packagephobia.now.sh/result?p=translate-mds)

like

```bash
.md to .「all-language」.md
```

[english](./README.en.md)

---

[![Build Status](https://travis-ci.org/chinanf-boy/translate-mds.svg?branch=master)](https://travis-ci.org/chinanf-boy/translate-mds)
[![codecov](https://codecov.io/gh/chinanf-boy/translate-mds/branch/master/graph/badge.svg)](https://codecov.io/gh/chinanf-boy/translate-mds)
[![GitHub license](https://img.shields.io/github/license/chinanf-boy/translate-mds.svg)](https://github.com/chinanf-boy/translate-mds/blob/master/License)
[![NPM](https://nodei.co/npm/translate-mds.png)](https://nodei.co/npm/translate-mds/)

## life

[help me live , live need money 💰](https://github.com/chinanf-boy/live-need-money)

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [This project is for all-of-markdown-writing-files translation`工具`](#this-project-is-for-all-of-markdown-writing-files-translation%E5%B7%A5%E5%85%B7)
- [Demo](#demo)
- [Command line options](#command-line-options)
- [Project reference](#project-reference)
  - [translate(options,debug)](#translateoptionsdebug)
  - [Options when using `[]`](#options-when-using-)
  - [Options when using `{}`](#options-when-using-)
- [My-translate-list](#my-translate-list)
- [common problem](#common-problem)
  - [1. Sometimes the wind will get stuck and stagnate.](#1--sometimes-the-wind-will-get-stuck-and-stagnate)
  - [2. There are a number of totals that have not been translated successfully](#2--there-are-a-number-of-totals-that-have-not-been-translated-successfully)
- [Tips](#tips)
  - [Welcome 👏 ISSUE and PULL](#welcome--issue-and-pull)
- [characteristic](#characteristic)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## This project is for all-of-markdown-writing-files translation`工具`

```js
npm install -g translate-mds
```

```js
// all folder·
translateMds md/

//or single file

translateMds test.md
```

## Demo

![demo](./imgs/demo.gif)

## Command line options

```bash
  translate [folder/single] md file language to you want

  Usage
    $ translateMds [folder/file name] [options]

  Example
    $ translateMds md/

    [options]
    -a   API      : default < baidu > {google|baidu|youdao}
    -f   from     : default < auto detect >
    -t   to       : default < zh >
    -N   num      : default < 1 > {async number}
    -R   rewrite  : default < false > {yes/no rewrite translate file}

  🌟[high user options]❤️

    -D   debug
    -G   google.com               : default < false > { cn => com with Google api }
    -F   force                    : default < false > { If, translate result is no 100%, force wirte md file }
    -M   match                    : default [ ". ", "! "//...] {match this str, merge translate result }
    -S   skips                    : default ["... ", "etc. ", "i.e. "] {match this str will, skip merge translate result}
    -T   types                    : default ["html", "code"] {pass the md AST type}
    --timewait                    : default: 80 {each fetch api wait time}
    --values [path]               : default: false {write the original of wait for translate file} [single file])
    --translate [path]            : default: false {use this file translate} [single file]
    --text-glob [pattern]         : default: false {text must be match, then be transalte}
    --glob [pattern]              : default: false {file path must be match, then be transalte}
    --ignore [relative file/folder] : default: false {ignore files/folders string, split with `,` }
```

## My-translate-list

[Project test translation list](https://github.com/chinanf-boy/translate-mds-test-list)or[More Chinese 🇨🇳 translation list](https://github.com/chinanf-boy/chinese-translate-list)

## common problem

### 1. Sometimes the wind will get stuck and stagnate.

```js
If slow , may be you should try again or use -D
```

The problem comes from the API, you just have to run it again.

### 2. There are a number of totals that have not been translated successfully

> Quantity is no translation success / total is the total number of single file translations

This problem occurs, usually from the shift of characters caused by unusual symbols or sentences that are too long.

At this time, you can use`-D`Debug /`-F`Force write to file / Adjust unusual characters

[Specific can be seen](https://github.com/chinanf-boy/translate-mds/issues/22)

## Tips

1. Diff file type, may try [pandoc converter](https://github.com/jgm/pandoc)
2. May use cli without `-f **`，cause `translation.js` auto detect language

- `--timewait [number]` can lengthen the time of each request translation, reduce the banned ip
- `--values [file-path]` (single file usage) to get the original output file to be translated
- `--translate [file-path]` (single file usage) replaces the request api and uses the translated content of this file instead

### Welcome 👏 ISSUE and PULL

## characteristic

- [x] Improve the accuracy of md format such as http

- [x] Automatic translation

- [x] Enable md AST

---

Use[`remark`](https://github.com/wooorm/remark)Improve accuracy

Use[`translation.js`](https://github.com/Selection-Translator/translation.js)Complete interaction with the translation website

There is another[Asynchronous Promise recursive example](https://github.com/chinanf-boy/translate-mds/blob/master/src/setObjectKey.js#L78)
