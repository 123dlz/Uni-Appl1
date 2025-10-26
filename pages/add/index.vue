<template>
	<view>

		<view >
		<view class="videov">
			<text style="color: #FFFFFF;"v-if="video == null" @tap="add">+添加视频文件</text>
			<video :muted="muted" id="myVideo" :src="video" :autoplay="true"  v-if="video != null"></video>
		</view>
		<view @tap="imgs" style="margin-top: 20rpx;">
		
		 <image  :src="img" style="width: 720rpx;height: 200rpx;border-radius: 20rpx;margin-left: 15rpx;"></image>

		 </view>
		</view>
		

       <view style="font-size: 30rpx;font-weight: 700;margin: 25rpx;color:#555555 ;">选择视频分类</view>
		<view style="margin: 20rpx;"> 
			<view v-if="item!='全部'" @tap="ts(item)"  class="types" :class="type == item ? 'show' : ''" v-for="(item,index) in dtlist" :key="item.id" >
			<text >{{item}}</text>
			</view>
		</view>
		
		
        <view style="margin-top:70rpx;">
		<view style="font-size: 30rpx;font-weight: 700;margin: 25rpx;color:#555555 ;">输入视频介绍</view>
		<textarea class="textarea" v-model="info" maxlength="100" placeholder="输入视频介绍，最多100字。"/>
        </view>
		<view >
			<view style="font-size: 30rpx;font-weight: 700;margin: 25rpx;color:#555555 ;">视频售价（钻石),若免费无需填写</view>
			<input class="input" type="number" v-model="money" maxlength="11" placeholder="视频售价(钻石个数),免费观看无需填写" />
			
		</view>
		<view >
			<text class="btns" @tap="btns">发布视频</text>
		</view>
		<view style="margin-top: -40rpx;">
			<text class="btnss" @tap="remov">重选视频</text>
		</view>
	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dtlist:[],
				video:null,
				muted:false,
				info:'',
				img:'../../static/font/add.jpg',
				type:'',
				money:0
				
			}
		},
		computed:{
			user(){
				return this.$store.state.Login ? this.$store.state.userinfo : {};
			}
		},
		onLoad() {
			this.GetJson(this.ip + 'setapp.php','POST', {}, e => {
			this.dtlist = e.dtlist
			})
		},
		onReady() {
			this.videoContext = uni.createVideoContext('myVideo');
			this.$nextTick(()=>{
				this.videoContext.play();
			})
		},
		methods: {
			ts(idex){
				this.$set(this,'type',idex)
			},
			imgs(){
				uni.chooseImage({
					count:1,
					crop:{
						width:750,
						height:400
					},
					success: (e) => {
						console.log(e);
						this.img = e.tempFilePaths[0];
					}
				})
			},
			remov(){
				this.video = null;
			},
			add(){
				uni.chooseVideo({
					compressed:false,
					success: (e) => {
						if(e.size  / 1048576 > 100){
							this.showToast('视频文件不得大于100M')
						}else{
							this.video = e.tempFilePath;
							this.$nextTick(()=>{
								this.videoContext.play();
								//setTimeout(()=>{
								//	this.videoContext.seek(0);
								//	this.videoContext.pause();
								//	this.muted = false;
								//},100)
							})
						}
					}
				})
			},
			btns(){
				if(this.video==null){
					this.showToast('请上传视频文件')
				}else if(this.info == ''){
					this.showToast('视频介绍不能为空');
				}else if(this.img == '../../static/font/add.jpg'){
					this.showToast('请上传视频封面');
				}else if(this.type == ''){
					this.showToast('请选择视频分类');
				}else{
					this.tijiao();
				}
				 
			},
			tijiao(){
				this.showload('正在上传视频，请稍等...');
				var uparr = [];
				let img = uni.uploadFile({url:this.ip + 'upload.php',filePath:this.img,name:'data',formData:{sign:this.user.token,type:'img'}})
				let video = uni.uploadFile({url:this.ip + 'upload.php',filePath:this.video,name:'data',formData:{sign:this.user.token,type:'video'}})
				Promise.all([img,video]).then(value =>{
					//console.log(value);
					if(this.countSubstr(JSON.stringify(value),'uploadFile:ok') == 2){
						let sign = this.md5(this.user.token + this.info);
						console.log(JSON.parse(value[0][1].data))
						console.log(JSON.parse(value[1][1].data))
						this.GetJson(this.ip + 'addvideo.php','POST',{
							token:this.user.token,
							sign:sign,
							info:this.info,
							type:this.type,
							money:this.money,
							img:JSON.parse(value[0][1].data).name,
							video:this.url + JSON.parse(value[1][1].data).name
						},e=>{
							this.hideload();
							if(this.isdata(e)){
								uni.showModal({
									content:'视频发布成功！',
									showCancel:false,
									success: () => {
										uni.navigateBack()
									}
								})
							}
							
						})
					}
				}).catch(err=>{
					console.log(err)
					this.showToast('视频上传失败！');
					this.hideload();
				})
			}
		}
	}
</script>
<style>
	page{
		background-color: #111111;
		
	}
.types{
	background-color:#151515;
  	border-radius: 5rpx;
  	padding: 10rpx 13rpx;
  	color: #555555;
  	font-size: 27rpx;
  	display: inline-block;
  	margin-right: 8rpx;
  }
  .show{
  	border-radius: 5rpx;
  	border:2rpx solid  #FC4166;
  	color: #FFF;
  	background-color: #FC4166;
  	}
	.videov{
		width: 750rpx;
		height: 500rpx;
		background-color: #000000;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.textarea{
		border: 1rpx solid #151515;
		border-radius: 15rpx;
		width: 720rpx;
		display: block;
		height: 200rpx;
		color: #555555;
		font-size: 32rpx;
		margin-left: 15rpx;
		background-color: #101010;
		padding: 30rpx;
	}
	.input{
		border: 1rpx solid #151515;
		background-color: #111111;
		text-align: center;
		display: block;
		color: #9B63FF;
		border-radius: 5rpx;
		height: 70rpx;
		margin: 30rpx;
	}

	.btns{
		margin: 62rpx auto 0;
		background-color: #080808;
		border: 5rpx solid #080808;
		width: 700rpx;
		height: 94rpx;
		border-radius: 21rpx;
		font-size: 30rpx;
		color: #555555;
		display: block;
		text-align: center;
		line-height: 88rpx;
	}
    .btnss{
		margin: 62rpx auto 0;
		background-color:#161616;
		border: 5rpx solid #161616;
		width: 700rpx;
		height: 94rpx;
		border-radius: 21rpx;
		font-size: 30rpx;
		color: #555555;
		display: block;
		text-align: center;
		line-height: 88rpx;
	}
	.yanse{	
		padding: 10rpx;
		width: 100%;
		font-size: 28rpx;
		border-color: #b4b3b4;
		color: #b4b3b4;
		border: 1rpx solid #b4b3b4;
		}
	.show{
		border-color: var(--maincolor) !important;
		color: #FFFFFF;
		border: 1rpx solid #fb197f;
		background-color: #fb197f;;
		}
</style>