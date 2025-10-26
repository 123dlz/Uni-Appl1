<template>
	<view>
		<view  style="margin-top: 250rpx;">
        <view class="view row">
			<input type="text" v-model="card"  placeholder="请输入卡密" placeholder-style="font-weight: 800; color:#fc91c4;"/>
		</view>
		<text class="btns" @tap="btns">充值钻石</text>
		</view>

       <view>
		   <text class="btns" @tap="kami">购买冲钻卡密</text>
	   </view>

	</view>
</template>

<script>

	export default {
		data() {
			return {
				card:''
			}
		},
		computed:{
			user(){
				return this.$store.state.userinfo;
			}
		},
		onLoad(){
				this.GetJson(this.ip + 'setapp.php','POST', {}, e => {
				this.kamiurl = e.app.buyzs;
				
				})	
			},
		methods: {
			kami(){
				let url = this.kamiurl
				if(plus.os.name == 'Android' || plus.os.name == 'iOS'){
					plus.runtime.openURL(url);
					return
				}
				uni.navigateTo({url: url}) 
				
			},
			btns(){
				if(this.card.length==''){
					this.showToast('请输入卡密');
				}else{
					this.showload('查询中...');
					let sign = this.md5(this.$store.state.userinfo.token + this.card + 'zuanshi');
					this.showload();
					this.GetJson(this.ip + 'cards.php','POST',{
						token:this.$store.state.userinfo.token,
						card:this.card,
						sign:sign},
						e=>{
						this.hideload();
						//console.log(e);
						switch (e.code){
							case 404:
								this.showToast('数据异常');
								break;
							case 403:
								this.showToast('卡密不存在或输入有误！');
								break;
							case 200:
							this.showToast('充值成功' );
								uni.navigateBack({
									animationType:'pop-out'
								});
								break;
							default:
								break;
						}
					})
				}
			}
		},
		onReady() {
			//plus.navigator.closeSplashscreen()
		}
	}
	



</script>

<style>
page{
	width: 100%;
	
	background-color: #111111;
}
	.fonta{
		background-image: linear-gradient(to right ,#521fad,#7b42e0,#521fad); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.fontb{
		background-image: linear-gradient(to right ,#f93bd7,#fcd22c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.fontc{
		background-image: linear-gradient(to right ,#6b45aa,#7649c0,#6b45aa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.view{
	    margin-top: 400rpx;
		margin: 30rpx 88rpx 70rpx;
		padding-bottom: 20rpx;
		border-bottom: 0.2rpx solid #fc91c4;
		position: relative;
	}
	.view>text{
		width: 700rpx;
		color: #fc91c4;
		font-size: 35rpx;
		font-weight: 500;
		display: block;
		margin-right: 26rpx;
	}

	.view>input{
		width: 700rpx;
		font-weight: 800;
		color: #fdadc9;
		display: flex;
		flex: 1;
		font-size: 32rpx;
	}
	.view>view{
		margin: 20RPX;
		height: 53rpx;
		position: absolute;
		right: 0;
		color: #ff2b71;
		border-radius: 20rpx;
        /*border: 1rpx solid #ff2b71;*/
		font-size: 14px;
		
		line-height: 53rpx;
		text-align: center;
		border-radius: 100rpx;
	}
.btns{
		margin: 72rpx auto 48rpx;
		width: 650rpx;
		height: 87rpx;
		background-image: linear-gradient(to right ,#521fad,#7b42e0,#521fad);
		border-radius: 20rpx;
		font-size: 34rpx;
		color: #FFFFFF;
		display: block;
		text-align: center;
		line-height: 87rpx;
	}

</style>
