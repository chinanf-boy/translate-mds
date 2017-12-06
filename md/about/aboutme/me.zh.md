---
title: Accented Characters in URLs
linktitle: Accented Characters in URLs
description: If you're having trouble with special characters in your taxonomies or titles adding odd characters to your URLs.
date: 2017-02-01
publishdate: 2017-02-01
lastmod: 2017-02-01
keywords: [urls,multilingual,special characters]
categories: [troubleshooting]
menu:
  docs:
    parent: "troubleshooting"
weight:
draft: false
slug:
aliases: [/troubleshooting/categories-with-accented-characters/]
toc: true
---
## 问题：带有重音字符的类别

> 我的一个类别被命名为“乐卡尔”，但链接最终是这样生成的：
>
>     categories/le-carr%C3%A9
>
> 不工作。我能忽略这个问题吗？

## 解决方案

你是一个MacOS的用户吗？如果是这样的话，你可能是一个受害者，HFS +文件系统的坚持来存储“é”（U + 00e9）字符正常形式分解（NFD）模式，即为“E”+“́”（U + 0065 + 0301）。

`勒% %`实际上是正确的，`% %`在U+ UTF-8版本00e9预期由Web服务器。问题是OS X转了。[u + 00e9]进入之内[0065＋0301+]，从而`勒% %`不再工作。相反，只有`勒卡雷连铸% 81`结束`81 %`将匹配[0065＋0301+]最后.

这是OS X独有的。世界上其他地方没有这样做，当然也不是你最可能运行Linux的Web服务器。这也不是雨果特有的问题。其他人在他们的HTML文件中有重音字符时就被这个咬了。

注意，这个问题并不具体于拉丁语脚本。日本的Mac用户经常遇到相同的问题，例如`だ`分解成`た`和`与# x3099；`。（读[日本perl用户文章][]）。

rsync 3。x的救援！从[服务器故障的答案][]：

> 你可以使用rsync的`——iconv`选择UTF-8 NFC与NFD之间转换，至少如果你的Mac。有一个特别的`utf-8-mac`字符集是UTF-8 NFD。因此，为了将文件从Mac复制到Web服务器，您需要运行类似于：
>
> `rsync -——iconv = utf-8-mac，UTF-8 localdir / mywebserver：remotedir /`
>
> 这会将所有本地文件名由UTF-8 NFD为NFC在远程服务器。文件的内容不会受到影响。—[服务器故障][]

请确保你有rsync 3的最新版本。装X。rsync，OS X的船只已经过时。即使是包装版本10.10（优诗美地国家公园）是版本2.6.9协议版本29。这个`——iconv`国旗是新的rsync 3。X。

### 论坛参考

-   <http://discourse.gohugo.io/t/categories-with-accented-characters/505>
-   [http://wiki.apache.org/subversion/nonnormalizingunicodecompositionawareness](http://wiki.apache.org/subversion/NonNormalizingUnicodeCompositionAwareness)
-   [http：/ /恩。维基百科。org /维基/ unicode_equivalence #例子](https://en.wikipedia.org/wiki/Unicode_equivalence#Example)
-   <http://zaiste.net/2012/07/brand_new_rsync_for_osx/>
-   <https://gogo244.wordpress.com/2014/09/17/drived-me-crazy-convert-utf-8-mac-to-utf-8/>

[an answer posted on server fault]: http://serverfault.com/questions/397420/converting-utf-8-nfd-filenames-to-utf-8-nfc-in-either-rsync-or-afpd "Converting UTF-8 NFD filenames to UTF-8 NFC in either rsync or afpd, Server Fault Discussion"

[japanese perl users article]: http://perl-users.jp/articles/advent-calendar/2010/english/24 "Encode::UTF8Mac makes you happy while handling file names on MacOSX"

[server fault]: http://serverfault.com/questions/397420/converting-utf-8-nfd-filenames-to-utf-8-nfc-in-either-rsync-or-afpd "Converting UTF-8 NFD filenames to UTF-8 NFC in either rsync or afpd, Server Fault Discussion"
