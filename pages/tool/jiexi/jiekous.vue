<template>
	<view>
	<view style="margin: 20rpx;border-radius: 20rpx;font-size: 35rpx;font-weight: 700;color:#fc7e7f">
		<font style="color: #000000;">即将播放:</font>{{title}}
	</view>	
	<view style="font-size: 35rpx;font-weight: 700;margin: 25rpx;">选择解析接口{{ptname}}</view>
       <view class="row list" >
		<view @tap="play(item)" class="border" v-for="(item,index) in list" :key="item.id" >
		<text style="font-size: 22;padding: 20rpx;">{{item.name}}</text>
		</view>
		</view>			
					
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				list:[],
				src: '',
				title:'',
				ptname:''
			}
		},
		onLoad(item) {
			this.GetJson(this.ip + 'setapp.php','GET',{},e=>{
			this.list = e.jxlist;
			})
			this.src = item.url;
			this.title = item.title;
		},
		onReady() {
			
		},
		methods: {
			play(item){
				uni.navigateTo({
				      url: 'plays?jxurl='+item.url + '&url='+this.src
				 });
			},
		}
	}
	
</script>

<style>
	.list{
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.list>view{
		position: relative;
		background-color: #fd89b7;
		width: 210rpx;
		margin-bottom: 30rpx;
		animation: opacitys .1s;
	}
	.border{
		margin: 20rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius:5rpx;
		color:#ffffff;
		margin-top: 10rpx;
	}

</style>
