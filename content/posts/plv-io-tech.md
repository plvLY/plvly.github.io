---
title: plv.io 技术文档
description: 基于 Nuxt 3 的个人博客与技术笔记站点——技术栈、架构设计与开发指南
date: 2026-07-10
lang: Nuxt
collection: project-doc
author: plv
---

## 目录

- [1. 项目概述](#1-项目概述)
- [2. 技术栈](#2-技术栈)
- [3. 项目结构](#3-项目结构)
- [4. 架构设计](#4-架构设计)
- [5. 内容管理系统](#5-内容管理系统)
- [6. 核心功能](#6-核心功能)
- [7. API 接口](#7-api-接口)
- [8. 核心组件概览](#8-核心组件概览)
- [9. 开发与部署](#9-开发与部署)
- [10. 配置参考](#10-配置参考)

---

## 1. 项目概述

**plv.io** 是一个基于 Nuxt 3 的个人博客与作品集站点，兼具内容管理、访客分析、留言互动与项目展示功能。站点以 Markdown 内容为核心驱动，部署于 Netlify，所有持久化数据通过 Netlify Blobs 存储。

- **技术框架**: Nuxt 3 + Vue 3 + TypeScript
- **样式引擎**: UnoCSS（原子化 CSS）
- **内容管理**: @nuxt/content（文件式 Markdown CMS）
- **后端引擎**: Nitro（Nuxt 内置服务端）
- **线上地址**: [plv.netlify.app](https://plv.netlify.app)
- **代码仓库**: [github.com/plvLY](https://github.com/plvLY) / [gitee.com/plv-coding](https://gitee.com/plv-coding)

---

## 2. 技术栈

### 2.1 前端技术栈

| 分类 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **框架** | Nuxt 3 | ~3.15.0 | Vue 3 元框架，SSR + 文件路由 |
| **UI** | Vue 3 | ^3.5.13 | Composition API + `<script setup>` |
| **样式** | UnoCSS | ^0.65.4 | 原子化 CSS，含图标/字体/属性化预设 |
| **内容** | @nuxt/content | ^2.13.4 | Markdown 文件式 CMS |
| **MDC** | @nuxtjs/mdc | ^0.9.5 | Markdown 内嵌 Vue 组件语法 |
| **图标** | unplugin-icons + @iconify-json/carbon, mdi | — | 自动安装式图标加载 |
| **字体** | UnoCSS presetWebFonts | — | Inter / DM Mono / Roboto Condensed / Bad Script |
| **工具库** | @vueuse/core + @vueuse/nuxt | ^11.3.0 | useDark / useStorage 等组合式函数 |
| **日期** | dayjs | ^1.11.13 | 日期格式化 |
| **动画** | vue-starport | ^0.4.0 | 跨路由共享元素过渡 |
| **图片** | @nuxt/image | ^1.9.0 | Nuxt 图片优化 |

### 2.2 服务端与存储

| 分类 | 技术 | 用途 |
|------|------|------|
| **服务引擎** | Nitro（Nuxt 内置） | API 路由、服务端逻辑 |
| **生产存储** | @netlify/blobs ^8.1.0 | 访客记录 + 留言数据持久化 |
| **开发存储** | SQLite (.data/db.sqlite3) | 本地开发 Blobs 回退 |
| **IP 地理** | ip-api.com | 访客 IP 地理定位 |
| **部署平台** | Netlify | 构建 + 托管，Node 20 + pnpm |

---

## 3. 项目结构

```
plv.io/
├── app.vue                      # 根组件：StarportCarrier + 全局 SEO + 分析初始化
├── app.config.ts                # 运行时配置（title: 'PLV'）
├── nuxt.config.ts               # Nuxt 主配置
├── uno.config.ts                # UnoCSS 主题、预设、快捷方式
├── netlify.toml                 # Netlify 构建配置
├── types.ts                     # 共享 TS 类型定义（Message, VisitRecord, DetailedStats 等）
│
├── assets/css/                  # 全局样式
│   ├── main.css                 # 主题变量（light/dark）、滚动条、滑入动画、view-transition
│   ├── prose.css                # 基础文章排版
│   └── markdown.css             # Markdown 渲染样式（代码块、表格、引用等）
│
├── layouts/
│   └── default.vue              # 默认布局：Backdrop + NavBar + <slot>
│
├── pages/                       # 文件路由页面
│   ├── index.vue                # 首页（Logo + 访客计数 + 内容）
│   ├── posts.vue                # 文章列表（合集卡片 / 时间线双视图）
│   ├── [...slug].vue            # 文章详情（动态内容 + TOC + 上下篇）
│   ├── projects.vue             # 项目展示页
│   ├── info.vue                 # 关于页
│   ├── message.vue              # 留言板
│   ├── collections/[slug].vue   # 合集详情
│   └── admin/analytics.vue      # 访客统计后台（Token 保护）
│
├── components/                  # Vue 组件
│   ├── Backdrop.vue             # 发光背景动效
│   ├── NavBar.vue               # 导航栏 + 移动端菜单
│   ├── Logo.vue                 # Logo 图片
│   ├── PIcon.vue                # 动态碳图标注册
│   ├── ToggleTheme.vue          # 明暗主题切换（View Transition 动画）
│   ├── VisitCounter.vue         # 访客计数显示
│   └── content/                 # MDC 可嵌入的 Markdown 组件
│       ├── Alert.vue            # 提示框（notice/warning/tip）
│       ├── Card.vue             # 卡片容器
│       └── ProseImg.vue         # 延迟加载图片
│
├── composables/                 # 组合式函数
│   ├── reading-time.ts          # 中英文阅读时间估算（AST + 文本）
│   ├── useAnalytics.ts          # 客户端访客追踪（sendBeacon）
│   ├── useVisitCount.ts         # 拉取公开访客总数
│   └── utils.ts                 # dayjs 日期格式化 + debounce
│
├── content/                     # Markdown 内容源
│   ├── index.md                 # 首页内容
│   ├── info.md                  # 关于页内容
│   ├── collections.md           # 合集定义（YAML frontmatter）
│   ├── projects.md              # 项目数据（YAML frontmatter）
│   └── posts/                   # 博客文章（.md）
│
├── server/                      # Nitro 服务端
│   ├── api/
│   │   ├── analytics/           # 分析统计 API
│   │   │   ├── public.ts        # GET 公开总访客数
│   │   │   ├── record.post.ts   # POST 记录一次访问
│   │   │   ├── stats.ts         # GET 详细统计（Token 保护）
│   │   │   └── visits.ts        # GET 分页访客列表（Token 保护）
│   │   ├── db/                  # 留言板 API
│   │   │   ├── insert.ts        # POST 提交留言
│   │   │   └── query.ts         # GET 查询留言
│   │   └── ip-utils.ts          # GET IP 地理信息查询
│   ├── plugins/
│   │   └── nitroPlugin.ts       # Netlify Blobs 上下文初始化
│   └── utils/
│       └── analytics.ts         # 分析核心逻辑（Blobs 读写、Bot 检测、Geo 缓存）
│
├── transformers/
│   └── reading-time.ts          # Nuxt Content 转换器：自动注入阅读时长
│
├── public/                      # 静态资源
├── .env                         # 环境变量配置
└── .data/db.sqlite3             # 本地开发数据库（Blobs 回退）
```

---

## 4. 架构设计

### 4.1 渲染模式

采用 **混合渲染**：静态生成 + 服务端渲染。Nuxt 自动根据页面性质选择策略：

- 博客文章页（`[...slug].vue`）支持 SSR，确保 SEO
- 首页、文章列表等静态内容使用静态生成
- API 路由由 Nitro 服务端处理

### 4.2 数据流

```
┌──────────────────────────────────────────────────────┐
│                    浏览器 (Client)                      │
│  ┌─────────────┐  ┌──────────┐  ┌────────────────┐    │
│  │  Nuxt Pages  │  │  Content  │  │  Navigate API   │    │
│  │  (SSR/SSG)   │  │   Doc    │  │  (sendBeacon)    │    │
│  └──────┬───────┘  └────┬─────┘  └───────┬─────────┘    │
└─────────┼───────────────┼────────────────┼──────────────┘
          │               │                │
          ▼               ▼                ▼
┌─────────────────────────────────────────┐
│           Nitro Server (CDN Edge)        │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │         API 路由层                │    │
│  │  访客分析 · 留言板 · IP 定位      │    │
│  └──────────┬───────────────────┬───┘    │
│             │                   │         │
│             ▼                   ▼         │
│  ┌─────────────────┐  ┌──────────────┐   │
│  │  Netlify Blobs   │  │  Geo IP 定位  │   │
│  │  数据持久化       │  │  + 缓存       │   │
│  └─────────────────┘  └──────────────┘   │
└──────────────────────────────────────────┘

                    内容渲染链路：

  content/*.md ──▶ @nuxt/content 解析 ──▶ Reading-time 转换器
       │                                          │
       │         ┌────────────────────────────────┘
       ▼         ▼
  pages/[...slug].vue ──▶ ContentDoc / ContentRenderer
       │
       ▼
  HTML (SSR) ──▶ 浏览器渲染
```

### 4.3 关键设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| **状态管理** | Vue ref/computed | 无复杂跨组件状态，无需 Pinia |
| **样式方案** | UnoCSS + CSS 变量 | 原子化高效开发 + 运行时主题切换 |
| **持久化** | Netlify Blobs | 零运维，边缘可用，适合低频读写场景 |
| **分析追踪** | sendBeacon + 会话去重 | 无阻塞上报，sessionStorage 避免重复 |
| **内容管理** | 文件式 Markdown | 版本化友好，写作体验佳，静态编译支持好 |

---

## 5. 内容管理系统

基于 **@nuxt/content v2**，所有内容以 Markdown 文件形式存储在 `content/` 目录。

### 5.1 合集 (Collections)

在 `content/collections.md` 中通过 YAML frontmatter 定义：

| 合集 | 标识 | 颜色 |
|------|------|------|
| AI 工具实践 | ai-tools | hsl(270, 50%, 55%) |
| 项目文档 | project-doc | hsl(128, 57%, 58%) |
| 鸿蒙应用开发 | harmonyos | hsl(217, 65%, 55%) |
| 其他 | other | hsl(0, 0%, 50%) |

每篇文章通过 frontmatter 的 `collection` 字段关联合集。

### 5.2 MDC 组件

通过 `@nuxtjs/mdc` 支持在 Markdown 中嵌入 Vue 组件：

```markdown
::alert{type="notice"}
这是一条提示。
::
```

已注册的 MDC 组件：`Alert`（notice/warning/tip）、`Card`、`ProseImg`。

### 5.3 阅读时间注入

自定义转换器 `transformers/reading-time.ts` 自动处理 `content:posts:` 前缀的内容：

1. 解析 Markdown AST，提取纯文本
2. 中文字符按 300 字/分钟、英文按 200 词/分钟计算
3. 结果注入 `duration` 字段，格式如 `"5min"`

### 5.4 代码高亮

Nuxt Content 内置 Shiki 高亮，支持 light/dark 双主题：

- light 模式：`github-light`
- dark 模式：`github-dark`

支持语言：dockerfile, java, js, ts, typescript, json, bash, yaml, css, html, vue, md。

---

## 6. 核心功能

### 6.1 博客系统

- **文章列表**：合集卡片视图（默认）与全部文章时间线视图（?view=all）
- **文章详情**：标题、日期、阅读时长、语言标签、合集归属、TOC 侧栏、上下篇导航
- **合集详情**：按年份分组的筛选列表

### 6.2 项目展示

`/projects` 页面读取 `content/projects.md` 的 YAML frontmatter，按分类展示项目卡片，支持锚点快速跳转。

### 6.3 访客分析

- 客户端通过 `sendBeacon` 发送页面访问记录，同一会话仅上报一次
- 服务端自动过滤爬虫、查询地理信息
- 首页展示公开访客总数
- 管理后台展示总览卡片、30 日趋势、页面排行、地域分布、访客明细（需身份验证）

### 6.4 留言板

- 访客提交留言，服务端自动记录 IP 与地理信息
- 内置反垃圾防护：频率限制、Bot 检测、Honeypot 隐藏字段
- 支持留言管理（需身份验证）

### 6.5 明暗主题

- 基于 VueUse `useDark()`，自动读取系统偏好
- 切换时使用 CSS View Transition API 实现圆形裁剪动画（从点击坐标展开）
- 主题变量通过 CSS 自定义属性定义在 `:root` / `html.dark`

### 6.6 响应式设计

- 移动端导航：汉堡菜单 → 全屏覆盖
- 文章页：TOC 侧栏在 ≤1024px 时隐藏
- 合集/项目卡片：`auto-fill` 网格自适应列数

---

## 7. API 接口

Nitro 服务端提供以下功能接口，均通过 HTTP 访问：

- **访客分析** — 记录页面访问、返回公开访客总数、提供详细的统计数据（管理接口需身份验证）
- **留言板** — 提交留言、查询留言列表、删除留言（管理接口需身份验证）
- **IP 定位** — 根据客户端 IP 返回地理信息（国家·省份·城市）

---

## 8. 核心组件概览

| 组件 | 路径 | 职责 |
|------|------|------|
| **NavBar** | `components/NavBar.vue` | 顶栏导航：页面链接 + 社交链接 + 主题切换 + 移动端菜单 |
| **Backdrop** | `components/Backdrop.vue` | 页面背景径向渐变发光动效（8s pulse），尊重 prefers-reduced-motion |
| **PIcon** | `components/PIcon.vue` | 碳图标（Carbon Icons）注册表，动态按名加载 |
| **ToggleTheme** | `components/ToggleTheme.vue` | 明暗切换按钮，View Transition 圆形裁剪动画 |
| **VisitCounter** | `components/VisitCounter.vue` | 展示 "访客 X 人次"，数据来自 `/api/analytics/public` |
| **Logo** | `components/Logo.vue` | 站点 Logo 图片 |
| **Alert** | `components/content/Alert.vue` | MDC 提示框组件（notice/warning/tip） |
| **Card** | `components/content/Card.vue` | MDC 卡片容器 |
| **ProseImg** | `components/content/ProseImg.vue` | MDC 延迟加载图片 |

---

## 9. 开发与部署

### 9.1 环境要求

- **Node.js**: 20+
- **包管理器**: pnpm ^10.18.3

### 9.2 命令参考

| 命令 | 说明 |
|------|------|
| `pnpm install` | 安装依赖（自动执行 `nuxt prepare`） |
| `pnpm dev` | 启动开发服务器（默认 `localhost:3000`，HMR） |
| `pnpm build` | 生产构建（输出 `.output/` + `dist/`） |
| `pnpm generate` | 预渲染静态页面 |
| `pnpm preview` | 预览生产构建 |

### 9.3 本地开发

```bash
# 1. 克隆仓库
git clone https://gitee.com/plv-coding/plv.io.git
cd plv.io

# 2. 安装依赖
pnpm install

# 3. 按需配置环境变量

# 4. 启动开发
pnpm dev
```

### 9.4 Netlify 部署

- 自动检测 `netlify.toml` 配置构建
- 需在 Netlify 后台配置相关环境变量
- 需要启用 Netlify Blobs 插件用于数据存储

---

## 10. 配置参考

### 10.1 环境变量

项目依赖若干环境变量用于管理后台的身份验证和功能开关，在 Netlify 部署面板或本地 `.env` 文件中配置。

### 10.2 nuxt.config.ts 要点

| 配置项 | 值/说明 |
|--------|---------|
| **模块** | `@unocss/nuxt`, `@nuxt/image`, `@vueuse/nuxt`, `@nuxt/content`, `@nuxtjs/mdc` |
| **CSS** | `main.css`, `prose.css`, `markdown.css` |
| **Content 高亮** | light: `github-light`, dark: `github-dark` |
| **Content TOC** | depth: 3, searchDepth: 4 |
| **MDC 组件路径** | `~/components`, 无前缀 |
| **Icons** | unplugin-icons 自动安装 |
| **Nitro** | `node: true`（启用 Node 兼容） |

### 10.3 uno.config.ts 要点

| 配置 | 说明 |
|------|------|
| **预设** | presetUno + presetIcons + presetAttributify + presetWebFonts |
| **字体** | Inter (sans), DM Mono (mono), Roboto Condensed, Bad Script |
| **图标** | 默认 1.2em, inline-block, text-bottom 对齐 |
| **快捷方式** | `bg-base` / `bg-surface` / `border-base` / `container-main` / `container-wide` |
| **品牌色** | `brand-primary`: hsl(217, 65%, 55%) |
| **安全列表** | 预声明 `i-ri-menu-2-fill`, `i-mdi-*` 系列图标 |

---

## 附录：依赖清单

**运行时依赖**:

```
@nuxt/content    @nuxt/image
@vueuse/core     @vueuse/nuxt
dayjs            nuxt
vue              vue-router
vue-starport     @netlify/blobs
```

**开发依赖**:

```
@iconify-json/carbon  @iconify-json/mdi
@nuxtjs/mdc           @unhead/vue
@unocss/nuxt          unplugin-icons
```
