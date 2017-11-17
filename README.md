# translate en.md to zh.md

递归 获取 目录下 所有文件 写入 数组

## 这个项目是 hugo 官方文档 

```
npm install -g translateMds
```

```
translateMds md/
```

机翻部分，我会把 content 目录下的 所有 文章-通过翻译网站翻译

先把大概搞出来。 

导出 中文 ``zh`` 后缀

i add content floder -- md files path --> Array[]

demo

```
md
    about
        aboutme
            me.md
        3.md
    start
        index.md
    1.md
    2.md
```

node src/readmd.js

output
```
__dirname__/../md/1.md

__dirname__/../md/2.md

__dirname__/../md/about/3.md

__dirname__/../md/about/aboutme/me.md

__dirname__/../md/start/index.md
```

使用 [``translate.js``](https://github.com/Selection-Translator/translation.js) 完成 与翻译网站的交互
