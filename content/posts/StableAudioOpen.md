---
title: Stable Audio Open 文生音频
description: Stable Audio Open 文生音频
date: 2024-09-29
duration: 10min
lang: AI
author: plv
---

> **RC-stable-audio-tools**: [tools源码](https://github.com/RoyalCities/RC-stable-audio-tools){:target="_blank"}  

>  **本地部署-windows** 

#### 一、Clone 仓库

```bash
git clone https://github.com/RoyalCities/RC-stable-audio-tools.git
cd RC-stable-audio-tools
```

#### 二、设置虚拟环境

```bash
python -m venv venv
venv\Scripts\activate
```

#### 三、安装相关依赖

```bash
pip install stable-audio-tools
pip install .
```

#### 四、设置 `torch` 相关的东西

确保使用 GPU/CUDA 而非默认使用CPU,卸载后重装 `torch`, `torchvision`, `torchaudio` 

```bash
pip uninstall -y torch torchvision torchaudio
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

#### 五、配置

根目录下的`config.json`可自定义模型`models_directory`和输出的目录  (.wav and .mid 文件存放在此): 

```json
{
    "models_directory": "models",
    "generations_directory": "generations",
    "hffs": [{
        "path": "models",
        "options": [
            "RoyalCities/RC_Infinite_Pianos",
            "cocktailpeanut/stable-audio-open-1.0",
            "RoyalCities/Vocal_Textures_Main"
        ]
    }]
}

```

![T2A.png](/img/T2A/03.png)

#### 六、使用

**首次运行时（模型未下载）**

```bash
python run_gradio.py
```

界面将会显示模型下载

![T2A.png](/img/T2A/01.png)

**下载模型完成后，用以下命令重启终端**

```bash
python run_gradio.py --model-config models/cocktailpeanut-stable-audio-open-1.0/model_config.json --ckpt-path models/cocktailpeanut-stable-audio-open-1.0/model.ckpt
```

**注意：**命令行中的路径以实际模型下载后的路径为准

![T2A.png](/img/T2A/04.png)

**最终页面效果**

![T2A.png](/img/T2A/02.png)

#### 七、常见问题

- 启动时异常--缺少依赖
    - 回到`三`步骤，多`install`几次
- 下载模型需要科学上网(模型在`HuggingFace`)
- 下载模型时可能会出现时间过长(10分钟？)，导致`time_out`，重新点击页面的`download`即可