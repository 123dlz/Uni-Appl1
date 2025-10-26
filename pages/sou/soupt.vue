<template>
	<view>
		<view class="hei"></view>
		
		<view class="souv">
			<view class="ipv">
				<text class="iconfont">&#xe620;</text>
				<input :adjust-position="false" @focus="jujiao" :focus="true" @confirm="sou" v-model="value" type="text" confirm-type="search" placeholder="输入关键字" />
			</view>
			<text class="quxiao" @tap="quxiao">取消</text>
		</view>
		<view class="view" v-if="jiaod">
			<view v-if="list.length > 0">
				<view class="titv">
					<text class="tit" style="color: #ff60a3;font-size: 30rpx;font-weight: 600;padding-top: 15rpx;">历史搜索</text>
					<image @tap="remov" src="../../static/remov.png" mode=""></image>
				</view>
				<view>
					<text @tap="sous(item)" class="soubtn" v-for="item in list">{{item}}</text>
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
				jiaod:true,
				list:[],
				rlist:[],
				value:'',
				infolist:[],
				load:false
			}
		},
		onLoad() {
			plus.navigator.closeSplashscreen()
			uni.getStorage({
				key:'soulist',
				success:(e)=>{
					this.rlist = e.data;
					console.log(e)
				}
			})
			uni.getStorage({
				key:'soudata',
				success:(e)=>{
					this.list = e.data;
				}
			})
			this.GetJson(this.ip+'setapp.php', 'GET', {}, e => {
				this.pturl = e.pturl;
				})
		},
		methods: {
			sous(item){
				this.value = item;
				this.sou();
			},
			jujiao(){
				this.jiaod = true;
			},
			sou(){
				if(this.value != ''){
					this.newlishi(this.value);
					this.jiaod = false;
					uni.navigateTo({
						url: '../tool/jiexi/page?url='+this.pturl+this.value
					})
				}else{
					this.showToast('请输入搜索关键字');
				}
			},
			newlishi(info){//写入历史记录
				let ind = this.list.indexOf(info);
				if(ind !== -1)this.list.splice(ind,1);
				this.list.unshift(info);
				uni.setStorage({
					key:'soudata',
					data:this.list
				})
			},
			remov(){
				uni.showModal({
					content:'是否清除搜索历史',
					success: (e) => {
						if(e.confirm){
							this.list = [];
							uni.removeStorage({
								key:'soudata'
							})
						}
					}
				})
			},
			setinfo(info){
				let info2 = info.substr(info.indexOf(this.value),info.length);
				info2 = info2.replace(new RegExp(this.value,'g'),"<font style='color:#ff85a3'>" + this.value + '</font>')				
				return info2
			},
			newinfo(item){
				this.$store.state.newinfo = JSON.parse(JSON.stringify(item));
				uni.navigateTo({
					url:'../info/info'
				})
			},
			quxiao(){
				if(this.infolist.length == 0 || !this.jiaod){
					uni.navigateBack({
						animationType:'fade-out'
					})
				}else{
					this.jiaod = false;
				}
			},
			play(item){
				
				uni.navigateTo({
					url: '../play/play-apple?play='+ item.vod_play_url +'&playname=' + item.vod_name + '&playimg=' + item.vod_pic + '&playtime=' + item.vod_remarks + '&playclass=' + item.vod_class + '&id=' + item.vod_id
				})
			}
		},
		onReachBottom() {
			if(!this.load)this.getdata();
		}
	}
</script>

<style>

	.hei{
		height: var(--status-bar-height);
	}
	.view{
		position: fixed;
		z-index: 1;
		left: 0;
		right: 0;
		bottom: 0;
		top: calc(var(--status-bar-height) + 136rpx);
		background-color: #FFFFFF;
		padding: 30rpx;
	}
	.souv{
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		z-index: 2;
		padding: 30rpx;
		background-color: #FFFFFF;
		padding-top: calc(var(--status-bar-height) + 30rpx);
	}
	.ipv{
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 76rpx;
		background-color: #F5F5F5;
		flex: 1;
		border-radius: 38px;
		padding: 0 30rpx;
	}
	.ipv>text{
		font-size: 27rpx;
		margin-right: 30rpx;
	}
	.ipv>input{
		display: flex;
		flex: 1;
		font-size: 25rpx;
		transition: all .3s;
	}
	.quxiao{
		font-size: 25rpx;
		display: block;
		margin-left: 30rpx;
	}
	.titv{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.titv>image{
		width: 31rpx;
		height: 33rpx;
	}
	.tit{
		display: flex;
		flex: 1;
		color: #222222;
		font-size: 27rpx;
		margin: 30rpx 0;
	}
	.tag {
		background-color: #8719ee;
		padding: 3rpx 8rpx;
		border-radius: 10rpx;
		font-size: 20rpx;
		color: #FFFFFF;
		margin-left: 0rpx;
		margin-top: 10rpx;
	}
	.tag1 {
		background-color: #3476fb;
		padding: 3rpx 8rpx;
		border-radius: 10rpx;
		font-size: 20rpx;
		color: #FFFFFF;
		margin-left: 10rpx;
		margin-top: 10rpx;
	}
	.soubtn{
		background: #F5F5F5;
		margin-top: 15rpx;
		border-radius: 33rpx;
		padding: 10rpx 25rpx;
		color: #666666;
		font-size: 23rpx;
		display: inline-block;
		margin-right: 15rpx;
	}
	.main{
		margin-top: calc(var(--status-bar-height) + 50rpx);
		background-color: #FFFFFF;
	}
	
	.list {
		height: 220rpx;
		background-color: #FFFFFF;
		margin-top: 10rpx;
		border-bottom: 1rpx solid var(--fenge);
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
		background-color: #EEEEEE;
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
