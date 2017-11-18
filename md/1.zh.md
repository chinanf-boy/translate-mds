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
# #麻烦: 重音字符类
>我的一个类别被命名为"乐卡尔ℽ,但链接最终是这样生成的: 
>
">
>类别/音乐
">
>
>而不工作ㄢ我能忽略这个问题吗?
# #溶液
你是一个MacOS的用户吗?如果是这样的话,你可能是一个受害者,HFS +文件系统的坚持来存储"éℽ(U + 00e9)字符正常形式分解(NFD)模式,即为"Eℽ+"́ℽ(U + 0065 + 0301)ㄢ
`约翰·勒·卡雷% C3为A9 `实际上是正确的,` % C3为A9 `为U + UTF-8版本00e9预期由Web服务器ㄢ问题是,OS X变成[ U + 00e9 ]到[ U + 0065 u + 0301 ],从而`约翰·勒·卡雷% C3为A9 `不再工作ㄢ相反,只有`勒卡雷连铸% 81 `结束` e CC % 81 `匹配[ U + 0065 u + 0301 ]最后ㄢ
这是OS X独有的ㄢ世界上其他地方没有这样做,当然也不是你最可能运行Linux的Web服务器ㄢ这也不是雨果特有的问题ㄢ其他人在他们的HTML文件中有重音字符时就被这个咬了ㄢ
注意,这个问题并不具体于拉丁语脚本ㄢ日本的Mac用户经常遇到同样的问题;例如,与`だ`分解成`た`和`和# x3099;`ㄢ(读[日文perl用户文章] ]ㄢ
rsync 3ㄢx的救援!从[服务器故障上的答复] [ ]: 
>你可以使用rsync的`ℴℴiconv `选择UTF-8 NFC与NFD之间转换,至少如果你的Macㄢ有一个特殊的` utf-8-mac `字符集是UTF-8 NFDㄢ因此,为了将文件从Mac复制到Web服务器,您需要运行类似于: 
>
> ` rsync -ℴℴiconv = utf-8-mac,UTF-8 localdir / mywebserver: remotedir / `
>
>这会将所有本地文件名由UTF-8 NFD为NFC在远程服务器ㄢ文件的内容不会受到影响ㄢ[服务器故障]
请确保你有rsync 3的最新版本ㄢ装Xㄢrsync,OS X的船只已经过时ㄢ即使是包装版本10.10(优诗美地国家公园)是版本2.6.9协议版本29ㄢ的` iconv `旗是新的ℴℴrsync 3ㄢXㄢ
# # #论坛参考
* http://discourse.gohugo.io/t/categories-with-accented-characters/505
* http://wiki.apache.org/subversion/nonnormalizingunicodecompositionawareness
* https: / /恩ㄢ维基百科ㄢorg /维基/ unicode_equivalence #例子
* http://zaiste.net/2012/07/brand_new_rsync_for_osx/
* https://gogo244.wordpress.com/2014/09/17/drived-me-crazy-convert-utf-8-mac-to-utf-8/
[在服务器故障]答案: http://serverfault.com/questions/397420/converting-utf-8-nfd-filenames-to-utf-8-nfc-in-either-rsync-or-afpdℽ转换UTF-8文件名为NFC在NFD rsync或AFPD,服务器故障ℽ的讨论
[文章]: 日本的Perl用户http://perl-users.jp/articles/advent-calendar/2010/english/24ℽ编码: : utf8mac让你快乐同时处理MacOSXℽ文件名
[服务器故障]: http://serverfault.com/questions/397420/converting-utf-8-nfd-filenames-to-utf-8-nfc-in-either-rsync-or-afpdℽ转换UTF-8文件名为NFC在NFD rsync或AFPD,服务器故障ℽ的讨论