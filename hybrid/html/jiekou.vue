<template>
	<view>
	<view style="margin: 20rpx;border-radius: 20rpx;font-size: 30rpx;font-weight: 700;">
		{{title}}
	</view>	
	<view style="font-size: 30rpx;font-weight: 700;margin: 25rpx;">选择视频分类</view>
			<view class="listv row">
			<view class="list" v-for="(item,index) in jiekou" :key="item.id" >
				<view style="margin: 10rpx;"> 
				<view @tap="ts(item)"  class="yanse " :class="type == item ? 'show' : ''" >
				<text >{{item.name}}</text>
				</view>
				</view>
			</view>
			</view>
			
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				jxurl:[],
				src: '',
				title:'',
				img:''
			}
		},
		onLoad(item) {
			this.GetJson(this.ip + 'setapp.php','GET',{},e=>{
			this.jxurl = e.jxurl;
			})
			this.src = item.url;
			this.title = item.title;
			this.img = item.img;
		},
		onReady() {
			
		},
		methods: {
		}
	}
	
</script>

<style>
</style>
