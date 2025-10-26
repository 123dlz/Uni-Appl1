<template>
	<view>
	<view style="margin-top: 20rpx;padding: 20rpx 20rpx;">
			<view class='row'  v-for='(item,index) in list' :key='index' @tap="play(item.vod.id,item.index)" >
				<view>
					<image class='vodimg'  :src='url + item.vod.img' mode='aspectFill'></image>
				</view>
				<view style="font-size: 30rpx;font-weight:700;margin-top: -15rpx;padding: 10rpx 20rpx;width: 400rpx;" > 
				  <text class="title" style="-webkit-line-clamp: 1;color:hotpink;">
					  {{item.vod.name}}
				  </text>
				  <text class="title" style="color:#ffffff">上次观看是第{{Number(item.index)}}集</text>
				  <text class="title" style="-webkit-line-clamp: 3;font-weight:400;font-size: 27rpx;color:#C5C4C4;">
				  		{{item.vod.info}}
				  </text>
				</view>
				<view @tap.stop.prevent="del(item.id,index)" style="font-size: 30rpx;padding: 0 20rpx;" >
				  <text class="title del">删除</text>
				</view>
			</view>
		</view>
		<null style="margin-top: 400rpx;" class="null" v-if="!load && list.length == 0" info="暂无相关数据!"></null>
		<load class="load" :style="{opacity:load ? '1' : '0'}"></load>
		</view>
	</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				load: true,
				list:[]
			}
		},
		computed:{
			
		},
		onLoad(data){
			this.getdata(true)
		},
		onReady() {
			
		},
		methods: {  
			getdata(is) {
				if (is === true) this.list = [];
				this.load = true;
				this.GetJson(this.ip + 'Duanju-api.php', 'POST', {
					token:this.$store.state.userinfo.token,
					type:'get_follow',
					num: this.list.length,
				}, e => {
					console.log(e)
					this.load = false;
					uni.stopPullDownRefresh();
					if (this.isdata(e)) {
						this.list = [...this.list, ...e.list];
					}
				})
			},
			play(id,index) {
				uni.navigateTo({
					url: './play?id=' + id + '&courseDetailsId=' + index
				})
			},
			del(id,index){
				console.log(id,index)
				uni.showModal({
					content:'是否删除该记录？',
					success: (e) => {
						if(e.confirm){
							this.showload();
					        this.GetJson(this.ip + 'Duanju-api.php', 'POST', {
					        	token:this.$store.state.userinfo.token,
					        	type:'del_duanju_follow',
								is:1,
					        	id:id
					        }, e => {
								this.hideload()
					        	this.list.splice(index,1);
					        	this.showToast('已删除')
					        	
					        })
						}
					}
				})
			}
		},
		onNavigationBarButtonTap(e,index) {
			uni.showModal({
					content:'清空所有追剧记录，是否继续？',
					success: (e) => {
						if(e.confirm){
							this.showload();
					        this.GetJson(this.ip + 'Duanju-api.php', 'POST', {
					        	token:this.$store.state.userinfo.token,
					        	type:'del_duanju_follow',
								is:2,
					        }, e => {
								console.log(e.msg)
								this.hideload()
					        	this.list.splice(index);
					        	this.showToast('已全部清空')
					    })
					}
				}
			})
		},
		onReachBottom() {
			if (this.load == false) this.getdata('is')
		
		},
		onPullDownRefresh() {
			this.getdata(true);
		}
	}
</script>

<style>
page{

}
.vodimg{
		padding: 0 5rpx;
    	width: 150rpx;
    	height: 180rpx;
    	border-radius: 10rpx 10rpx 10rpx 10rpx;
    }
.title {
		color: #FFF;
		display: block;
		margin-top: 10rpx;
		display: flex;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		opacity: .7;
	}
.del{
	background-color: #252525;
	border-radius: 8rpx;
	color: #999999;
	font-size: 28rpx;
	padding: 10rpx 30rpx;
}
</style>
