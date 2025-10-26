
<template>
<view>
    <view style="margin: 50rpx;margin-top: -2rpx;margin-top: 20rpx;" class="row">
    	<text  class="font" style="font-size: 35rpx;font-weight: 700;">投屏播放:{{name}}</text>
		<text v-if="vodtype==2" class="font" style="font-size: 35rpx;font-weight: 700;margin-left: 15rpx;">{{vodtitle}}</text>
    </view>

   <view class="row" style="margin:10rpx;margin-top: -50rpx;">
		<!--<text v-if="dlnastate==0" @tap="Search"  class="btn">搜索DLNA</text>-->
		<text @tap="Search" v-if="dlnastate==2" class="btns">重新扫描</text>
	</view>
 
    <view v-if="tvList.length==0 && dlnastate==2" >
      <view  style="margin: 30rpx;" >
		<view style="text-align: center;">
			<text style="font-size: 30rpx;color: #7b42e0;">暂未扫描到投屏设备，请检查设备是否正常工作</text>
		</view>
	  </view>
	</view>
	
    <view v-if="dstate==1" class="touping" v-for="(item,index) in tvList">
		<view  @tap="tpplay(item)" style="text-align: center;">
			<text class="sname">设备名称:{{item.name}}</text>
			<text style="font-size:25rpx;display: block;text-align: center;color: #555555;">{{item.udn}}</text>
		</view>
		<view class="btnss" v-if="dlnastate==2" @tap="tpplay(item)" >
			<text style="padding: 10rpx 30rpx;">{{ok==null?'开始投屏':''}}
			<font v-if="err!=null" style="font-size: 35rpx;color:#FFD901;font-weight: 700;">{{err.desc}}</font>
			</text>
		</view>
	</view>
   
  <view  v-if="dstate==1" class="row" style="margin: 20rpx;margin-left:25rpx;">
	<view style="color: #555555;">音量</view>
   <view style="width: 500rpx;margin-left: 20rpx;">
	    <cu-progress v-model="volume" min="0" max="100" height="32" activeColor="#FC5A8B" :use-slot="true" @input="setVolume">
	    	<view style="background: #ffffff;border-radius: 100%;width: 14px;height: 14px;">
	    	</view>
	    </cu-progress>
   </view>
   <view style="margin-left:40rpx;color: #555555;">{{volume}}%</view>
   </view>
   
   <view v-if="dstate==1" style="margin: 20rpx;">
    <view  class="sets" @tap="pause" hover-class="click-hover" hover-stay-time="80">暂停投屏</view>
    <view  class="sets" @tap="resume" hover-class="click-hover" hover-stay-time="80">继续投屏</view>
    <view  class="sets" @tap="setVolume" hover-class="click-hover" hover-stay-time="80">静音</view>
    <view  class="sets" @click="seek(10)" hover-class="click-hover" hover-stay-time="80">快进10秒</view >
	<view  class="sets" @tap="stop" hover-class="click-hover" hover-stay-time="80">结束投屏</view>
   </view>
   
   
</view>
</template>

