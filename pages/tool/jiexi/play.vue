<template>
	<view>
	<web-view :src="jxurl + src "></web-view>
	</view>
</template>

<script>
	var wv; 
	export default {
		data() {
			return { 
				jxurl:'',
				src: ''
			}
		}, 
		computed: {
			user(){
				return this.$store.state.userinfo;
			}		
		},
		onLoad(item) {
			// 获取当前运行平台信息
			const platform = uni.getSystemInfoSync().platform;
			if (platform === 'android') { // Android平台
			    const packageName = 'com.heytap.market'; // 需要禁止启动的第三方应用包名
			    if (packageName!='com.heytap.market') {
			        try {  
			            plus.runtime.launchApplication({
			                pname: packageName,
			                action: ''
			            });
			        } catch(e) {}
			    } else {
			        console.log('未指定需要禁止启动的第三方应用');
			    }
			} else if (platform === 'ios') { // iOS平台
			    const bundleId = ''; // 需要禁止启动的第三方应用Bundle ID
			    if (bundleId) {
			        try {
			            plus.runtime.openURL({
			                url: `yourapp://${bundleId}`
			            }, function () {}, function () {});
			        } catch(e) {}
			    } else {
			        console.log('未指定需要禁止启动的第三方应用');
			    }
			} else {
			    console.log('不支持此平台');
			}
			this.jxurl = item.jxurl
			this.src = item.url;
			this.title=item.title;
			this.ptname=item.ptname;
			if(this.$store.state.vip.vip == 0){
				 this.showToast('您还不是会员');
					setTimeout(()=>{
				     uni.navigateBack()
			          },500) 
			       }
		    var currentWebview = this.$scope.$getAppWebview();
		    setTimeout(function() {
		    	wv = currentWebview.children()[0];
		    	wv.setStyle({
		    		videoFullscreen: 'landscape'
		    	});
		    }, 1000); 
		    this.add();
		},
		onReady() {
			
		},
		methods: {
			add(){
				let sign = this.md5(this.user.token + 'ptrecord');
				this.GetJson(this.ip + 'addptrecord.php','POST',{
					sign:sign,
					token:this.user.token,
					userid:this.user.userid,
					title:this.title,
					url:this.src,
					ptname:(this.ptname=='m.iqiyi.com'?'1':this.ptname=='m.v.qq.com'?'2':this.ptname=='m.youku.com'?'3':this.ptname=='undefined'?'4':'')
				},e=>{
					this.hideload();
					if(this.isdata(e)){
								
					}
				})
			},	
		}
	}
	
</script>

<style>
</style>
