---
title: llama.cpp本地部署及配置
description: 本地部署 llama.cpp 及配置指南，涵盖下载安装、模型获取与参数优化
date: 2026-07-18
lang: AI
collection: ai-tools
author: plv
---

## 一、llama.cpp

### 1、下载渠道

**llama.cpp**(b10066): [**GitHub Releases 页面**](https://github.com/ggml-org/llama.cpp/releases){:target="_blank"}  

在 Releases 页面的 Assets 列表中，找到最新版本的以下文件：根据需要下载对应的文件

| 文件名关键词                              | 适用场景          |
| ----------------------------------------- | ----------------- |
| `llama-bxxxx-bin-win-cpu-x64.zip`         | ✅ 纯CPU Windows   |
| `llama-bxxxx-bin-win-cuda-cu12.x-x64.zip` | NVIDIA显卡加速    |
| `llama-bxxxx-bin-win-vulkan-x64.zip`      | Vulkan通用GPU加速 |
| `Source code (zip/tar.gz)`                | 源码，需自行编译  |

### 2、验证

当前目录下执行cmd

```cmd
F:\llamacpp\bin\llama-cli.exe --version
```

如果输出版本号（如 `llama-cli version b10066`），说明环境就绪。如果报错"缺少DLL"，需安装`Visual C++ Redistributable`。

## 二、model

### 1、**下载渠道**

| 渠道                                | 地址                           | 说明                 |
| ----------------------------------- | ------------------------------ | -------------------- |
| **HF Mirror**                       | `https://hf-mirror.com`        | HuggingFace 官方镜像 |
| **ModelScope 魔搭社区（阿里官方）** | `https://modelscope.cn/models` | **阿里官方**         |
| **HuggingFace 官方**                | `https://huggingface.co`       | 需要科学上网         |

## 三、参数配置

> 根据自己的电脑去优化对应参数。以下脚本中的路径 `F:\llamacpp\` 需替换为实际安装目录；模型文件参考第二章下载。

### 1、日常对话.bat

```bat
@echo off
chcp 65001 >nul
title Qwen2.5-3B 日常对话 (T580优化版)
echo ========================================
echo   线程:6  批处理:256  上下文:3072
echo   KV缓存:q8_0  温度:0.6
echo ========================================

F:\llamacpp\bin\llama-cli.exe ^
  -m F:\llamacpp\models\qwen2.5-3b-instruct-q4_k_m.gguf ^
  -t 6 ^
  -b 256 ^
  -c 3072 ^
  --cache-type-k q8_0 ^
  --jinja ^
  --color auto ^
  --temp 0.6 ^
  --top-k 20 ^
  --top-p 0.95 ^
  -n 1024 ^
  --repeat-penalty 1.1

pause
```

### 2、**严谨输出.bat**

```bat
@echo off
chcp 65001 >nul
title Qwen2.5-3B 严谨输出 (T580优化版)
echo ========================================
echo   线程:6  批处理:256  上下文:3072
echo   KV缓存:q8_0  温度:0.3
echo ========================================

F:\llamacpp\bin\llama-cli.exe ^
  -m F:\llamacpp\models\qwen2.5-3b-instruct-q4_k_m.gguf ^
  -t 6 ^
  -b 256 ^
  -c 3072 ^
  --cache-type-k q8_0 ^
  --jinja ^
  --color auto ^
  --temp 0.3 ^
  --top-k 20 ^
  --top-p 0.7 ^
  -n 2048 ^
  --repeat-penalty 1.15

pause
```

### 3、**创意写作.bat**

```bat
@echo off
chcp 65001 >nul
title Qwen2.5-3B 创意写作 (T580优化版)
echo ========================================
echo   线程:6  批处理:256  上下文:2048
echo   KV缓存:q8_0  温度:0.85
echo ========================================

F:\llamacpp\bin\llama-cli.exe ^
  -m F:\llamacpp\models\qwen2.5-3b-instruct-q4_k_m.gguf ^
  -t 6 ^
  -b 256 ^
  -c 2048 ^
  --cache-type-k q8_0 ^
  --jinja ^
  --color auto ^
  --temp 0.85 ^
  --top-k 40 ^
  --top-p 0.95 ^
  -n 512 ^
  --presence-penalty 1.0

pause
```

### 4、**API服务.bat**

```bat
@echo off
chcp 65001 >nul
title Qwen2.5-3B API服务 (T580优化版)
echo ========================================
echo   浏览器访问: http://127.0.0.1:8080
echo   线程:6  批处理:256  上下文:3072
echo ========================================

F:\llamacpp\bin\llama-server.exe ^
  -m F:\llamacpp\models\qwen2.5-3b-instruct-q4_k_m.gguf ^
  -t 6 ^
  -b 256 ^
  -c 3072 ^
  --cache-type-k q8_0 ^
  --host 127.0.0.1 ^
  --port 8080

pause
```

启动后可用 curl 验证 API 是否正常工作：

```bash
curl http://127.0.0.1:8080/v1/chat/completions ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"qwen2.5-3b\",\"messages\":[{\"role\":\"user\",\"content\":\"你好\"}]}"
```

## 四、参数说明

| 参数 | 说明 | 建议 |
|------|------|------|
| `-t` | 线程数，根据 CPU 核心数设置 | 物理核心数或 `物理核心数-2` |
| `-b` | 批处理大小，影响生成速度 | 128-512，数值越大对显存/内存要求越高 |
| `-c` | 上下文窗口大小（tokens） | 2048-4096 通常够用 |
| `--cache-type-k` | KV 缓存量化类型 | `q8_0` 平衡速度与质量，`f16` 质量最高 |
| `--temp` | 温度，控制随机性 | 0.3 严谨 / 0.6 日常 / 0.85 创意 |
| `--top-k` | 采样时保留概率最高的 K 个 token | 20-40 |
| `--top-p` | 核采样阈值 | 0.7 严谨 / 0.95 日常与创意 |
| `--repeat-penalty` | 重复惩罚系数 | 1.1-1.15 |
| `--presence-penalty` | 话题新鲜度惩罚 | 0.5-1.0，鼓励模型引入新内容 |

---

以上配置基于 Qwen2.5-3B-Instruct-Q4_K_M 模型与 T580笔记本 实测，更换模型或硬件时需重新调整参数。

