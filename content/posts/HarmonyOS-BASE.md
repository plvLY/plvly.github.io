---
title: HarmonyOS应用开发02 - 基础开发
description: HarmonyOS应用开发
date: 2024-06-22
duration: 30min
lang: 鸿蒙
---

## 一、开发语言 - ArkTS
> 官方文档： [开发指南](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/1_4_u5b66_u4e60arkts_u8bed_u8a00-V5)

ArkTS基于TypeScript的基础上进一步扩展。
ArkTS是HarmonyOS优选的主力应用开发语言。在TypeScript的基础上主要拓展了如下能力

- 基本语法：声明式UI
- 状态管理：提供多维度的状态管理机制
- 渲染控制：提供渲染控制能力

## 二、语法说明
>IDE里面查看组件API：鼠标悬停在组件名称上面，显示提示框->show in API Reference

::alert{type="warning"}
- **声明式UI**
  - **声明式描述**
    只需描述在界面在不同状态下要呈现的最终效果，无需关注界面变化的具体过程
  - **状态数据驱动界面更新**
    只需修改状态变量的值，界面就会自动更新
- **组件化**  -- 内置组件   &  自定义组件
  构成界面的最小单元

::

### 1、**声明组件**

1. 组件参数--在组件名称后面的`(` `)`中配置
2. 属性方法--用于配置组件样式和其他属性，可在组件声明的末尾进行链式调用
3. 事件方法--用于为组件绑定交互事件，可在组件声明的末尾进行链式调用

### 2、**自定义组件**

1. 语法

   ```typescript
   @Component // 装饰器-组件
   struct CustomComponent{ // struct关键字
       params: string = ''; // 组件属性
       build(){//build 方法
           // 你的代码
       }
   }
   ```

	- struct关键字

		是ArkTS新增的用于自定义组件或者自定义弹窗的关键字

	- build方法

		`build()`方法用于声明自定义组件的UI结构

	- 组件属性

		用作于自定义组件的参数，使得自定义组件更为通用

	- @Component装饰器

		用于装饰`struct`关键字声明的数据结构，`struct`被`@Component`装饰后才具有组件化的能力

### 3、**渲染控制**

1. 条件渲染
   - 根据不同的状态渲染不同的UI界面  --- if-else 语句
2. 循环渲染
   - 可使用`ForEach`语句基于一个数组快速渲染一个组件列表

### 4、**常用组件**

> **Image -- 图片组件**

1. 参数类型： string | Resource | media.PixelMap
	1. string类型： 用于通过路径的方式引用图片--Image('images/img.png') ,  Image('https://xxx.xxx.png')
		- 使用这种方式引入本地图片，需要将图片置于`ets`目录下，并且需要为`image`组件提供图片相对于`ets`的路径
		- 使用这种方式引入网络图片，真机模式下需要配置网络访问权限，预览模式及模拟器不受限制
	2. Resource 类型：
		- 引入resource目录下的图片
			- media目录： Image($r('app.media.<文件名称>'))
			- rawfile目录： Imgae($rawfile('icon.png'))
	3. media.PixelMap类型：指的是图片的**像素位图**，通常是一个二维数组，数组中的每个元素对应着图片中的一个像素。像素位图主要用于图片编辑的场景

> **Text -- 文本组件**

  1. 参数类型： string | Resource
		1. string类型：Text('这是一个文本')
		2. Resource类型：Text($r('app.string.<配置的name>'))

> **Button -- 按钮组件**

  1. 不包含子组件

  		- Button(label?: string,options?: { type?: ButtonType, stateEffect?: boolean})
  			- label: 文字内容
  			- type：按钮形状
  			- stateEffect：是否开启点击效果
  2. 包含子组件

  		- Button(options?: { type?: ButtonType, stateEffect?: boolean})

> **Toggle -- 切换按钮组件**

  1. Toggle(options: { type: ToggleType, isOn?: boolean})

  		- type : 按钮类型--开关、复选框、按钮
  		- isOn: 用于设置组件的状态

> **TextInput -- 文本输入**

```typescript
TextInput(value?: {placeholder?: string|Resource, text?: string|Resource})
```

- placeholder: 提示内容
- text: 当前输入的内容

> Progress -- 进度条

 ```typescript
Progress(options: {value: number, total?: number, type?: ProgressType})
 ```

- value: 进度值
- total: 总值
- type: 线条样式、环形无刻度样式、月食样式、环形有刻度样式、胶囊样式

> **弹窗**

  1. Toast -- 消息提示

```typescript
import promptAction from '@ohos.promptAction'
```

```typescript
showToast(options: {message: string|Resource, duration?:number, bottom?: string | number})
```

  2. AlertDialog -- 警告对话框

```typescript
AlertDialog.show()
```

  3. ActionSheet -- 操作列表弹窗

