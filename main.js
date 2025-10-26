// 导入App根组件
import App from './App'
// 导入Vue库
import Vue from 'vue'
// 导入Vuex状态管理store
import store from './store'
// 导入MD5加密工具
import md5 from 'static/js/md5.js'

// 关闭Vue生产环境提示
Vue.config.productionTip = false
// 将store挂载到Vue原型上，方便全局调用
Vue.prototype.$store = store
// 设置App的mpType属性为'app'（用于小程序环境）
App.mpType = 'app'

// 创建Vue实例
const app = new Vue({
	store,           // 注入store
	...App           // 展开App组件的配置
})
// 挂载Vue实例
app.$mount()

// 在Vue原型上挂载IP地址配置
Vue.prototype.ip = 'http://192.168.2.183/api/'
// 在Vue原型上挂载基础URL配置
Vue.prototype.url = 'http://192.168.2.183'

// 在Vue原型上挂载MD5加密方法（带盐值）
Vue.prototype.md5 = (data) => {
	return md5(data + 'csadaddsxczc')  // 对数据进行MD5加密并添加盐值
}

// 在Vue原型上挂载HTTP请求方法
Vue.prototype.GetJson = (url, md, data, su, err) => {
	// 使用uni-app的request API发起网络请求
	uni.request({
		url: url,           // 请求URL
		data: data,         // 请求参数
		method: md,         // 请求方法（GET/POST等）
		dataType: 'json',   // 响应数据类型
		header: {           // 请求头配置
			'content-type': 'application/x-www-form-urlencoded'
		},
		success: (e) => {   // 请求成功回调
			if (su != null) su(e.data)  // 调用成功回调函数
		},
		fail: (err) => {     // 请求失败回调
			if (!err) err(e)  // 调用错误回调函数
		}
	})
}

// 在Vue原型上挂载时间格式化方法（相对时间显示）
Vue.prototype.ustime = (time) => {
	var timestamp2 = new Date()  // 当前时间
	var timestamp = Date.parse(timestamp2) / 1000  // 当前时间戳（秒）
	
	let cz = timestamp - time  // 计算时间差
	var crtTime = new Date(time * 1000)  // 将传入的时间戳转换为Date对象
	
	// 根据时间差显示不同的时间格式
	if(cz < 60){
		return '刚刚'  // 1分钟内显示"刚刚"
	}else if(cz < 3600){
		return parseInt(cz / 60) + '分钟前'  // 1小时内显示分钟数
	}else if (cz < 86400 && crtTime.getDate() == timestamp2.getDate()){
		return getApp().gettime('hh:mm',crtTime)  // 同一天内显示具体时间
	}else if(timestamp2.getDate() - crtTime.getDate() == 1){
		return '昨天 '  // 昨天显示"昨天"
	}else if(cz < 31536000){
		return getApp().gettime('MM-dd',crtTime)  // 一年内显示月-日
	}else{
		return getApp().gettime('yyyy-MM-dd hh:mm',crtTime)  // 超过一年显示完整时间
	}
}

// 在Vue原型上挂载时间格式化方法
Vue.prototype.gettime = (date,fmt) => {
	if (fmt == null) fmt = 'yyyy-MM-dd hh:mm:ss'  // 默认时间格式
	let daa = new Date(Number(date) * 1000)  // 将时间戳转换为Date对象
	
	var o = {  // 时间格式配置对象
		"M+" : daa.getMonth()+1,     //月份 
		"d+" : daa.getDate(),     //日 
		"h+" : daa.getHours(),     //小时 
		"m+" : daa.getMinutes(),     //分 
		"s+" : daa.getSeconds(),     //秒 
		"q+" : Math.floor((daa.getMonth()+3)/3), //季度 
		"S" : daa.getMilliseconds()    //毫秒 
	}
	
	// 处理年份格式
	if(/(y+)/.test(fmt))
	fmt=fmt.replace(RegExp.$1, (daa.getFullYear()+"").substr(4 - RegExp.$1.length))
	
	// 处理其他时间格式
	for(var k in o)
	if(new RegExp("("+ k +")").test(fmt)) 
	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)))
	
	return fmt
}

// 在Vue原型上挂载显示Toast提示的方法
Vue.prototype.showToast = (title) => {
	return uni.showToast({
		title: title,        // 提示内容
		icon: 'none',        // 不显示图标
		position: 'bottom',  // 显示位置
		duration: 300        // 显示时长（毫秒）
	})
}

// 在Vue原型上挂载显示加载提示的方法
Vue.prototype.showload = (title) => {
	return uni.showLoading({title})  // 显示加载框
}

// 在Vue原型上挂载隐藏加载提示的方法
Vue.prototype.hideload = () => {
	return uni.hideLoading()  // 隐藏加载框
}

// 在Vue原型上挂载响应数据验证方法
Vue.prototype.isdata = (e) => {
	let is = false  // 验证结果
	
	// 根据响应码进行不同处理
	switch (e.code){
		case 200:  // 成功
			is = true
			break
		case 1:    // 成功（备用码）
			is = true
			break
		case 404:  // 数据异常
			uni.showToast({icon:'none',title:'数据异常'})
			break
		case 405:  // 登录失效
			uni.showToast({icon:'none',title:'登录数据失效，请重新登录'})
			break
		case 601:  // 余额不足
			uni.showToast({icon:'none',title:'余额不足'})
			break
		case 700:  // 支付失败
			uni.showToast({icon:'none',title:'支付失败！'})
			break
		default:
			break
	}
	return is
}

// 在Vue原型上挂载子字符串计数方法
Vue.prototype.countSubstr = (str, substr, isIgnore) => {
	return str.split(substr).length - 1  // 通过分割字符串计算出现次数
}

// 在Vue原型上挂载手机号脱敏方法
Vue.prototype.getphone = (phone) => {
	return phone.substr(0,3) + '****' + phone.substr(7,4)  // 将中间4位替换为*
}

// 在Vue原型上挂载倒计时显示方法
Vue.prototype.showtime = (time) => {
	var nowtime = new Date()  // 获取当前时间
	
	// 检查目标时间是否在未来
	if(time > nowtime.getTime()){
		var lefttime = time - nowtime.getTime(),  // 计算剩余时间（毫秒）
			leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)),  // 计算剩余天数
			lefth = Math.floor(lefttime / (1000 * 60 * 60) % 24),  // 计算剩余小时数
			leftm = Math.floor(lefttime / (1000 * 60) % 60),       // 计算剩余分钟数
			lefts = Math.floor(lefttime / 1000 % 60)              // 计算剩余秒数
		
		var arr = []
		// 按需添加时间单位到数组
		if(leftd > 0) arr.push(leftd + "天")
		if(lefth > 0) arr.push(lefth)
		if(leftm > 0) arr.push(leftm)
		arr.push(lefts)
		
		return arr.join(':')  // 用冒号连接时间部分
	}else{
		return false  // 时间已过返回false
	}
}