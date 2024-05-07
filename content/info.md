---
title: Introduction
---

# website info
::alert{type="warning"}
站点基于 [antfu.me](https://antfu.me/){:target="_blank"}(作者：Anthony Fu)改造而成。
::
> 技术栈

`主要`
- [x] Nuxt
- [x] Vue3
- [x] TS
- [x] UnoCSS

`部分插件`
- [x] @iconify-json/mdi -- 图标
- [x] vue-starport -- 一个代理组件：带有动画的跨路由共享组件
- [x] @nuxt/content -- 使用 content/ 目录（Nuxt项目目录）创建一个基于文件的内容管理系统（CMS）

> 描述

采用[Nuxt](https://nuxt.com/)构建该项目，使用[NuxtContent](https://content.nuxt.com/)基于文件路由，生成对应的页面。
- [x] 启用Nuxt Content
  在你的项目中安装@nuxt/content模块，并通过以下命令将其添加到nuxt.config.ts中
```bash 
npx nuxi module add content
```
- [x] 配置文件-nuxt.config.ts：
```ts
export default defineNuxtConfig({
  modules: [
    //...
    "@nuxt/content",
  ]
})
```
- [x] 目录-创建内容：
  将Markdown文件放在content/目录中（NuxtContent默认读取content下的markdown文件，渲染对应的页面）
- [x] 创建catch-all路由(采用ContentDoc组件)--渲染
```vue
// pages/[...slug].vue
<template>
  <main>
    <ContentDoc :path="$route.path"></ContentDoc>
  </main>
</template>
```
