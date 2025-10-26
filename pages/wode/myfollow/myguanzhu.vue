<template>
		<view class="listv row" >
			<view class="servv" >
					<view class="list row" v-for="(item,index) in list" :key="item.id" >
						<image @tap="wodegz(item)" :src="url+item.user.avatar" mode="aspectFill"></image>
						<view>
							<text class="name fontb">{{item.user.name}}</text>
							<view class="class row">
								<text class="fontb">视频数量:{{item.v}}</text>
							</view>
							
							<text class="fontc" style="font-size: 23rpx;margin-top: 5rpx;">关注日期:{{gettime(item.time,'yyyy-MM-dd hh:mm')}}</text>
						</view>
						<text @tap.stop.prevent="deletes(item,index)" class="btn">取消关注</text>
					</view>
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
		    setTimeout(function () {  
		        
		    }, 1000);  
		   uni.startPullDownRefresh();  
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
				let sign = this.md5(this.user.token);
				this.GetJson(this.ip + 'myguanzhu.php','POST',{
					token:this.user.token,
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
			wodegz(item){
				uni.navigateTo({
					url: '../../dongtai/userpage?userid='+item.user.userid +'&username='+item.user.name + '&toux='+item.user.avatar
				})
			},
			deletes(item,index){
				this.showload();
				let sign = this.md5(this.user.token+'myguanzhu');
				this.GetJson(this.ip + 'delguanzhu.php','POST',{
					sign:sign,
					token:this.user.token,
					id:item.ruserid,
					is:'remov'
				},e=>{
					
					this.hideload();
					if(this.isdata(e)){
						this.list.splice(index,1);
						this.showToast('已取消关注')
					}
					
				})
			}
			
		},
		onReachBottom() {
			if(this.load == true)this.getdata('is')

		},
			
		onPullDownRefresh() {
			this.getdata(true);
		},
		onNavigationBarButtonTap(e,index) {
			uni.showModal({
					content:'清空全部关注，是否继续？',
					success: (e) => {
						if(e.confirm){
				this.showload();
				
				let sign = this.md5(this.user.token + 'record');
				this.GetJson(this.ip + 'delsguanzhu.php','POST',{
					sign:sign,
					token:this.user.token,
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
		background-image: linear-gradient(to right ,#521fad,#7b42e0,#521fad); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.fontb{
		background-image: linear-gradient(to right ,#f93bd7,#fcd22c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.fontc{
		background-image: linear-gradient(to right ,#ff52bc,#fe6dc6,#fd49b7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.list {
		width: 750rpx;
		height: 220rpx;
		background-color: #222741;
		margin-top: 10rpx;
		border-bottom: 1rpx solid #222741;
	}

	.list>view {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.list>image {
		margin: 20rpx;
		width: 140rpx;
		height: 140rpx;
		margin-right: 22rpx;
		background-color: #EEEEEE;
		border-radius: 100rpx;
		
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
		color: #000000;
		font-weight: 500;
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
