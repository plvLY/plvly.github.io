---
title: 本地部署DeepSeek-1.5b智障版
description: 本地部署 deepseek-r1:1.5b`
date: 2025-03-24 17:34
duration: 5min
lang: AI
author: plv
---

> 电脑配置

- 处理器：`Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz   1.80 GHz`
- RAM：16.0 GB
- 莫得显卡~

> Ollama  [下载](https://ollama.com/)

![DS.png](/img/DeepSeek/ollama.png)

- 修改安装路径 -- 采用cmd命令安装
    - `OllamaSetup.exe /DIR=F:\DeepSeek\Ollama`
- 修改模型存放地址
    - 系统环境变量：`OLLAMA_MODELS F:\DeepSeek\Ollama\models`
- 下载/启动deepseek1.5bwansh 
    - `ollama run deepseek-r1:1.5b`

![DS.png](/img/DeepSeek/qa.png)