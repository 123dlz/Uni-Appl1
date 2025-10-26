<template>
	<view>
		<view style="margin-top: 20rpx;background-color: #111111;height: 300rpx;">
			<view style="text-align:center;border:greensolid1px;" >
				<image style="top: 45rpx ;width: 150rpx;height: 150rpx;display:inline-block;" src="../../static/ulogo.png"></image>
				
			</view>
			<view style="text-align: center;margin-top: 60rpx;font-size: 28rpx;">
			<text style="color: #555555;">{{ititle}}v{{uniVersion}}</text>
			</view>
		</view>
		<view class="view" >
			<view @tap="tap('user')" hover-class="click-hover" hover-stay-time="80">
				<text>个人资料</text>
				<text class="iconfont">&#xe625;</text>
			</view>
			<view @tap="tap('xieyi')" hover-class="click-hover" hover-stay-time="80">
				<text>用户协议</text>
				<text class="iconfont">&#xe625;</text>
			</view>
			<view @tap="tap('zengce')" hover-class="click-hover" hover-stay-time="80">
				<text>隐私政策</text>
				<text class="iconfont">&#xe625;</text>
			</view>
			<view @tap="tap('mianze')" hover-class="click-hover" hover-stay-time="80">
				<text>免责声明</text>
				<text class="iconfont">&#xe625;</text>
			</view>
			<view @tap="tap('zhuxiao')" hover-class="click-hover" hover-stay-time="80">
				<text>注销账号</text>
				<text class="iconfont">&#xe625;</text>
			</view>
			<view @tap="tap('huancun')" hover-class="click-hover" hover-stay-time="80">
				<text>清除缓存</text>
				<text>{{huancun}}</text>
				<text class="iconfont">&#xe625;</text>
			</view>
			<view @tap="tap('up')" hover-class="click-hover" hover-stay-time="80">
				<text>当前版本</text>
				<text>v{{uniVersion}}</text>
				<text class="iconfont">&#xe625;</text>
			</view>
		</view>
		
		<text class="btns" @tap="btns">退出登陆</text>
		
        <view class="bottom">
            <text style="color:#333333">copyright@2024 
			{{ititle}} wgt:{{wgtVersion}}</text>
        </view>
	</view>
	

</template>

<script>
	export default {
		data() {
			return {
				huancun: '',
				ititle:'',
				wgtVersion:''
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			plus.runtime.getProperty( plus.runtime.appid, (wgtInfo) => {
				this.wgtVersion = wgtInfo.version 
			})
			plus.cache.calculate((size) => {
				this.huancun = this.formatSize(size);
			});
			// #endif
			this.GetJson(this.ip + 'setapp.php','POST', {}, e => {
			this.ititle = e.ititle
			})
		},
		computed:{
			// #ifdef APP-PLUS
			uniVersion(){
				return plus.runtime.version;
			}
			// #endif
			
		},
		methods: {
			tap(item) {
				switch (item) {
					case 'user':
						uni.navigateTo({
							url: '../mydata/mydata'
						})
						break;
					case 'huancun':
						uni.showModal({
							content:'是否清理缓存？',
							success: (e) => {
								if(e.confirm){
									this.showload();
									plus.cache.clear(()=>{
										this.hideload();
										this.showToast('缓存已清理！');
										this.huancun = '';
									});
								}
							}
						})
						break;
					case 'guanyu':
						plus.runtime.openURL(this.$store.state.config.guanyu);
						break;
					case 'xieyi':
						plus.runtime.openURL(this.$store.state.config.agreement);
						break;	
					case 'zengce':
						plus.runtime.openURL(this.$store.state.config.privacypolicy);
						break;
					case 'mianze':
						plus.runtime.openURL(this.$store.state.config.disclaimers);
						break;
					case 'zhuxiao':
						uni.navigateTo({
							url: 'cancellation/cancellation'
						})
						break;
					case 'up':
						uni.$emit('getgengxin',true);
						break;
					default:
						break;
				}				
			},
			formatSize(size){
				var fileSizeString;
				size = parseInt(size);
				if (size == 0) {
					fileSizeString = "0B";
				} else if (size < 1024) {
					fileSizeString = size + "B";
				} else if (size < 1048576) {
					fileSizeString = (size / 1024).toFixed(2) + "KB";
				} else if (size < 1073741824) {
					fileSizeString = (size / 1048576).toFixed(2) + "MB";
				} else {
					fileSizeString = (size / 1073741824).toFixed(2) + "GB";
				}
				return fileSizeString;
			},
			btns(){
				uni.showModal({
					content:'是否退出登陆？',
					success: (res) => {
						console.log(res)
						if(res.confirm){
							this.$store.commit('removuser');
							uni.redirectTo({
								url:'../login/login'
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #111111;
	}
	.click-hover{
	background-color: #181818;
	}
	.view {
		background-color: #111111;
		margin-top: 20rpx;
	}
    .bottom{
    	width: 643rpx;
    	height: 94rpx;
    	font-size: 20rpx;
    	color: #c2c3c4;
    	display: block;
    	text-align: center;
    	margin: 90rpx auto 0;
    }
	.view>view {
		padding: 35rpx 42rpx;
		border-bottom: 1rpx solid #151515;
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #555555;
	}
	.aimi{
		
		width: 643rpx;
		height: 94rpx;
		font-size: 20rpx;
		color: #555555;
		display: block;
		text-align: center;
		margin: 90rpx auto 0;
	}

	.view>view>text:nth-child(1) {
		font-size: 30rpx;
		color: #555555;
		display: flex;
		flex: 1;
	}
	.btns{
		background: #191919;
		width: 643rpx;
		height: 94rpx;
		border-radius: 50rpx;
		font-size: 30rpx;
		color: #555555;
		display: block;
		text-align: center;
		line-height: 94rpx;
		margin: 90rpx auto 0;
	}
</style>
