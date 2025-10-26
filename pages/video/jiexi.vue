<template>
	<view>
		<view class="view">
			<text class="title">VIP影视解析</text>
			<view class="inputview">
				<input class="input" type="text" v-model="src" placeholder="输入视频播放页面链接" />
				
			</view>
			<view @tap="nulls()" style="color: #555555;margin-top: -105rpx;margin-left: 700rpx;font-size: 40rpx;">x</view>
		</view>

        <view v-if="openplay" style="margin-top:35rpx;margin-left: 20rpx;">
        	 <iframe 
			 :src="jxurl + src" id="videoqp" allow="fullscreen" frameborder="0" width="97%" height="165px"></iframe>
        </view>

         <view v-if="openplay" style="margin-top: 10rpx;">
        	<view class="but">
        		<text v-if="openplay && button"  @tap="landscape" style="font-size: 30rpx;color: #555555;">横屏观看</text>
				<text v-if="!button"  @tap="portrait" style="font-size: 30rpx;color: #555555;">退出横屏</text>
        	</view>
        </view>


        <view style="margin-top:40rpx;">
			<text class="title">选择解析通道</text>
		</view>
		
		
		<view style="margin-left: 20rpx;">
			<view class="tag">
				<text @tap="play(item.url,item.name)" v-for="(item,index) in list" :key="index" class="jxurl" :class="type == item.name ? 'show' : ''">{{item.name}}</text>
			</view>
		</view>
		
		
       <!-- <view class="row">
			<view @tap="play(item.url)" class="border" v-for="(item,index) in list" :key="item.id" >
			    <text style="font-size: 22;padding: 15rpx 15rpx;">{{item.name}}</text>
			</view>
		</view>-->
        
		<view style="margin-top:50rpx;">
			<text class="title">使用问答</text>
			<view class="qa">
				<text>
					问：需要输入什么链接？
				</text>
				<text style="display: block;color:#555555;padding-top:10rpx">
					答：需要输入电影、电视剧的播放页面链接。
				</text>
			</view>
			<view class="qa">
				<text>
					问：怎么获取到所需要的链接？
				</text>
				<text style="display: block;color:#555555;padding-top:10rpx">
					答：使用手机浏览器打开相关的视频网站，找到需要观看的电影或者电视剧。进入播放页面，在浏览器输入框内复制当前网址，粘贴在上方输入框内，点击解析通道即可播放。
				</text>
			</view>
			
			<view class="qa">
				<text> 
					你可以点击下方平台，快速获取链接
				</text>
				<view class="row" style="color:#555555;margin-top:20rpx">
					<text @tap="videopt('https://m.iqiyi.com')" class="ptname">爱奇艺</text>
					<text @tap="videopt('https://m.v.qq.com')" class="ptname" style="margin-left: 20rpx;">腾讯视频</text>
					<text @tap="videopt('https://m.youku.com')" class="ptname" style="margin-left: 20rpx;">优酷视频</text>
				</view>
				    <text style="display: block;color:#555555;padding-top:30rpx">提示：建议卸载官方视频app，否则在浏览器打开官方网站会自动跳转到app内，影响操作。</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openplay:false,
				jxurl:'',
				src:'',
                list:[],
				type:'',
				button:true,
			}
		},
		computed: {
			user() {
				return this.$store.state.userinfo;
			}
		},
		onLoad() {
           this.GetJson(this.ip + 'setapp.php','GET',{},e=>{
           this.list = e.jxlist;
           })
		   
		},
		onUnload(){
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary'); //竖屏
			// #endif

		},
		mounted() {
		    var currentWebview = this.$scope.$getAppWebview();
		    setTimeout(function() {
		    	wv = currentWebview.children()[0];
		    	wv.setStyle({
		    		videoFullscreen: 'landscape'
		    	});
		    }, 1000); 
		  },
		onResize(e) {
			
				
		},
		onReady() {

		},
		methods: {
			nulls(){
				this.src = '';
				this.openplay= false
			},
			videopt(url){
				if(plus.os.name == 'Android' || plus.os.name == 'iOS'){
					plus.runtime.openURL(url);
					return
				}
			},
			play(jxurl,name){
				if(this.src==''){
					this.showToast('请输入链接')
				}else{
					this.$set(this,'type',name)
					this.openplay = true;
					this.jxurl = jxurl;
					
					///uni.navigateTo({
					///	url:'../tool/jiexi/play?jxurl=' + jxurl + '&url=' + this.src
					///})
				}
			},
			landscape(){
				// #ifdef APP-PLUS
				plus.screen.lockOrientation('landscape-primary'); //横屏
				// #endif
				this.button = false
			},
			portrait(){
				// #ifdef APP-PLUS
				plus.screen.lockOrientation('portrait-primary'); //竖屏
				// #endif
				this.button = true
			}
			
			
		}
	}
</script>

<style>
	page {
		background-color: #111111;

	}

	.view {
		margin-top:15%;
	}

	.title {
		color:#FFFFFF;
		display: block;
		font-size: 30rpx;
		font-weight:700;
		margin: 20rpx;
	}

	.inputview {
		background-color: #000000;
		border-radius: 8rpx;
		margin: 20rpx;
	}
    .but{
	margin-top: -10rpx;
	background-color: #151515;
	margin: 10rpx auto 68rpx;
	width:95%;
	height: 94rpx;
	display: block;
	text-align: center;
	line-height: 94rpx;
	border-radius: 15rpx;
	}
	.input {
		padding: 20rpx 20rpx;
		width: 657rpx;
		height: 100rpx;
		font-size: 32rpx;
		color: #555555;
	}
	.border{
		line-height: 80rpx;
		padding: 0 20rpx;
		border-radius:5rpx;
		color:#ffffff;
		margin-left: 20rpx;
		background-color: #555555;
		margin-top: 10rpx;
	}
	.qa{
		padding:15rpx 30rpx;
		color: #999999;
		font-size: 22rpx
	}
	.ptname{
		border-radius: 20rpx;
		border: 1rpx solid #555555;
		padding:5rpx 20rpx;
	}
	.tag{
		margin-top: 15rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
	}
	.tagarr{
		padding: 10rpx 10rpx;
		border-radius:10rpx;
		margin-left: 10rpx;
		border: 1rpx solid #DEDEDE;
		color: #A1A1A2;
		display: block;
		margin-bottom: 15rpx;
		font-size: 24rpx;
	}
	.jxurl{
		margin-top: 15rpx;
		border-radius: 10rpx;
		border:2rpx solid  #555555;
		padding: 15rpx 25rpx;
		color: #8a8a8a;
		font-size: 28rpx;
		display: inline-block;
		margin-right: 15rpx;
		}
	.show{
		border-radius: 10rpx;
		border:2rpx solid  hotpink;
		color: #FFF;
		background-color: hotpink;
		}
</style>