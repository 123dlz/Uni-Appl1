<template>
<view>
	
	<view style="background-color: #111111;height:450rpx;width: 750rpx;position: fixed;left: 0;right: 0;top: 0;z-index: 2;">
		<text style="font-size: 40rpx;font-weight: 700;margin: 100rpx;line-height: 250rpx;color: #555555;">我发布的视频</text>
	</view>
	
	<view style="margin-top: 160rpx;width: 750rpx;position: fixed;left: 0;right: 0;top: 0;z-index: 2;">
	<view class="views row" >
		<image style="width: 180rpx;height:180rpx;border-radius: 100rpx;top: 2rpx;margin: 20rpx;" :src="url+$store.state.userinfo.avatar"></image>
		<view class="hengv" > 
			<text class="font" style="font-size: 32rpx;color: hotpink;">{{gznum}}</text>
			<text class="font">粉丝</text>
		</view>

		<view  class="hengv" >
			<text class="font" style="font-size: 32rpx;color: hotpink;">{{dznum==''||dznum==null ?'0':dznum}}</text>
			<text class="font">获赞</text>
		</view>
		<view  class="hengv">
			<text class="font" style="font-size: 32rpx;color: hotpink;">{{scnum}}</text>
			<text class="font">收藏</text>
		</view>
		<view  class="hengv">
			<text class="font" style="font-size: 32rpx;color: hotpink;">{{plnum}}</text>
			<text class="font" style="color: #797979">评论</text>
		</view>
	</view>	
	</view>	
<view style="margin-top: 470rpx;">
		<view class="list row" v-for="item in list" :key="item.id" @tap="play(item)">
		<view   class="avatarvs"> 
		<image  :src="url+item.img" mode="aspectFill"></image>
		</view>
			<view class="infov" style="margin-left: 10rpx;">
				<view >
					<view class="row" style="color: #555555;font-size: 28rpx;width:370rpx;">
						<text class="info font" >{{item.info}}</text>
					</view>
					<view class="row" style="color: #444444;font-size: 28rpx;margin-left: 5rpx;">
					<text class="tag2" >发布时间:{{gettime(item.addtime,'yyyy-MM-dd')}}</text>
				    </view>
			</view>
			</view>
			<view class="btnv">
				<view>
					<text style="font-size: 25rpx;color: #F83D7B;" v-if="item.money==0">免费观看</text>
					<text style="font-size: 25rpx;color: #fb7b0a;" v-if="item.money!=0">付费观看</text>
				</view>
			</view>
			
		   </view>
		<view v-if="list==null || list==''" class="font" style="margin-top: 300rpx;text-align: center;">您还没有发布过视频</view>	
	</view>
			
</view>
</template>

<script>
	export default {
		data() {
			return {
				userid:'',
				userame:'',
				toux:'',
				v:'',
				gz:'',
				load:true,
				list:[],
				plnum:'',
				dznum:'',
				scnum:'',
				vnum:'',
				gznum:''
				}
		},
		computed: {

			vip(){
				return this.$store.state.vip.vip;
			},	
		},
		onUnload() {

		},
		onLoad(item){
			 this.toux=item.toux
			 this.userid = item.userid
			 this.username = item.username
			 uni.getStorage({
			 	key:'maindata',
			 	success: (e) => {
			 		this.list = e.data.list;
			 		this.$nextTick(function(){
			 			plus.navigator.closeSplashscreen();
			 		})
			 	}  
			 })
				this.GetJson(this.ip + 'userpage.php', 'POST', {userid:this.$store.state.userinfo.userid}, e => {
					this.list = e.list;
					this.plnum=e.plnum
					this.dznum=e.dznum
					this.scnum=e.scnum
					this.vnum=e.vnum
					this.gznum=e.gznum
					uni.stopPullDownRefresh();
					if(!plus.navigator.hasSplashscreen())plus.navigator.closeSplashscreen();
					uni.setStorage({
						key:'maindata',
						data:e
					})
				})			 
		 },
		onReady() {
			let json = this.$store.state.follows;
			for (let i in json) {
				if(json[i].ruserid == this.id){
					this.isfollows = true;
					break;
				}
			}
			let jsons = this.$store.state.followss;
			for (let s in jsons) {
				if(jsons[s].ruserid == this.userid){
					this.isfollowss = true;
					break;
				}
			}			
		},
		methods: {
			play(item){
				uni.navigateTo({
				url: '../dongtai/play?id='+item.id
				+'&data='+ item 
				+'&url='+ item.video 
				+ '&img='+item.img
				+'&infos=' + item.info 
				+ '&money='+item.money
				+ '&addtime='+item.addtime 
				+'&toux='+item.user.avatar
				+'&username='+item.user.name
				+'&v='+item.v
				+'&userid='+item.user.userid
				+'&gz='+item.gz
				})
						
		  },

		onPageScroll(e) {
			if (e.scrollTop < 0) (this.scale = 1 + Math.abs(e.scrollTop) / 100).toFixed(1);
		}
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
	.font{
		color:#555555;
	}
	.views{
		margin: 20rpx;
		background: rgba(255,255,255,0.1);
		border-radius: 20rpx;
		margin-top: 15rpx;
		padding: 20rpx 0;
		justify-content: space-around;
	}
	.hengv{
		text-align: center;
	}
	.hengv>text:nth-child(1){
		font-size: 24rpx;
		font-weight: bold;
		color: #000000;
		display: block;
	}
	.hengv>text:nth-child(2){
		color: #504F4F;
		font-size: 24rpx;
	}

	.list{
		margin: 20rpx;
		border-radius: 10rpx;
		padding: 35rpx 30rpx;
		margin-top: 20rpx; 
		position: relative;
		animation: opacitys 1s;
		background:#171717;
		box-shadow: 0rpx 5rpx 5rpx 0rpx rgba(0, 0, 0, 0.01);
	}
	.btnv{
		margin-top: -20rpx;
		background: #111111;
		padding:30rpx 20rpx;
		font-weight: 500;
		display: block;
		font-size: 17rpx;
		color: #0ebe86;
		text-align: center;
		position: absolute;
		right: 0rpx;
		top: 90rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.avatarvs{
		margin-top:5rpx;
	}
	.avatarvs>image{ 
		top:-10rpx;
		right: 5rpx;
		width: 150rpx;
		height: 150rpx;
		border-radius: 5rpx;
	}
	.namev>text{
		margin-top: 2rpx;
		font-weight: 700;
		font-size: 30rpx;
	}
	.userv{
		text-align: center;
		margin-right: 30rpx;
	}
	.userv>image{
		width: 100rpx;
		height: 100rpx;
		display: block;
		border-radius: 10rpx;
	} 
	.userv>text{
		font-size: 12px;
	}
	.infov{
		display: flex;
		flex: 1;
		flex-direction: column;
	}
	.infov>:nth-child(1){
			font-weight: 500;
		font-size: 14px;
		display: block;
		margin-bottom: 20rpx;
	}
	.infov>:nth-child(2){
	
		font-size: 13px;
		color: #827E80;
	}
	.list>text{
		font-size: 17px;
		color: var(--maincolor);
	}
	.info{
		margin: 10rpx;
		font-weight: 500;
		font-size: 28rpx;
		display: block;
		display: flex;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		opacity: .5;
	}

</style>
