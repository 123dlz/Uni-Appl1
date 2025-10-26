<template>
	<view>
		<view v-if="Isurl" class="playtop" >
		   <!--#ifdef APP-PLUS -->
			<video 
			id="myVideo" 
			class="video" 
			:src="playurl" 
			:autoplay="true" 
			:title="title" 
			@error="videoerr" 
			play-strategy="2" 
			:loop="loop" 
			object-fit="cover"
			:controls="true" 
			:show-loading='true'
			:show-center-play-btn="true" 
			:auto-pause-if-open-native="true" 
			:vslide-gesture="true" 
			:show-mute-btn="true" 
			:vslide-gesture-in-fullscreen="true"
			:style="{height:height + 'px'}">
		    </video> 
			<!--#endif-->
			<!--#ifdef H5 -->
				<div class="video" id="player"></div>
			<!--#endif-->
		    
		</view>
		<view v-else style="margin-top: 300rpx;color: red;font-size: 30rpx;text-align: center;">
			{{msg}}
			<view @tap="jiexi" style="margin-top: 50rpx;">
				<text :style="'background-color:'+bgcolor" class="btn">重新解析</text>
			</view>
		</view>
		<view style="margin-top:100rpx;color: red;font-size: 30rpx;text-align: center;">
			url:{{playurl}}
		</view>
		<view style="margin-top:100rpx;color: red;font-size: 30rpx;text-align: center;">
			url:{{src}}
		</view>
		
	</view>
</template>

<script>
	var wv; 
	export default {
		data() {
			return {
				Isurl:false,
				jxurl:'',
				src: '',
				title:'',
				height: 200,
				playurl:'',
				msg:'',
				bgcolor: 'rgba(254,137,42,1)'
			}
		},
		computed: {
			vip(){
				return this.$store.state.vip.vip;
			},
			user(){
				return this.$store.state.userinfo;
			}		
		},
		onLoad(item) {
			this.jxurl = item.jxurl
			this.src = decodeURIComponent(item.url);
			console.log('url：'+this.src)
			this.title = item.title;
			this.ptname = item.ptname;
			uni.setNavigationBarTitle({title:this.title});
			if(this.vip == 0){
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
			
			this.geturl();
			
			
		},
		onUnload() {
			this.src = ''
		},
		onReady() {
			
		},
		methods: {
			geturl(){
				this.type = this.ptname=='m.iqiyi.com'?'1':this.ptname=='m.v.qq.com'?'2':this.ptname=='m.youku.com'?'3':this.ptname=='undefined'?'4':''
				this.GetJson(this.ip + 'Get_jiexi.php','POST',{
					url:this.src,
					name:this.title,
					type:this.type
				},e=>{
					console.log(e)
					console.log(e.code)
					console.log(this.src)
					if(e.code == 200){
						this.playurl = e.url;
						this.Isurl = true;
						
					}else{
						this.msg = '很抱歉，解析失败！'
					}
				})
			},
			jiexi(){
				this.showload('尝试解析中...')
				this.bgcolor = 'rgb(208,89,2)';
				setTimeout(() => {
					this.bgcolor = 'rgba(254,137,42,1)';
				}, 100);
				this.GetJson(this.ip + 'Get_jiexi.php','POST',{
					url:this.src
				},e=>{
					console.log(e)
					console.log(e.code)
					if(e.code == 200){
						this.hideload()
						this.playurl = e.url;
						this.Isurl = true;
					}else{
						this.hideload()
						this.msg = '还是没能解析成功，看看别的吧！'
					}
				})
			},
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
			videoerr(){
				this.showToast('影片地址失效')
			}
		}
	}
	
</script>

<style>
	page{
		background-color: #000;
	}
	.playtop{
		position: fixed;
		left: 0;
		right: 0;
		/*#ifdef H5 */
		top: 0;
		margin-top: -30rpx;
		/*#endif */
		/*#ifdef APP-PLUS */
		top: 0;
		/*#endif */
		z-index: 1;
		background-color: #000000;
	}
	.video{
		width: 750rpx;
	}
	.btn {
		box-shadow: 1px 5px 10px rgba(254, 137, 42, 0.4);
		color: #FFFFFF;
		margin-left: 25rpx;
		width: 700rpx;
		height: 94rpx;
		border-radius: 50rpx;
		display: block;
		font-size: 30rpx;
		font-weight: 700;
		line-height: 100rpx;
		text-align: center;
	}
</style>
