# translate .md to \*.md [![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/explain-translateMds) [![install size](https://packagephobia.now.sh/badge?p=translate-mds)](https://packagephobia.now.sh/result?p=translate-mds)

like

```bash
.md to .「all-language」.md
```

[english](./README.en.md)

---

[![Build Status](https://travis-ci.org/chinanf-boy/translate-mds.svg?branch=master)](https://travis-ci.org/chinanf-boy/translate-mds)
[![codecov](https://codecov.io/gh/chinanf-boy/translate-mds/branch/master/graph/badge.svg)](https://codecov.io/gh/chinanf-boy/translate-mds)
[![GitHub license](https://img.shields.io/github/license/chinanf-boy/translate-mds.svg)](https://github.com/chinanf-boy/translate-mds/blob/master/License)
![npm](https://img.shields.io/npm/v/translate-mds.svg)
![GitHub release](https://img.shields.io/github/tag/chinanf-boy/translate-mds.svg)

## 生活

[help me live , live need money 💰](https://github.com/chinanf-boy/live-need-money)

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [这个项目是 为了 所有-的-markdown-编写-文件 📃 翻译 的 `工具`](#%E8%BF%99%E4%B8%AA%E9%A1%B9%E7%9B%AE%E6%98%AF-%E4%B8%BA%E4%BA%86-%E6%89%80%E6%9C%89-%E7%9A%84-markdown-%E7%BC%96%E5%86%99-%E6%96%87%E4%BB%B6-%E7%BF%BB%E8%AF%91-%E7%9A%84-%E5%B7%A5%E5%85%B7)
- [Demo](#demo)
- [命令行选项](#%E5%91%BD%E4%BB%A4%E8%A1%8C%E9%80%89%E9%A1%B9)
- [项目引用](#%E9%A1%B9%E7%9B%AE%E5%BC%95%E7%94%A8)
  - [translate(options,debug)](#translateoptionsdebug)
  - [options 当用 `[]`](#options-%E5%BD%93%E7%94%A8-)
  - [options 当 用 `{}`](#options-%E5%BD%93-%E7%94%A8-)
- [My-translate-list](#my-translate-list)
- [常见问题](#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)
  - [1. 有时会抽风会卡住,停滞](#1-%E6%9C%89%E6%97%B6%E4%BC%9A%E6%8A%BD%E9%A3%8E%E4%BC%9A%E5%8D%A1%E4%BD%8F%E5%81%9C%E6%BB%9E)
  - [2. 没翻译成功的有 数量/总数](#2-%E6%B2%A1%E7%BF%BB%E8%AF%91%E6%88%90%E5%8A%9F%E7%9A%84%E6%9C%89-%E6%95%B0%E9%87%8F%E6%80%BB%E6%95%B0)
- [Tips](#tips)
  - [欢迎 👏 ISSUE 和 PULL](#%E6%AC%A2%E8%BF%8E-issue-%E5%92%8C-pull)
- [特性](#%E7%89%B9%E6%80%A7)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 这个项目是 为了 所有-的-markdown-编写-文件 📃 翻译 的 `工具`

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

## 命令行选项

```bash
  translate [folder/single] md file language to you want

  Usage
    $ translateMds [folder/file name] [options]

  Example
    $ translateMds md/

    [options]
    -a   API      : default < baidu > {google|baidu|youdao}
    -f   from     : default < auto 检验 >
    -t   to       : default < zh >
    -N   num      : default < 1 > {并发 数}
    -R   rewrite  : default < false > {yes/no 重新写入翻译}

  🌟[high user options]❤️

    -D   debug
    -C   cache                    : default: false  是否存储结果
    -G   google.com               : default < false > { cn => Google.com 的 api }
    -F   force                    : default < false > { 当, 翻译的结果达不到 100%, 强行写入翻译文件 }
    -M   match                    : default [ ". ", "! "//...] {match this str, merge translate result }
    -S   skips                    : default ["... ", "etc. ", "i.e. "] {match this str will, skip merge translate result}
    -T   types                    : default ["html", "code"] {过滤 AST 类型, 不翻译}
    --timewait                    : default: 80 { 每次请求的等待 80ms 时间}
    --values [path]               : default: false {取出原文中需要翻译的文本,放入path文件} [single file])
    --translate [path]            : default: false {使用此path文件替代请求网络翻译, 可搭配--values使用} [single file]
    --text-glob [pattern]         : default: false {文本匹配glob模式, 才能被翻译}
    --cache-name [filename]:      : default: "translateMds" 存储的文件名
    --glob [pattern]              : default: false {文件匹配glob模式, 才能被翻译}
    --ignore [relative file/folder] : default: false {忽略 文件/文件夹 字符串匹配, 可用`,`分隔多路径 }
```

---

## My-translate-list

[项目测试翻译列表](https://github.com/chinanf-boy/translate-mds-test-list) or
[更多中文 🇨🇳 翻译列表](https://github.com/chinanf-boy/chinese-translate-list)

## 常见问题

### 1. 有时会抽风会卡住,停滞

```js
If slow , may be you should try again or use -D
```

问题来自 API, 你只要再运行.

### 2. 没翻译成功的有 数量/总数

> 数量是 没有翻译成功/总数是 单个文件翻译总数

出现这样的问题, 一般是来自 不常见符号/或句子过长 导致的 字符移位.

这个时候, 你可以使用 `-D` 调试 / `-F` 强制写入文件 / 调整不常见的字符

[具体可看](https://github.com/chinanf-boy/translate-mds/issues/22)

## Tips

1. 不同的文件格式, 使用[pandoc 转换看看](https://github.com/jgm/pandoc)
2. 不要`-f **`指定语言，`translation.js`会自动检测

- `--timewait [number]` 可以拉长每次请求翻译的时间, 减少被禁 ip
- `--values [file-path]` (单个文件使用) 获得将要翻译的原本输出文件
- `--translate [file-path]` (单个文件使用) 取代请求 api, 改为使用此文件的翻译内容

### 欢迎 👏 ISSUE 和 PULL

## 特性

- [x] 提高 http 之类的 md 格式准确率
- [x] 自动换 翻译源
- [x] 启用 md AST

## 已分隔的代码

- [files-list](https://github.com/chinanf-boy/files-list)
- [what-time](https://github.com/chinanf-boy/what-time)
- [zh-to-en-symbol](https://github.com/chinanf-boy/zh-to-en-symbol)

---

使用 [`remark`](https://github.com/wooorm/remark) 提高精准度

使用 [`translation.js`](https://github.com/Selection-Translator/translation.js) 完成 与翻译网站的交互

还有个 [异步 Promise 递归的 例子](https://github.com/chinanf-boy/translate-mds/blob/master/src/setObjectKey.js#L78)
