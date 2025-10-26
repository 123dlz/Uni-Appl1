<template>
	<view>
		<view class="view">
			<view class="top row">
				<image src="../../../static/tongzhi.png" mode=""></image>
				<text>{{data.title}}</text>
				<text>{{gettime(data.time,'yyyy-MM-dd')}}</text>
			</view>
			<text class="info">{{data.info}}</text>
			<text class="btns" @tap="close" v-if="appmsgyd.indexOf(data.id) === -1">我已阅读</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: {},
				appmsgyd:[]
			}
		},
		onLoad() {
			uni.getStorage({
				key:'appmsginfo',
				success: (res) => {
					this.data = res.data;
				}
			})
			uni.getStorage({
				key:'appmsgyd',
				success:(res)=>{
					this.appmsgyd = res.data;
					console.log(this.appmsgyd)
				}
			})
		},
		onUnload() {
			uni.removeStorage({
				key:'appmsginfo'
			})
		},
		methods: {
			close(){
				this.appmsgyd.push(this.data.id);
				uni.setStorage({
					key:'appmsgyd',
					data:this.appmsgyd
				})
				this.$store.state.msgnum --;
				uni.navigateBack();
			}
		}
	}
</script>

<style>
	page {
		background-color: #F0F0F0;
	}

	.view {
		margin: 17rpx;
		border-radius: 15rpx;
		background-color: #FFFFFF;
		padding-bottom: 30rpx;
	}
	.top{
		padding: 27rpx;
		border-bottom: 1rpx solid var(--fenge);
	}
	.top>image{
		width: 42rpx;
		height: 42rpx;
		margin-right: 15rpx;
	}
	.top>:nth-child(2){
		font-size: 32rpx;
		font-weight: 700;
		color: #000000;
		display: flex;
		flex: 1;
	}
	.top>:nth-child(3){
		font-size: 26rpx;
		color: #0D0C0C;
	}
	.info{
		margin: 26rpx 36rpx;
		
		display: block;
		color: #0D0C0C;
		font-size: 30rpx;
	}
	.btns{
		width: 176rpx;
		height: 60rpx;
		border-radius: 100rpx;
		text-align: center;
		line-height: 60rpx;
		font-size: 23rpx;
		color: var(--maincolor);
		border: 1rpx solid var(--maincolor);
		display: block;
		margin: 60rpx 0 0;
		margin-left: calc(100% - 220rpx);
	}
</style>
