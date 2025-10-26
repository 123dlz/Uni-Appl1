<template>
	<view>
		<view class="view">
			<view class="v1 row">
				<image src="../../../../../static/tkok.png" mode=""></image>
				<text class="fontb">提交成功</text>
			</view>
			<view class="v2 row">
				<text class="iconfont">&#xe61d;</text>
				<text class="fontc">提交成功</text>
				<view class="fontc">------</view>
				<text class="iconfont">&#xe61d;</text>
				<text class="fontc">待审核</text>
				<view class="fontc">------</view>
				<text class="iconfont fonta" style="color: #8F8E8E;">&#xe61d;</text>
				<text class="fontc" style="color: #8F8E8E;">成功到账</text>
			</view>
		</view>
		<view class="view view2">
			<view>
				<text class="fontb">提现方式</text>
				<text class="fonta">{{account == 'alipay' ? '支付宝' : '微信'}}</text>
			</view>
			<view>
				<text class="fontb">提现金额</text>
				<text style="color: #FD359C;">{{parseFloat(money).toFixed(2)}}元</text>
			</view>
			<view>
				<text class="fontb">预计到账</text>
				<text class="fonta">24小时内</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				account:'',
				money:''
			}
		},
		onLoad(e) {
			this.account = e.account;
			this.money = e.money;
		},
		methods: {
			
		},
		onBackPress(e) {
			if(e.from != 'navigateBack'){
				uni.navigateBack({delta:2})
				return true;
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateBack({delta:2})
		}
	}
</script>

<style>
	page{
	 background-color: #111111;
	}
	.fonta{
		background-image: linear-gradient(to right ,#521fad,#7b42e0,#521fad); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.fontb{
		background-image: linear-gradient(to right ,#f93bd7,#fcd22c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.fontc{
		background-image: linear-gradient(to right ,#ff52bc,#fe6dc6,#fd49b7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.view{
		background: #222640;
		border-radius: 21rpx;
		margin: 25rpx 10rpx;
		padding: 36rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.v1>image{
		width: 88rpx;
		height: 87rpx;
		margin-right: 33rpx;
	}
	.v1>text{
		font-size: 34rpx;
		font-weight: 500;
	}
	.v2{
		justify-content: center;
		margin-top: 62rpx;
	}
	.v2>view{
		font-size: 18rpx;
		color: #52C41A;
		display: block;
		margin: 0 27rpx;
	}
	.v2 .iconfont{
		font-size:24rpx;
		color: #6CC839;
		display: block;
		margin-right: 6rpx;
	}
	.v2>text{
		font-size: 22rpx;
	}
	.view2>view{
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 24rpx;
		font-weight: 500;
		width: 80%;
		justify-content: space-between;
		margin-bottom: 28rpx;
	}
	.view2>view>:nth-child(1){
		display: block;
		color: #A3A0A0;
	}
	.view2>view>:nth-child(2){
		color: #070707;
	}
</style>
