<template>
	<view>
		<view class="view">
			<view class="v1 row">
				<text class="title fontb">提现账户</text>
				<view @tap="getcard" class="row">
					<text class="anul fontc" v-if="account == null">请选择提现账户</text>
					<text v-if="account == 'alipay'" class="iconfont payicon" style="color: #04B4FD;">&#xe60c;</text>
					<text v-if="account == 'weixin'" class="iconfont payicon" style="color: #26C446;">&#xe608;</text>
					<text class="iconfont jiant fonta">&#xe625;</text>
				</view>
			</view>
			<view class="v2">
				<text class="title fontb">提现金额</text>
				<view class="row">
					<text style="color: #FFFFFF;">¥</text>
					<input style="color: #F5C71F;" type="number" v-model="money" maxlength="5" />
					<text class="fontc" @tap="quanbu">全部提现</text>
				</view>
				<text class="ketix fontb">可提现金额：<font style="color: #FC3580;">¥{{parseFloat($store.state.userinfo.money).toFixed(2)}}</font></text>
				
			</view>
		</view>
		
		<view class="btns" @tap="btns">提交申请</view>
		
		<text class="info info1 fontb">提现说明</text>
		<text class="info fonta">1.提现最小额度为{{config[0]}}元，最大额度为{{config[1]}}元\n2.每日提现次数为1次\n3.提交申请后，预计24小时内到账，如遇高峰期或节假日可能会顺延，请耐心等待，或者可以联系客服。</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				account:null,
				money:''
			}
		},
		computed:{
			config(){
				return this.$store.state.config == null ? [] : JSON.parse(this.$store.state.config.Withdrawal);
			}
		},
		onLoad() {
			plus.navigator.closeSplashscreen();
			uni.$on('setaccounttype',e=>{
				this.account = e;
			})
		},
		onUnload() {
			uni.$off('setaccounttype');
		},
		methods: {
			getcard(){
				uni.navigateTo({
					url:'../account/account?type=get'
				})
			},
			quanbu(){
				this.money = this.$store.state.userinfo.money;
			},
			btns(){
				if(this.account == null){
					this.showToast('请选择提现账户');
				}else if(this.money == ''){
					this.showToast('请输入提现金额');
				}else if(Number(this.money < this.config[0] || Number(this.money) > this.config[1])){
					this.showToast('提现最小额度为' + this.config[0] + '元，最大额度为' + this.config[1] + '元');
				}else if(Number(this.money) > Number(this.$store.state.userinfo.money)){
					this.showToast('账户余额不足');
				}else{
					this.showload();
					let sign = this.md5(this.$store.state.userinfo.token + this.money + this.account);
					this.GetJson(this.ip + 'userwithdrawal.php','POST',{
						sign:sign,
						token:this.$store.state.userinfo.token,
						money:this.money,
						account:this.account
					},e=>{
						this.hideload();
						if(this.isdata(e)){
							//this.showToast('申请提交成功！');
							this.$store.state.userinfo.money = e.money;
							uni.navigateTo({
								url:'ok/ok?account=' + this.account + '&money=' + this.money
							})
						}
					})
				}
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url:'../account/account'
			})
		}
	}
</script>

<style>
	page{
	 background-color: #111111;
	}
	.fonta{
		color: #555555;
	}
	.fontb{
		color: #555555;
	}
	.fontc{
		color: #555555;
	}
	.view{
		margin: 20rpx;
		border-radius: 20rpx;
		background-color: #151515;
		margin-top: 15rpx;
		padding: 0 35rpx;
	}
	.v1{
		padding: 40rpx 0;
		border-bottom: 1rpx solid #222741;
	}
	.title{
		font-size: 29rpx;
		display: flex;
		flex: 1;
	}
	.anul{
		font-size: 29rpx;
		color: #888686;
	}
	.payicon{
		font-size: 32px;
	}
	.v2{
		padding: 44rpx 0;
	}
	.v2>view{
		margin-top: 60rpx;
	}
	.v2>view>input{
		display: flex;
		flex: 1;
		font-size: 44rpx;
		font-weight: bold;
	}
	.v2>view>:nth-child(1){
		font-size: 34rpx;
		font-weight: bold;
		margin-right: 10rpx;
		display: block;
	}
	.v2>view>:nth-child(3){
		font-size: 29rpx;
	}
	.ketix{
		margin-top: 28rpx;
		display: block;
		font-size: 29rpx;
		color: #6A6A6A;
	}
	.btns{
		margin: 72rpx auto 48rpx;
		width: 700rpx;
		height: 87rpx;
		background-image: linear-gradient(to right ,#000000,#050505,#090909);
		border-radius: 20rpx;
		font-size: 34rpx;
		color: #FFFFFF;
		display: block;
		text-align: center;
		line-height: 87rpx;
	}
	.info{
		font-size: 24rpx;
		color: #666565;
		display: block;
		margin: 0 36rpx;
	}
	.info1{
		font-size: 34rpx;
		margin-top: 38rpx;
		margin-bottom: 20rpx;
	}
</style>
