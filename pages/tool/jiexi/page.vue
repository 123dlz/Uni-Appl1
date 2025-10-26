<template>
	<view>
		<web-view :src="isurl?deurl:src" @message="handleMessage"></web-view>
	</view>
</template>
 
<script>
	export default {
		data() {
			return {
				isurl:false,
				src:'',
				deurl:''
			}
		},
		onShow() {
			console.log('进来了');//获取当前web-view的URL
			var pages = getCurrentPages();  
			var page = pages[pages.length - 1];  
			var currentWebview = page.$getAppWebview();  
			console.log(JSON.stringify(page));//获取当前web-view的URL
		},
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			 var pages = getCurrentPages();  
			 var page = pages[pages.length - 1];  
			 var currentWebview = page.$getAppWebview();  
			 currentWebview.children()[0].getURL();  
			  const nw = currentWebview.children()[0]; 
			  
			  console.log('接收到的URL：' + currentWebview.children()[0].getURL());  
			// var nw=plus.webview.create('http://m.weibo.cn/u/3196963860',{top:'46px',bottom:'0px'});
				
			
		},
		//点击导航栏 buttons 时触发 
		onNavigationBarButtonTap(e) {
				uni.switchTab({
				    url: '/pages/video/index' 
				 })
		},
		onReady() {
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];  
			var currentWebview = page.$getAppWebview();  
			currentWebview.children()[0].getURL(); 
			 const nw = currentWebview.children()[0]; 
			nw.appendJsFile('hybrid/html/js/uni.webview.1.5.1.js');
			nw.appendJsFile('hybrid/html/js/jquery.min.js');
			nw.appendJsFile('hybrid/html/js/index.js');
			
			// nw.evalJS('alert("evalJS: "+location.href);');
		},
		onLoad: function (item) { 
			
			// this.src = this.src+'?src='+option.name;
			this.src = item.url;
		        console.log(this.src); //打印出上个页面传递的参数。
			setTimeout( () => {
				this.deurl = this.src;
				console.log('刷新了');  
				}, 1000);
				
		    },
		methods: {
			 handleMessage(evt) {  
			                console.log('接收到的消息：' + JSON.stringify(evt.detail.data));  
			            }
		}
	}
</script>
 
<style>
 
</style>