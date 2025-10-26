<template>
	<view>
		<web-view :src="src" @message="handleMessage"></web-view>
	</view>
</template>
 
<script>
	export default {
		data() {
			return {
				src:''
			}
		},
		onNavigationBarSearchInputClicked: async function(e) {
			 var pages = getCurrentPages();  
			 var page = pages[pages.length - 1];  
			 var currentWebview = page.$getAppWebview();  
			 currentWebview.children()[0].getURL();  
			  const nw = currentWebview.children()[0];
		},

		onLoad: function (item) { 
			// this.src = this.src+'?src='+option.name;
			this.src = item.url;
		        console.log(this.src); //打印出上个页面传递的参数。
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