```typescript
ActionSheet.show()
```

  4. 选择器弹窗
		1. TextPickerDialog: 文本滑动选择器弹窗
		2. DatetPickerDialog：日期滑动选择器弹窗
		3. TimetPickerDialog：时间滑动选择器弹窗

  5. 自定义弹窗

		1. 使用@CustomDialog装饰器装饰自定义弹窗。
		2. @CustomDialog装饰器用于装饰自定义弹框，此装饰器内进行自定义内容（也就是弹框内容）    		
		```typescript
		@CustomDialog
		struct CustomDialogExample {
			controller: CustomDialogController = new CustomDialogController({
				builder: CustomDialogExample({}),
			})
		
			build() {
				Column() {
					Text('我是内容')
						.fontSize(20)
						.margin({ top: 10, bottom: 10 })
				}
			}
		}
		```
		
		3. 创建构造器，与装饰器呼应相连。 
		
		```typescript
			@Entry
			@Component
			struct CustomDialogUser {
				dialogController: CustomDialogController = new CustomDialogController({
					builder: CustomDialogExample(),
				})
			}
		```
		
		4. 点击与onClick事件绑定的组件使弹窗弹出。 
  		
		```typescript
			@Entry
			@Component
			struct CustomDialogUser {
				dialogController: CustomDialogController = new CustomDialogController({
					builder: CustomDialogExample(),
				})
				build() {
					Column() {
						Button('click me')
							.onClick(() => {
								this.dialogController.open()
							})
					}.width('100%').margin({ top: 5 })
				}
			}
		```
### 5、样式复用
> @Styles 和@Extend 装饰器

> @Styles 修饰的方法 不能传参数，只能使用通用的属性方法和通用事件方法

```typescript
//组件内使用
struct stylePage{
    build(){
        ...
        Button()
            ...
            .commonStyle()
            ...
        ...  
    }
  	//组件内样式定义
    @Styles commonStyle(){
        .width(100)
        .height(100)
    }
}
//文件内全局
@Styles function globalStyle(){
    .width(100)
    .height(100)
}
```

> @Extend 只能用于指定类型的组件，只能全局，支持传参数

```typescript
@Extend(Button) function buttonStyle(){
    ...
}
```

```typescript
@Extend(Button) function buttonStyle(color: Color, callback: () => void){
    .width(100)
    .height(100)
    .backgroundColor(color)
}
```

### 6、**UI结构复用**

> @Builder 方法定义在组件内或者全局

```typescript
@Builder commonButton(icon:Resource,text:string,callback:()=>void){
    Button(){
        Row({ space: 10 }){
            Image(icon)
            	.width(25)
            	.height(25)
           	Text(text)
            	.fontColor(Color.White)
            	.fontSize(25)
        }
    }
    .width(120)
    .height(50)
    .onClick(callback)
}
```

> 若复用UI结构没有状态，推荐使用@Builder方式，否则使用自定义组件

> @BuilderParam 用于装饰自定义组件(struct)中的属性，其装饰的属性可作为一个UI结构的占位符，待创建该组件时，可通过参数为其传入具体内容---类似vue  插槽slot

| 组件定义                                                     | UI结构定义                                                   |                           组件创建                           |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------: |
| @Component<br />struct Container{<br />@BuilderParam content: () => void<br />build(){<br />Column(){<br />Text()<br />this.content()<br />Button('按钮')<br />}<br />}<br />} | @Builder function contentBuilder1(){}<br />@Builder function contentBuilder2(){}<br />@Builder function contentBuilder3(){} | Container({content: contentBuilder1})<br />Container({content: contentBuilder2})<br />Container({content: contentBuilder3})<br /> |

### 7、布局

1. 线性布局--Column \ Row
2. 层叠布局-Stack
3. 弹性布局-Flex
4. 网格布局-Grid
5. 列表布局-List

### 8、组件级状态管理

> @State、@Prop、@Link、@Provide、@Consume等等
>
> @Prop：子组件使用@Prop,父组件可单向更新子组件状态，子组件不可更新父组件
>
> @Prop装饰的变量不允许本地初始化，只能通过父组件向子组件传参数进行初始化
>
> @Link：双向同步，不允许本地初始化，只能通过父组件向子组件传参数进行初始化。父组件必须使用`$变量名`的方式传参，以表示传递的是变量的引用

```typescript
//父组件
@Entry
@Component
struct Parent{
    @State count: number = 1;
    build(){
        Column(){
            Child({count: $count})
        }
    }
}

//子组件
@Component
export struct Child{
    @Link count: number;
    build(){
        Text(this.count.toString())
    }
}
```

> @Provide、@Consume  成对使用
>
> 跨组件层级传递状态信息，@Provide用于装饰祖先组件的状态变量，@Consume用于装饰后代组件的状态变量，并且可以实现双向同步
>
> 通过变量名绑定，也可以别名绑定
>
> @Provide('count')
> @Consume('count')

### 9、路由

> import router from '@ohos.router'
>
> router 模块用于实现页面路由功能
>
> router.pushUrl()  保留当前当前页面的状态
>
> router.replaceUrl() 销毁当前页面，目标页面替换当前页面
>
> router.back() 返回，，没参数就是返回上一页，带参数旧返回指定上一页(历史栈有的话)

```typescript
//传递参数
router.pushUrl({
    url: '',
    params: {
        ...
    }
})
//获取参数
let params = router.getParams()
```

### 10、组件生命周期钩子函数

> 普通组件生命周期函数

- aboutToAppear():该函数会在组件出现前被调用，创建自动有组件实例之后，执行build之前
- aboutToDisappear():该函数会在组件销毁之前被调用

> 页面入口组件生命周期函数
>
> --使用@Entry装饰的组件

- aboutToAppear():该函数会在组件出现前被调用，创建自动有组件实例之后，执行build之前
- aboutToDisappear():该函数会在组件销毁之前被调用
- onPageShow():页面每次显示时都会被调用一次，包括路由、应用从后台进入前台等场景
- onPagehide():页面每次隐藏时都会被调用一次，包括路由、应用从前台进入后台等场景
- onBackPress():当用户点击返回按钮时会被调用