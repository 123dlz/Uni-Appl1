<template>
	<view class="vinull">
		<text style="color: #333333;font-size: 150rpx;" class="iconfont">&#xe760;</text>
		<text>{{info}}</text>
	</view>
</template>

<script>
	export default {
		props:['info'],
		name:"null",
		data() {
			return {
				
			};
		}
	}
</script>

<style>
	
	.vinull{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.vinull>image{
		width: 400rpx;
		height: 200rpx;
	}
	.vinull>text{
		display: block;
		color: #333333;
		font-size: 22rpx;
		margin-top: 20rpx;
		transform: translateX(10rpx);
	}
</style>
