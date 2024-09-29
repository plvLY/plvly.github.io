---
title: ComfyUI本地部署及配置Flux模型
description: ComfyUI本地部署及配置Flux模型
date: 2024-09-27
duration: 5min
lang: AI
author: plv
---

> **ComfyUI**(v0.2.2版本): [官网下载](https://github.com/comfyanonymous/ComfyUI/releases/tag/v0.2.2){:target="_blank"}  

解压出来后，根据电脑的配置选择CPU运行或者GPU运行(建议使用GPU，会快很多)

![ComfyUI.png](/img/ComfyUI/ComfyUI-01.png)

运行成功后

![ComfyUI.png](/img/ComfyUI/ComfyUI-02.png)

>  **设置中文**：[下载](https://github.com/AIGODLIKE/AIGODLIKE-ComfyUI-Translation){:target="_blank"} 

中文包解压后放到ComfyUI对于的目录下`**\ComfyUI\custom_nodes\`

![ComfyUI.png](/img/ComfyUI/ComfyUI-03.png)

![ComfyUI.png](/img/ComfyUI/ComfyUI-04.png)

> **ComfyUI设置中文**

![ComfyUI.png](/img/ComfyUI/ComfyUI-05.png)



> **Flux模型下载**

[>24G官方满配版下载FLUX.1-dev](https://huggingface.co/black-forest-labs/FLUX.1-dev/tree/main){:target="_blank"}

[>12G大佬优化版下载flux-fp8](https://huggingface.co/black-forest-labs/FLUX.1-dev/tree/main){:target="_blank"}

[大多数支持版下载FLUX.1-schnell](https://huggingface.co/black-forest-labs/FLUX.1-dev/tree/main){:target="_blank"}

下载完成后放到`**\ComfyUI\models\unet\`

![ComfyUI.png](/img/ComfyUI/ComfyUI-06.png)

> **CLIP模型下载**

[下载](https://huggingface.co/comfyanonymous/flux_text_encoders/tree/main){:target="_blank"}

`32G往上选择fp16，其他选择fp8`

存放至：`**\ComfyUI\models\clip\`

> VAE模型下载

[下载](https://huggingface.co/black-forest-labs/FLUX.1-schnell/blob/main/ae.safetensors){:target="_blank"}

存放至：`**\ComfyUI\models\vae\`

> 流程配置--待续