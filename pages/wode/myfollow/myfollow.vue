<template>
	<view>
		<view style="margin-top:40rpx;">
			<view class="listv row">
				<view class="list" v-for="(item,index) in list" :key="index" @tap="play(item,1)">
					<image :src="item.vod.vod_pic" mode="aspectFill"></image>
					<view style="margin: 10rpx;">
						<text class="vodname font">{{item.vod.vod_name}}</text>
						<view style="margin-top: 20rpx;"></view>
					</view>
					<view style="margin-top: 5rpx;">
						<text class="yanyuan">{{item.vod.vod_actor==''?'暂无演员信息':item.vod.vod_actor}}</text>
					</view>
					
					<view style="margin-top: 5rpx;width: 230rpx;height:60rpx;background-color:#151515;" @tap.stop.prevent="quxiao(item,index)">
				   <text class="hot" >取消收藏</text>
				</view>
				</view>
			</view>
		</view>
		<null class="null" v-if="!load && list.length == 0" info="还没有收藏影片!"></null>
		<load class="load" :style="{opacity:load ? '1' : '0'}"></load>
		
		
</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				load:true
			}
		},
		onLoad() {		
	    this.getdata();
			
		},
		onShow() {
		   
		},
		computed: {
			user(){
				return this.$store.state.userinfo;
			},
		},
		methods: {
			getdata(is){
				if(is === true)this.list = [];
				this.load = true;
				let sign = this.md5(this.$store.state.userinfo.token);
				this.GetJson(this.ip + 'myfollow.php','POST',{
					token:this.$store.state.userinfo.token,
					num:this.list.length,
					sign:sign
				},e=>{
					this.load = false;
					uni.stopPullDownRefresh();
					if(this.isdata(e)){
						this.list = [...this.list,...e.list];
					}					
				})
			},			
			
			quxiao(item,index){
				this.showload();
				let sign = this.md5(this.$store.state.userinfo.token + 'isfollow' + item.ruserid);
				this.GetJson(this.ip + 'setfollow.php','POST',{
					sign:sign,
					token:this.$store.state.userinfo.token,
					id:item.ruserid,
					is:'remov'
				},e=>{
					this.hideload();
					if(this.isdata(e)){
						this.list.splice(index,1);
						this.$store.state.follow.splice(index,1);
						this.showToast('已取消收藏')
					}
					
				})
			},
			play(item){
				if(item.type==1){
				  uni.navigateTo({
					url: '../../play/play?id=' + item.vod.vod_id})
				}else if(item.type==2){
					uni.navigateTo({
				       url: '../../play/vplay?id=' + item.vod.vod_id})
				}else{
					
				}
			}
		},
		onReachBottom() {
			if(this.load == true)this.getdata('is')

		},
			
		onPullDownRefresh() {
			this.getdata(true);
		}	
	}
</script>

<style>
	page{
	 background-color: #111111;
	}
	.fonta {
		background-image: linear-gradient(to right, #521fad, #7b42e0, #521fad);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	
	.fontb {
		background-image: linear-gradient(to right, #7b42e0, #7b42e0);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	
	.fonts {
	    background-image: linear-gradient(to right, #FE6191,#FB6794, #F98DAD);
	    -webkit-background-clip: text;
	    -webkit-text-fill-color: transparent;
	}
	
	.fontc {
		background-image: linear-gradient(to right, #6b45aa, #7649c0, #6b45aa);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	
	.font {
	    background-image: linear-gradient(to right, #f93bd7, #FE82E3, #FC5A8B);
	    -webkit-background-clip: text;
	    -webkit-text-fill-color: transparent;
	}
	.listv {
		flex-wrap: wrap;
		margin: 20rpx;
		margin-left: -1rpx;
	}
	
	.list {
		margin-left: 15rpx;
		border-radius: 5rpx;
		box-shadow: 10rpx 10rpx 8rpx 4rpx rgba(0, 0, 0, 0.05);
		position: relative;
		background-color: #121212;
		width: 230rpx;
		margin-bottom: 20rpx;
		animation: opacitys .1s;
	}
	
	.list>image {
		width: 230rpx;
		height: 300rpx;
		border-radius: 8rpx 8rpx 0 0;
		box-shadow: 2px 6px 6px rgba(0, 0, 0, .3);
		background-color: #080808;
	}
	
	.list>view>image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 100px;
		margin-right: 10rpx;
		background-color: #151515;
	}
	
	.vodname {
		color: #000000;
		font-weight: 500;
		font-size: 28rpx;
		display: block;
		margin-top: 10rpx;
		display: flex;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		opacity: .7;
	}
	
	.yanyuan {
		margin: 10rpx;
		color: #495189;
		font-weight: 400;
		font-size: 26rpx;
		display: block;
		margin-top: -15rpx;
		display: flex;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		opacity: .7;
	}
	
	.hot {
		padding-left: 70rpx;
		padding-top: 30rpx;
		font-size: 25rpx;
		border-radius: 10rpx;
		color: #555555;
	}
	
	.times {
		margin: 5rpx;
		float: right;
		font-size: 28rpx;
		color: pink;
		line-height: 70rpx;
	}
	
	.null {
		position: absolute;
		top: 70%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
	}
</style>
