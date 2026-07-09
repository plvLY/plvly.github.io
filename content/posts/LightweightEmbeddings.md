---
title: 使用Docker部署Embedding模型
description: 使用Docker部署Embedding模型,提供langchain4j调用
date: 2026-07-09
duration: 5min
lang: AI
author: plv
---

## 一、部署 lightweight-embeddings

> 基于 Sentence-Transformers 的 Embedding 服务，提供 RESTful API，支持文本和图像向量化。

### 1、克隆项目

```bash
git clone https://github.com/lh0x00/lightweight-embeddings.git
```

### 2、**使用Docker构建并运行**

```bash
docker build -t lightweight-embeddings .
docker run -p 7860:7860 lightweight-embeddings
```

### 3、验证服务

启动后访问 `http://localhost:7860` 即可调用 API。

## 二、异常点

### 1、下载依赖超时

编辑项目目录下的 `Dockerfile`，替换 PyPI 镜像源：

```dockerfile
ARG TORCH_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple
```

**其他国内镜像源**（任选其一）：

- 阿里云：`https://mirrors.aliyun.com/pypi/simple/`
- 中科大：`https://pypi.mirrors.ustc.edu.cn/simple/`
- 豆瓣：`https://pypi.douban.com/simple/`

## 三、模型向量表

| Name                                    | Kind  | Dim                                | Max tokens | Cost |
| --------------------------------------- | ----- | ---------------------------------- | ---------- | ---- |
| `multilingual-e5-small` *(default)*     | text  | 384                                | 512        | 1   |
| `multilingual-e5-base`                  | text  | 768                                | 512        | 2   |
| `multilingual-e5-large`                 | text  | 1024                               | 512        | 4   |
| `paraphrase-multilingual-MiniLM-L12-v2` | text  | 384                                | 128        | 0.8 |
| `paraphrase-multilingual-mpnet-base-v2` | text  | 768                                | 128        | 2   |
| `gte-multilingual-base`                 | text  | 768                                | 8192       | 2.5 |
| `bge-m3`                                | text  | 1024                               | 8192       | 5   |
| `snowflake-arctic-embed-l-v2.0`         | text  | 1024 *(Matryoshka 256/512/1024)*   | 8192       | 5   |
| `embeddinggemma-300m`                   | text  | 768 *(Matryoshka 128/256/512/768)* | 2048       | 4   |
| `siglip-base-patch16-256-multilingual`  | image | 768                                | —          | 6   |

## 四、对接 LangChain4j

该服务提供兼容 OpenAI 格式的 API，可直接通过 LangChain4j 的 OpenAI Embedding 模块调用。

**application.yml** 配置：

```yaml
langchain4j:
  embedding:
    openai:
      base-url: http://localhost:7860/v1
      api-key: not-needed
      model: multilingual-e5-small
```

**Java 代码** 构建：

```java
EmbeddingModel model = OpenAiEmbeddingModel.builder()
    .baseUrl("http://localhost:7860/v1")
    .apiKey("not-needed")
    .modelName("multilingual-e5-small")
    .build();
```

> 切换模型时同步更新 `model` 名称和向量维度 `dimension`。

---

部署完成后即可在项目中集成使用，通过切换模型在速度与精度之间灵活选择。