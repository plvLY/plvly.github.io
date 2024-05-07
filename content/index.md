# PLV
::alert{type="warning"}
站点基于 [antfu.me](https://antfu.me/){:target="_blank"}(作者：Anthony Fu)改造而成。
::

```ts
const website_info = 'Nuxt + Vue3 + TS + unocss'
console.log(website_info)
```

> 站点目录

| 目录                                                        | 内容                        |
|-----------------------------------------------------------|---------------------------|
| [`首页`](/)                                                 | 记录站点的一些基本内容               |
| [`文章`](/posts)                                            | 记录技术相关的细化的文章              |
| [`项目`](/projects)                                         | 展示一些平时开发的小工具、小项目的演示及整体的逻辑 |
| [`关于`](/info)                                             | 关于站点一些详细信息                |
| [`Gitee`](https://gitee.com/plv-coding){:target="_blank"} | 个人代码仓库-国内Gitee            |
| [`Github`](https://github.com/plvLY){:target="_blank"}    | 个人代码仓库-国外Github           |
| `主题`                                                      | 黑夜&明亮                     |

> 正在更新···
- [ ] `项目`
  - [ ] `列表 `
    - 内容建设
- [ ] `文章`
  - 持续内容建设

> 已建设内容
- [x] `主题` - light & dark
- [x] `背景` - 动态背景
- [x] `首页` - 站点内容
- [x] `文章` - 文章列表及相关内容
- [x] `关于` - 关于站点的一点信息

> 作者
```ts
const enum UserInfo {
  UserName = '吖飘PLV',
  ContactType = 'QQ',
  QQ = '837965182',
  Metier = '码农'
}
console.log('%c作者:%s,\n职业:%s,\n联系方式:%s->%s','color: skyblue; font-size: 30px;'
        ,UserInfo.UserName
        ,UserInfo.Metier
        ,UserInfo.ContactType
        ,UserInfo.QQ
)
```

