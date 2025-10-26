<template>
		<view class="listv row" >
			<view class="servv" style="background-color: #1e2343;">
					<view class="list row" v-for="(item,index) in list" :key="item.id" @tap="play(item)">
						
						<image v-if="item.ptname=='1'"  src="../../../static/font/iqiyi.png" mode="aspectFill"></image>
						
						
						<image v-if="item.ptname=='2'" src="../../../static/font/qq.png" mode="aspectFill"></image>
						
						
						<image v-if="item.ptname=='3'" src="../../../static/font/youku.png" mode="aspectFill"></image>
						
						<image v-if="item.ptname=='4'" src="../../../static/font/duanju.png" mode="aspectFill"></image>
						
						<view style="display: flex;">
							<text class="name vname">{{item.title}}</text>
							<view class="class row">
								<text >上次观看时间:{{gettime(item.addtime,'yyyy-MM-dd hh:mm')}}</text>
							</view>
						</view>
						<text @tap.stop.prevent="deletes(item,index)" class="btn">删除记录</text>
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
				this.GetJson(this.ip + 'ptrecord.php','POST',{
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
			
			deletes(item,index){
				this.showload();
				let sign = this.md5(this.user.token +item.id+ 'records');
				this.GetJson(this.ip + 'delptrecord.php','POST',{
					sign:sign,
					token:this.user.token,
					id:item.id
				},e=>{
					this.hideload();
					if(this.isdata(e)){
						this.list.splice(index,1);
						this.showToast('已删除记录')
					}
					
				})
			},
			play(item){
				
				uni.navigateTo({
					url: 'jiekous?url='+item.url+'&title='+item.title
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
					content:'清空全部记录，是否继续？',
					success: (e) => {
						if(e.confirm){
				this.showload();
				
				let sign = this.md5(this.user.token + 'record');
				this.GetJson(this.ip + 'deleteptrecord.php','POST',{
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
	.font{
			background-image: linear-gradient(to right ,#5a18d1,#9B63FF);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
	}
	.fonts{
			background-image: linear-gradient(to right ,#9650bb,#9650bb);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
	}
	.vname{
		background-image: linear-gradient(to right ,#ff8870,#dea5fc);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.list {
		height: 220rpx;
		background-color: #111111;
		margin-top: 10rpx;
	}

	.list>view {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.list>image {
		margin: 20rpx;
		width: 100rpx;
		height: 100rpx;
		margin-right: 22rpx;
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
        border: 1rpx solid #5a67bc;
		border-radius: 40rpx;
		color: #5a67bc;
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
