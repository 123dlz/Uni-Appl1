<template>
	<view>
		<view class="view1">
			<text>您将要注销<font class="phone">{{getphone(user.phone)}}</font>的账号</text>
		</view>
		<view class="view">
			<view>
				<text class="iconfont">&#xe631;</text>
				<text>温馨提示</text>
			</view>
			<text>确定注销后，您在此账号下的所有数据将被删除（包括身份信息、钻石、余额、交易记录等等），注销后所有数据不可恢复，也不再享有任何权益。确认注销既视为同意放弃在本平台的一切合法权益、虚拟资产。请谨慎操作。</text>
		</view>
		<text class="btns" @tap="btns">确认注销</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		computed:{
			user(){
				return this.$store.state.userinfo;
			}
		},
		methods: {
			btns(){
				uni.showModal({
					content:'是否注销账号？',
					success: (res) => {
						if(res.confirm){
							this.showload('正在注销...');
							let sign = this.md5(this.user.token + 'removuserinfo');
							this.GetJson(this.ip + 'cancellation.php','POST',{token:this.user.token,sign:sign},e=>{
								this.hideload();
								if(this.isdata(e)){
									this.showToast('您的账户已注销成功！');
									this.$store.commit('removuser');
									uni.redirectTo({
										url:'../../login/login'
									})
								}
							})
						}
					}
				})
				
			}
		}
	}
</script>

<style>
	page{
		background-color: #111111;
	}
	.view1{
		margin: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 148rpx;
		color: #9C69F5;
		border-radius: 20rpx;
		background-color: #272C4B;
		margin-top: 25rpx;
		font-size: 30rpx;
		
	}
	.phone{
		font-weight: 500;
		color: #FE174D;
	}
	.view{
		border-radius: 20rpx;
		margin: 20rpx;
		background-color: #272C4B;
		margin-top: 15rpx;
		padding: 23rpx 40rpx;
	}
	.view>view{
		color: #9C69F5;
		font-size: 25rpx;
	}
	.view>view>:nth-child(1){
		font-size: 30rpx;
		color: #9C69F5;
		margin-right: 7rpx;
	}
	.view>text{
		display: block;
		color: #9C69F5;
		font-size: 30rpx;
		margin-top: 30rpx;
	}
	.btns{
		background-color: #272C4B;
		color:#9C69F5;
		width: 711rpx;
		height: 88rpx;
		border-radius: 100rpx;
		margin: 100rpx auto 0;
		display: block;
		font-size: 30rpx;
		line-height: 88rpx;
		text-align: center;
	}
</style>
