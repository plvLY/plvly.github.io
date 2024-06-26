---
title: HarmonyOS应用开发00 - 环境搭建
description: HarmonyOS应用开发
date: 2024-06-22
duration: 20min
lang: 鸿蒙
---
## 安装开发工具 - DevEco Studio
> 下载地址地址：[DevEco Studio](https://developer.huawei.com/consumer/cn/deveco-studio/){:target="_blank"}


除了安装路径，其他直接next即可

![install.png](/img/HMOS/install.png)

## 环境配置

>  **node**

::alert{type="warning"}
版本要求  - 高于v14.19.1，低于v17.0.0
::

> **ohpm**工具包  - 包管理工具

![img.png](/img/HMOS/setOhpm.png)
::alert{type="tip"}
首次使用开发者工具时，可直接进行在线安装-包含Node.js、ohpm和SDK
::
![img.png](/img/HMOS/onlineInstall.png)
## 模拟机安装

::alert{type="warning"}
说明
- 单击**File > Settings > SDK**，下拉框选择**HarmonyOS**，勾选并下载Platforms下的**System-image**和Tools下的**Emulator**资源。
- Local Emulator支持Phone、TV和Wearable设备，下载**System-image**时，请选择对应设备的**System-image**。
- 升级模拟器版本时，需同时勾选Platforms下的**System-image**和Tools下的**Emulator**资源，勾选后点击**Apply**。
::

> 打开设备管理工具：Tools --> Device Manager

![device.png](/img/HMOS/device.png)

> 在**Local Emulator**页签中，单击右下角的**New Emulator**按钮，创建一个本地模拟器

![selectDevice.png](/img/HMOS/selectDevice.png)

> 在管理页面点击绿色小三角即可运行模拟器

![vm.png](/img/HMOS/vm.png)

## 验证 - Hello World
> 打开IDE -- 点击Create Project，创建新工程

![img.png](/img/HMOS/createHW.png)

> 填写相关信息，SDK选择API9(对应鸿蒙4.0)，Model选择Stage(对应鸿蒙4.0，FA为旧版本SDK)

![editInfo.png](/img/HMOS/editInfo.png)

> 右上角点击运行，DevEco Studio会启动应用/服务的编译构建，完成后应用/服务即可运行在模拟器上

## 注意事项

- IDE启动时会有环境监测

![img.png](/img/HMOS/envCheck.png)

1. 当ohpm配置正常，却无法检测
   - 打开注册表的：计算机\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Command Processor
   - 删除 autorun 的 值 chcp 65001
   - 确定--即可解决该问题
2. 安装模拟器出现：Haxm安装失败
   - ![img.png](/img/HMOS/haxmFail.png)
   - 打开“启用或关闭 Windows 功能”
   - 勾选启用“Windows 虚拟机监控程序平台”
   - 勾选启用“虚拟机平台”
   - 确定 -- 待重启计算机 即可解决该问题
