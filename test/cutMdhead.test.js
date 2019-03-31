const { test } = require('ava')
const fs = require('fs')

const cut = require('../src/util/cutMdhead.js')

test("cut --- head", t =>{
    let [body, head] = cut(beforedata)
    t.is(body, afterdata)
    t.is(head, onlyhead)
})

test("cut +++ head", t =>{
  let [body, head] = cut(beforedata2)
  t.is(body, afterdata2)
  t.is(head, onlyhead2)
})

test(" no cut ", t =>{
  let [body, head] = cut("# 你好")
  t.is(body,"# 你好")
  t.is(head, "")
})

let onlyhead = `---
title: Hugo Documentation
linktitle: Hugo
description: Hugo is the world's fastest static website engine. It's written in Go (aka Golang) and developed by bep, spf13 and friends.
date: 2017-02-01
publishdate: 2017-02-01
lastmod: 2017-02-01
menu:
  main:
    parent: "section name"
    weight: 01
weight: 01      #rem
draft: false
slug:
aliases: []
toc: false
layout: documentation-home
---\n\n`

let afterdata = `

Hugo is the **world's fastest static website engine.** It's written in Go (aka Golang) and developed by [bep](https://github.com/bep), [spf13](https://github.com/spf13) and [friends](https://github.com/gohugoio/hugo/graphs/contributors). Below you will find some of the most common and helpful pages from our documentation.
➜ /Users/lizhenyong/Desk`

let beforedata = `---
title: Hugo Documentation
linktitle: Hugo
description: Hugo is the world's fastest static website engine. It's written in Go (aka Golang) and developed by bep, spf13 and friends.
date: 2017-02-01
publishdate: 2017-02-01
lastmod: 2017-02-01
menu:
  main:
    parent: "section name"
    weight: 01
weight: 01      #rem
draft: false
slug:
aliases: []
toc: false
layout: documentation-home
---

Hugo is the **world's fastest static website engine.** It's written in Go (aka Golang) and developed by [bep](https://github.com/bep), [spf13](https://github.com/spf13) and [friends](https://github.com/gohugoio/hugo/graphs/contributors). Below you will find some of the most common and helpful pages from our documentation.
➜ /Users/lizhenyong/Desk`

let onlyhead2 = `+++
title: Hugo Documentation
linktitle: Hugo
description: Hugo is the world's fastest static website engine. It's written in Go (aka Golang) and developed by bep, spf13 and friends.
date: 2017-02-01
publishdate: 2017-02-01
lastmod: 2017-02-01
menu:
  main:
    parent: "section name"
    weight: 01
weight: 01      #rem
draft: false
slug:
aliases: []
toc: false
layout: documentation-home
+++\n\n`

let afterdata2 = `

Hugo is the **world's fastest static website engine.** It's written in Go (aka Golang) and developed by [bep](https://github.com/bep), [spf13](https://github.com/spf13) and [friends](https://github.com/gohugoio/hugo/graphs/contributors). Below you will find some of the most common and helpful pages from our documentation.
➜ /Users/lizhenyong/Desk`

let beforedata2 = `+++
title: Hugo Documentation
linktitle: Hugo
description: Hugo is the world's fastest static website engine. It's written in Go (aka Golang) and developed by bep, spf13 and friends.
date: 2017-02-01
publishdate: 2017-02-01
lastmod: 2017-02-01
menu:
  main:
    parent: "section name"
    weight: 01
weight: 01      #rem
draft: false
slug:
aliases: []
toc: false
layout: documentation-home
+++

Hugo is the **world's fastest static website engine.** It's written in Go (aka Golang) and developed by [bep](https://github.com/bep), [spf13](https://github.com/spf13) and [friends](https://github.com/gohugoio/hugo/graphs/contributors). Below you will find some of the most common and helpful pages from our documentation.
➜ /Users/lizhenyong/Desk`
