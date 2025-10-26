<template>
	<view>
		<view v-for="item in list" :key="item.id" class="list row" @tap="listtap(item)" hover-class="click-hover" hover-stay-time="80">
			<image src="../../static/tongzhi.png" mode=""></image>
			<view class="infov">
				<text>{{item.title}}</text>
				<text>{{item.info}}</text>
			</view>
			<view class="btnv">
				<text>{{gettime(item.time,'yyyy-MM-dd')}}</text>
				<text>查看</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[]
			}
		},
		onLoad() {
			uni.getStorage({
				key:'appmsg',
				success: (res) => {
					this.list = res.data;
				}
			})
		},
		methods: {
			listtap(item){
				uni.setStorage({
					key:'appmsginfo',
					data:item,
					success() {
						uni.navigateTo({
							url:'msginfo/msginfo'
						})
						 
					}
				})
			}
		}
		
	}
</script>

<style>
	page{
		background-color: #FFFFFF;
	}
	.list{
		margin: 12rpx;
		background-color: #FFFFFF;
		border-radius: 15rpx;
		padding: 35rpx 27rpx;
		color: #454545;
	}
	.click-hover{
	background-color: #f5f5f5;
	}
	.list>image{
		width: 100rpx;
		height: 100rpx;
		margin-right: 26rpx;
	}
	.infov{
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
	}
	.infov>:nth-child(1){
		font-size: 32rpx;
		font-weight: 700;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow:ellipsis;
		width: 100%;
		margin-bottom: 12rpx;
	}
	.infov>:nth-child(2){
		font-size: 23rpx;
		color: #bab9b9;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow:ellipsis;
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
	}
	.btnv>:nth-child(1){
		font-size: 20rpx;
	}
	.btnv>:nth-child(2){
		width: 105rpx;
		height: 45rpx;
		text-align: center;
		display: block;
		line-height: 36rpx;
		border: 1rpx solid var(--maincolor);
		color: var(--maincolor);
		font-size: 22rpx;
		border-radius: 10rpx;
		margin-top: 12rpx;
	}
</style>
