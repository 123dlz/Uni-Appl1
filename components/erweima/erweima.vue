<template>
	<view class="conn" @tap="close"  @touchmove.stop.prevent="">
		<view class="mainn">
			<image :src="url + img" mode="" @tap.stop.prevent=""></image>
			<!--#ifdef APP-PLUS -->
			<text @tap.stop.prevent="baocun">保存到相册</text>
			<text @tap.stop.prevent="share">微信分享</text>
			<!--#endif -->
			<!--#ifdef H5 -->
			<text>长按图片保存或转发</text>
			<!--#endif -->
		</view>
		
	</view>
			
</template>

<script>
	import appShare, { closeShare } from '../../js_sdk/appShare.js';
	export default {
		name:"erweima",
		props:['close'],
		
		data() {
			return {
				img:this.$store.state.erweima,
			};
		},
		//#ifdef APP-PLUS 
		computed:{
			user(){
				return this.$store.state.userinfo;
			}
		},
		//#endif
		methods:{
			share(){
				this.GetJson(this.ip + 'setapp.php','GET', {}, e => {
				let shareData = {
				      shareUrl:this.url + '/api/Invitation.php?code='+this.user.Invitation,//网址
				      shareTitle:e.app.sharetitle,//分享的标题
				      shareContent:e.app.sharetext,//分享的内容
				      shareImg:'', //分享的图片
				      appId : "wx8fe3bee991034s7f", 
				      appPath : "pages/wode/wode",
				      appWebUrl : this.url,
				};
				// 调用
				let shareObj = appShare(shareData,res => {
				console.log("分享成功回调",res);
				// 分享成功后关闭弹窗
				// 第一种关闭弹窗的方式
				closeShare();
				});
				//setTimeout(() => {
				// 第二种关闭弹窗的方式
				//shareObj.close();
				//},20000);
				})
			      
			},
		  baocun(){
				this.showload();
				if(this.img.indexOf('/static/Invitation/') != -1){
					uni.downloadFile({
						url:this.url +  this.img,
						success:(res) =>{
							this.$store.state.erweima = res.tempFilePath;
							this.bc()
						}
					})
				}else{
					this.bc()
				}
			},
			bc(){
				uni.saveImageToPhotosAlbum({
					filePath:this.$store.state.erweima,
					success: (e) => {
						this.hideload();this.close();
						this.showToast('保存成功')
						this.$store.state.erweima = '/static/Invitation/'+this.$store.state.userinfos.Invitation+'.png';
					},
					fail(err) {
						this.hideload();
						this.showToast('保存失败')
					}
				})
			}
		}
	}
</script>

<style>
	.conn{
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0,0,0,.3);
		animation: opacitys .3s ease;
	}
	.mainn{
		animation: fangda .3s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.mainn>image{
		width: 500rpx;
		height: 900rpx;
		display: block;
		border-radius: 10rpx;
	}
	.mainn>text{
		background-color: var(--maincolor);
		color: #FFFFFF;
		font-size: 24rpx;
		border-radius: 100rpx;
		width: 283rpx;
		height: 83rpx;
		line-height: 83rpx;
		text-align: center;
		display: block;
		margin-top: 40rpx;
	}
	@keyframes fangda{
		0%{
			transform: scale(0.8);
		}
		80%{
			transform: scale(1.01);
		}
		100%{
			transform: scale(1);
		}
	}
	@keyframes opacitys{
		0%{
			opacity: 0;
		}
		100%{
			opacity: 1;
		}
	}
</style>
