<template>
	<view>
		
		<view class="list" v-for="item in list" :key="item.id">
			<text>{{gettime(item.time,'yyyy.MM.dd')}}</text>
			<view class="row v1">
				<image :src="item.vod.vod_pic"></image>
				<view>
					<text class="fontb">送出<font class="res">{{item.gift.title}}</font></text>
					<text class="fontb">视频：{{item.vod.vod_name}}</text>
				</view>
				<image :src="url + item.gift.img" mode=""></image>
			</view>
		</view>
		<load :style="{opacity:load ? '1' : '0'}"></load>
		<null class="null" v-if="!load && list.length == 0" info="您还没有送出礼物"></null>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				load:false,
				list:[]
			}
		},
		computed:{
		},
		onLoad() {
			this.getdata();
		},
		methods: {
			getdata(is){
				if(is === true)this.list = [];this.load = true;
				let sign = this.md5(this.$store.state.userinfo.token + 'giftc');
				this.GetJson(this.ip + 'usergiftrecord.php','POST',{
					token:this.$store.state.userinfo.token,
					sign:sign,
					num:this.list.length
				},e=>{
					console.log(e);
					this.load = false;
					if(this.isdata(e)){
						this.list = [...this.list,...e.list];
					}					
				})
			}
		},
		onReachBottom() {
			if(!this.load)this.getdata();
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
	.null{
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
	}
	.list{
		margin: 15rpx 14rpx 0;
		padding: 20rpx 26rpx;
		background-color: #151515;
		border-radius: 20rpx;
	}
	.list>text{
		font-size: 19rpx;
		color: #A2A1A1;
		display: block;
		margin-bottom: 19rpx;
	}
	.v1>:nth-child(1){
		width: 112rpx;
		height: 112rpx;
		border-radius: 100rpx;
		margin-right: 26rpx;
	}
	.v1>view{
		display: flex;
		flex: 1;
		flex-direction: column;
	}
	.v1>view>:nth-child(1){
		font-size: 24rpx;
		font-weight: 500;
		display: block;
		margin-bottom: 20rpx;
	}
	.v1>view>:nth-child(2){
		font-size: 24rpx;
	}
	.v1>:nth-child(3){
		width: 110rpx;
		height: 110rpx;
	}
	.res{
		color: #FF57A3;
	}
</style>
