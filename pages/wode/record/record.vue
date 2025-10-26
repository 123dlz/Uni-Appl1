<template>
		<view class="row" >
			<view style="background-color: #111111;">
					<view class="list row" v-for="(item,index) in list" :key="item.id" @tap="play(item)">
						<image :src="item.vod.vod_pic" mode="aspectFill"></image>
						<view>
							<text  class="name">{{item.vod.vod_name}}</text>
							<view class="class row">
								<text class="fonta">分类:{{item.vod.vod_class}}</text>
							</view>
							<text class="fonta"  style="font-size: 23rpx;margin-top: 5rpx;">上次观看时间:{{gettime(item.time,'yyyy-MM-dd hh:mm')}}</text>
						</view>
						<text  @tap.stop.prevent="deletes(item,index)" class="btn fonta">删除记录</text>
					</view>
					<load class="load" :style="{opacity:load ? '1' : '0'}"></load>
				</view>
			</view>
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
			vip(){
				return this.$store.state.vip.vip;
			}
		},
		methods: {
			getdata(is){
				if(is === true)this.list = [];
				this.load = true;
				let sign = this.md5(this.$store.state.userinfo.token);
				this.GetJson(this.ip + 'Index_api.php','POST',{
					type:'get_rec',
					token:this.$store.state.userinfo.token,
					num:this.list.length,
					sign:sign,
					types:2
				},e=>{
					console.log(e)
					this.load = false;
					uni.stopPullDownRefresh(); 
					if(this.isdata(e)){
						this.list = [...this.list,...e.list];
					}					
				})
			},			
			deletes(item,index){
				console.log(this.$store.state.userinfo.token,item.vod_id)
				uni.showModal({
						content:'是否删除？',
						success: (e) => {
							if(e.confirm){
					this.showload();
					this.showload('删除中..');
					let sign = this.md5(this.$store.state.userinfo.token + 'records');
					this.GetJson(this.ip + 'Index_api.php','POST',{
						type:'del_rec',
						sign:sign,
						token:this.$store.state.userinfo.token,
						id:item.vod_id,
						is:'remov' 
					},e=>{
						this.hideload();
						if(this.isdata(e)){
							this.list.splice(index,1);
							this.$store.state.record.splice(index,1);
							this.showToast('已删除记录')
						}
						
					    })
					  }
					}
				})
			},
			play(item){
				if(item.type==1){
					uni.navigateTo({
						url: '../../play/play?id=' + item.vod.vod_id
					})
				}
				if(item.type==2){
					uni.navigateTo({
						url: '../../play/vplay?&id=' + item.vod.vod_id
					})
				}
				
			},
			
		},
		onReachBottom() {
			this.getdata()

		},
			
		onPullDownRefresh() {
			this.getdata(true);
		},
		onNavigationBarButtonTap(e,index) {
			uni.showModal({
					content:'清空全部记录，是否继续？',
					success: (e) => {
						if(e.confirm){
				this.showload();
				let sign = this.md5(this.$store.state.userinfo.token + 'record');
				this.GetJson(this.ip + 'Index_api.php','POST',{
					type:'del_rec_all',
					sign:sign,
					token:this.$store.state.userinfo.token,
					is:'remov'
				},e=>{
					this.hideload();
					if(this.isdata(e)){
						this.list.splice(index);
						this.showToast('已全部清空')
					}
					
				})
						}
					}
				})
			
			}
	}
</script>

<style>
	page{
	 background-color: #111111;
	}
	.fonta{
		color: #858585;
	}
	
	.listv{
		padding: 15rpx 25rpx;
	}
	.list {
		height: 220rpx;
		background-color: #151515;
		margin-top: 10rpx;
	}

	.list>view {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.list>image {
		margin: 20rpx;
		width: 200rpx;
		height: 150rpx;
		margin-right: 22rpx;
		background-color:#222741;
		border-radius: 20rpx;
		
	}

	.title {
		font-size: 35rpx;
		font-weight: 500;
		color: #090909;
		display: block;
		margin-bottom: 10rpx;
	}

	.class {
		margin-top: 10rpx;
		font-size: 25rpx;
		color: #8C8989;
	}


	.btn {
		margin: 20rpx;
		width: 155rpx;
		height: 70rpx;
		display: block;
        border: 1rpx solid #fea4cf;
		border-radius: 40rpx;
		color: #fea4cf;
		font-size: 22rpx;
		text-align: center;
		line-height: 70rpx;
	}
	.name{
		color:#707688; 
		font-weight: 700;
		font-size: 30rpx;
		display: block;
		margin-top: 10rpx;
		display: flex;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		opacity: .7;
	}
</style>