<script>
	import cuProgress from "../../components/process/process.vue" //引入滑动进度条
	const lyzmlDLNA = uni.requireNativePlugin('lyzml-DLNA');
	export default {
		components: {
			cuProgress
		},
		data() {
			return {
				s:'',
				dlnastate:0,
				dstate:'',
				name:'',
				url:'',
				tvList:[],
				err:null,
				errs:null,
				ok:null,
				volume: 50,
				num:10,
				vodtype:'',
				vodtitle:''
				
			}
		},
		computed: {
			user(){
				return this.$store.state.userinfo;
			}	
		},
		onUnload() {
		},
		onLoad(item) {
		    this.name = item.name;
		    this.url = item.url;
			this.vodtype = item.vodtype;
			this.vodtitle = item.vodtitle;
			this.Search();
			lyzmlDLNA.getIpAddress((ip)=>{
			console.log("====getIPAddress====",ip);
			});
		},
		onReady() {
				
		},
		methods: {
			Search(){
				lyzmlDLNA.startSearch(resp=>{
					console.log(resp);
				    if(resp.code == 0){
				       // this.searchingText = "搜索中...";
						uni.showLoading({title:'搜索中...'})
				    }else if(resp.code == 1){
						this.dstate = resp.code;
				        //返回扫描的结果，eg: [{ip:"192.168.0.108",name:"xiaomiTV",udn:"uuid:748065fdaa8cbfd53939c2de4e3fcb3865f08dea7d7b227df3fe1a8354c4ee4b"}]
				        this.tvList = resp.result;
				    }else if(resp.code == 2){
						this.errs = resp;
						this.dlnastate = resp.code;
						uni.hideLoading();
				        //this.searchingText = "搜索完成";
				    }
				});
			},
			tpplay(item){
				lyzmlDLNA.playVideo({
				  udn:item.udn,
				  mediaURL:this.url
				},(resp)=>{
					console.log(resp);
					this.err = resp;
					this.ok = resp;
				  //这里有个回调，可以不用 
				  //返回信息{code:0,desc:"发送指令成功（并不代表投屏成功）"} 
				  //code非0时为失败，desc返回失败原因 
				 
				  if(resp && 0!=resp.code){
				    uni.showToast({
				        icon: "none",
				        title: "若投屏失败，请尝试重新扫描"
				    });
				  } 
				});
			},
			pause(){
				lyzmlDLNA.pauseVideo()
			},
			resume(){
				lyzmlDLNA.resumeVideo(10); 
			},
			stop(){
				lyzmlDLNA.stopVideo();
			}, 
			setVolume(e){
				lyzmlDLNA.setVolume(e);
			},
			seek(e){
				this.num=this.num*1+e
				let second = this.num;
				this.seconds = this.num;
				lyzmlDLNA.seek(second);
			}
			
	}
}
</script>

<style>
	page {
	    background-color: #111111;
	}
.click-hover{
	background-color: #151515;
	}
.touping{
	margin: 30rpx;
	background-color:#181818;
	border-radius: 15rpx;
	padding: 15rpx 35rpx;
}
.sname{
	font-size:30rpx;
	font-weight: 700;
	color:#FCFCFC;
}
.btn{
		width: 688rpx;
		height: 89rpx;
		background-color: #FFFF00;
		box-shadow: 1px 5px 10px #FCFCD2;
		border-radius: 21rpx;
		font-size: 34rpx;
		color: #000;
		line-height: 85rpx;
		font-weight: 700;
		margin: 24rpx 28rpx;
		justify-content: center;
		text-align: center;
	}
.btns{
		width: 688rpx;
		height: 89rpx;
		text-align: center;
		line-height: 85rpx;
		font-weight: 700;
		background-image: linear-gradient(to right, #202020, #202020, #212121);
		border-radius: 21rpx;
		font-size: 34rpx;
		color: #FFFFFF;
		margin: 24rpx 28rpx;
		justify-content: center;
	}
.btnss{
		text-align: center;
		font-weight: 700;
		padding: 10rpx 50rpx;
		background-image: linear-gradient(to right, #202020, #202020, #212121);
		border-radius: 5rpx;
		font-size: 34rpx;
		color: #FFFFFF;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		line-height: 70rpx;
		height: 90rpx;
	}
.sets{
		text-align: center;
		font-weight: 700;
		padding: 10rpx 50rpx;
		border: 1rpx solid #555555;
		border-radius: 5rpx;
		font-size: 34rpx;
		color: #555555;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		line-height: 70rpx;
		height: 90rpx;
	}
.set{
	font-size:30rpx;
	font-weight: 700;
	background-color: #FFFF00;
	border-radius: 5rpx;
	padding: 10rpx 15rpx
}
.font {
        color:hotpink;
    }

.fonts {
        color:#FCFCFC;
    }
</style>
