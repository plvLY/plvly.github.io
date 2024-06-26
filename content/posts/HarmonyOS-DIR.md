---
title: HarmonyOS应用开发01 - 目录结构
description: HarmonyOS应用开发
date: 2024-06-22
duration: 10min
lang: 鸿蒙
---

## 目录结构
- .hvigor: 存储构建配置文件
- AppScope: 全局共有资源目录
- entry: 工程模块代码目录，源代码
- hvigor: 前端构建配置文件，基于TS构建
- oh_modules: 第三方包
- build-profile.json5: 项目构建配置信息，产品签名，名称等
- hvigorfile.ts: 编译构建脚本
- hvigorw: linux-ohpm编译构建脚本
- hvigorw.bat: windows-ohpm编译构建脚本
- local.properties: 本地属性配置文件
- oh-package.json5: 项目、依赖配置
- oh-package-lock.json5: 依赖树

> 主要目录

- AppScope：全局共有资源目录
  - base
    - element
      - string.json -- 字符串常量
    - media -- 媒体常量
      - app_icon.png
  - app.json5 -- 项目配置信息
- entry
  - src: 源代码目录
    - main
      - ets -- ArkTS 源代码 -- ArkTS为TS的超集
        - entryability -- 逻辑&生命周期
        - pages -- 界面组件
      - resource -- 资源目录
        - base -- 基础
        - en_US -- 国际化英文
        - rawfile -- 
        - zh_CN -- 国际化中文
      - module.json5 -- 模块的配置文件，包含当前模块的配置信息
      - ohosTest
  - build-profile.json5 -- 模块级别配置文件，编译构建配置项
  - hvigorfile.ts -- 模块级别文件构建脚本
  - oh-package.json5 -- 模块级别依赖配置信息

> module.json5 -- 模块的配置文件，包含当前模块的配置信息

  |        属性         |                             描述                             |
  | :-----------------: | :----------------------------------------------------------: |
  |        name         | 该标签标识当前module的名字，module打包成hap后，表示hap的名字，标签值采用字符串表示(最大31个字符)，该名称再整个应用要唯一 |
  |        type         |    表示模块的类型，类型有三种，分别是entry、feature和har     |
  |      srcEntry       |                    当前模块的入口文件路径                    |
  |     description     |                      当前模块的描述信息                      |
  |     mainElement     | 该标签标识hap的入口ability名称或者extension名称，只有配置为mainElement的ability或者extension才允许在服务中心露出 |
  |     deviceTypes     | 该标签标识hap可以运行再哪类设备上，标签值采用字符串数组标识  |
  | deliveryWithInstall | 标识当前Module是否在用户主动安装的时候安装，表示该Module对应的HAP是否跟随应用一起安装。- true：主动安装时安装。- false:主动安装时不安装 |
  |  installationFree   | 标识当前Module是否支持免安装特性，且符合免安装约束。- false：表示不支持免安装特性 |
  |        pages        | 对应的是main_page.json配置文件，用于配置ability中用到的page信息 |
  |      abilities      | 是一个数组，存放当前模块中所有的ability元能力的配置信息，其中可以有多个ability |

>  对应abilities中每个ability的属性项

  |         属性          |                             描述                             |
  | :-------------------: | :----------------------------------------------------------: |
  |         name          | 该标签标识当前ability的逻辑名，该名称在整个应用要唯一，标签值采用字符串表示(最大值127个字节) |
  |       srcEntry        |                    ability的入口代码路径                     |
  |      description      |                      ability的描述信息                       |
  |         icon          | ability的图标，该标签标识ability图标，标签值为资源文件的索引。该标签可以缺省。缺省值为空。如果ability被配置为MainElement，该标签必须配置 |
  |         label         |                       ability的标签名                        |
  |    startWindowIcon    |                        启动页面的图标                        |
  | startWindowBackground |                       启动页面的背景色                       |
  |        visible        | ability是否可以被其他应用程序调用，true表示可以被其他应用调用，false表示不可以 |
  |        skills         | 标识能够接收的意图的action值得集合，取值通常为系统预定义得action值，也允许自定义 |
  |       entities        |               标识能够接收Want得Entity值得集合               |
  |        actions        | 标识能够接收得Want得Action得集合，取值通常为系统预定义的action值，也允许自定义 |

