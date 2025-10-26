### popup-input 底部弹窗输入框


**属性说明：**

|属性名			|是否必须	|类型			|默认值			|说明								|
|---			|----		|----			|---			|---								|
|v-model		|是			|Boolean		|false			|使用 v-model 绑定一个布尔值类型的变量，控制弹出显示或关闭                     |
|height			|否			|String,Number	|300(rpx)		|弹窗总高度							|
|background		|否			|String			|#fff			|弹窗背景色							|
|borderRadius	|否			|Number			|30(rpx)		|弹窗的顶部圆角						|
|inputHeight	|否			|String,Number	|80(rpx)		|输入框的高度						|
|titel			|否			|String			|---			|中部的标题文字						|
|maxlength		|否			|Number			|25				|最大输入长度						|
|cancelSize		|否			|String,Number	|32(rpx)		|取消按钮文字大小					|
|cancelColor	|否			|String			|#888			|取消按钮颜色						|
|confirmSize	|否			|String,Number	|32(rpx)		|确认按钮文字大小					|
|confirmColor	|否			|String			|#007AFF		|确认按钮颜色						|
|titleSize		|否			|String,Number	|36(rpx)		|中部标题大小						|
|titleColor		|否			|String			|#000			|中部标题文字颜色					|
|titleWeight	|否			|String,Number	|500			|中部标题文字粗细					|
|type  			|否			|String			|text			|键盘输入类型，可选值['text','number','idcard','digit'],详情参照input标签				|

**事件说明：**

|事件称名	|是否必须	|说明						|
|---		|----		|----						|
|confirm	|是			|点击弹窗确认键时触发，event = {isShow: false, value: value}，请在事件触发后重置 组件 {property}isShow 所绑定的变量		|
|cancel		|是			|点击弹窗取消键时触发，event = {isShow: false, value: ''}，请在事件触发后重置 组件 {property}isShow 所绑定的变量			|