<template>
	<view v-if="account != null">
		<view class="view">
			<view @tap="tap('alipay')">
				<text class="iconfont" style="color: #04B4FD;">&#xe60c;</text>
				<text>{{account.alipay == null ? '未设置' : card('alipay')}}</text>
				<text class="iconfont">&#xe625;</text>
			</view>
			<view @tap="tap('weixin')">
				<text class="iconfont" style="color: #26C446;">&#xe608;</text>
				<text>{{account.weixin == null ? '未设置' : card('weixin')}}</text>
				<text class="iconfont">&#xe625;</text>
			</view>
		</view>
		<text class="info">提示：请填写个人真实支付宝账户，和姓名。若账户与姓名不一致，可能会拒绝您的提现，请务必仔细填写。若要使用微信提现，请绑定您的微信号，平台会添加您为好友进行转账。为了方便、快捷到账，建议使用是支付宝提现，谢谢合作。</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				get:false
			}
		},
		computed:{
			account(){
				return this.$store.state.account;
			},
			card(){
				return item =>{
					return JSON.parse(this.account[item]).card;
				}
			}
		},
		onLoad(es) {
			
			if(es.type == 'get')this.get = true;
		},
		methods: {
			tap(type){
				if(!this.get){
					uni.setStorageSync('sercard',this.account[type]);
					uni.navigateTo({
						url:'setcard/setcard?type=' + type
					})
				}else{
					if(this.account[type] != null){
						uni.$emit('setaccounttype',type);
						uni.navigateBack();
					}else{
						uni.setStorageSync('sercard',this.account[type]);
						uni.navigateTo({
							url:'setcard/setcard?type=' + type
						})
					}
				}
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateBack();
		}
	}
</script>

<style>
	page{
		background-color: #111111;
	}
	.view{
		margin: 22rpx 18rpx;
		background-color: #151515;
		border-radius: 30rpx;
		padding: 0 16rpx;
	}
	.view>view{
		height: 149rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 26rpx;
	}
	.view>:nth-child(1){
		border-bottom: 1rpx solid #111111;
	}
	.view>view>:nth-child(1){
		font-size: 42px;
		display: flex;
		flex: 1;
	}
	.view>view{
		font-size: 29rpx;
		color: #555555;
	}
	.info{
		font-size: 23rpx;
		color: #555555;
		display: block;
		margin: 37rpx 22rpx;
	}
</style>
