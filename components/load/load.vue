<template>
	<view class="conn row">
		<image src="../../static/load.gif" mode=""></image>
		<text>加载中，请稍等...</text>
	</view>
</template>

<script>
	export default {
		name:"load",
		data() {
			return {
				
			};
		}
	}
</script>

<style>
	.conn{
		padding: 30rpx;
		width: 750rpx;
		justify-content: center;
		opacity: 1;
		transition: opacity .3s;
	}
	.conn>image{
		width: 40rpx;
		height: 40rpx;
		display: block;
		margin-right: 6rpx;
	}
	.conn>text{
		background-image: linear-gradient(to right ,#9B63FF,#9B63FF);
		 -webkit-background-clip: text; 
		 -webkit-text-fill-color: transparent;
		font-size: 29rpx;
		opacity: .8;
	}
</style>
