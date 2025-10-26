<template>
	<view>
		<view class="hei"></view>
		
		<view class="souv">
			<view class="ipv">
				<text class="iconfont">&#xe620;</text>
				<input :adjust-position="false" @focus="jujiao" :focus="true" @confirm="sou" v-model="value" type="text" confirm-type="search" placeholder="输入片名或演员" />
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
			<view>
				<text class="tit" style="color: #ff60a3;font-size: 30rpx;font-weight: 600;padding-top: 15rpx;">热门搜索</text>
				<view>
					<text @tap="sous(item.title)" class="soubtn" v-for="item in rlist">{{item.title}}</text>
				</view>
			</view>
			
		</view>
		
		<view class="main">

		<view class="listv row" >
			<view class="servv" >
					<view class="list row" v-for="item in infolist" :key="item.id" @tap="play(item)">
						<image :src="item.vod_pic" mode="aspectFill"></image>
						<view>
							<text class="name">{{item.vod_name}}</text>
							<view class="class row">
								<text >分类:{{item.vod_class}}</text>
							</view>
							<view class="class row">
								<text >国家:{{item.vod_area}}</text>
							</view>
							<text style="font-size: 23rpx;color: #454545;;margin-top: 5rpx;">{{gettime(item.vod_time_add,'yyyy-MM-dd hh:mm')}}</text>
							
						</view>
					<text  class="btn">播放</text>
					</view>
						
				</view>
			</view>

	</view>

			<null class="null" v-if="!load && infolist.length == 0" info="暂未搜索到相关内容!"></null>
			<load v-if="load"></load>
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
		onLoad(item) {
			this.type = item.type;
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
					this.getdata(true);
				}else{
					this.showToast('请输入搜索的内容');
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
			getdata(is){
				if(is)this.infolist = [];
				this.load = true;
				let sign = this.md5(this.value + this.$store.state.userinfo.token);
				this.GetJson(this.ip+'Index_api.php','POST',{
					type:'sou',
					info:this.value,
					num:this.infolist.length,
					token:this.$store.state.userinfo.token,
					sign:sign,
                    vod_type:this.type
				},e=>{
					this.load = false;
					//console.log(e);
					if(this.isdata(e)){
						this.infolist = [...this.infolist, ...e.list];
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
					url: '../play/vplay?id=' + item.vod_id
				})
		  }
		},
		onReachBottom() {
			if(!this.load)this.getdata();
		}
	}
</script>
<style>
    page {
		background-color: #111111;
	}
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
		background-color: #111111;
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
		background-color: #111111;
		padding-top: calc(var(--status-bar-height) + 30rpx);
	}
	.vodinfo{
		color: #866EF9;
		font-size: 25rpx;
		display: block;
		display: flex;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		opacity: .7;
	}
	.ipv{
		color: #FFF;
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 76rpx;
		background-color: #151515;
		flex: 1;
		border-radius: 38px;
		padding: 0 30rpx;
	}
	.ipv>text{
		color: #555555;
		font-size: 32rpx;
		margin-right: 30rpx;
	}
	.ipv>input{
		color: #555555;
		display: flex;
		flex: 1;
		font-size: 25rpx;
		transition: all .3s;
	}
	.quxiao{
		color: #555555;
		font-size: 30rpx;
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
		color: #555555;
		display: flex;
		flex: 1;
		color: #222222;
		font-size: 27rpx;
		margin: 30rpx 0;
	}
	.tag {
		background-color: #555555;
		padding: 3rpx 8rpx;
		border-radius: 10rpx;
		font-size: 20rpx;
		color: #FFFFFF;
		margin-left: 0rpx;
		margin-top: 10rpx;
	}
	.tag1 {
		background-color: #555555;
		padding: 3rpx 8rpx;
		border-radius: 10rpx;
		font-size: 20rpx;
		color: #FFFFFF;
		margin-left: 10rpx;
		margin-top: 10rpx;
	}
	.soubtn{
		background: #151515;
		margin-top: 15rpx;
		border-radius: 33rpx;
		padding: 10rpx 25rpx;
		color:#555555;
		font-size: 23rpx;
		display: inline-block;
		margin-right: 15rpx;
	}
	.main{
		/*#ifdef APP-PLUS */
		margin-top: calc(var(--status-bar-height) + 50rpx);
		/*#endif */
		/*#ifdef H5 */
		margin-top: calc(var(--status-bar-height) + 100rpx);
		/*#endif */
		background-color: #111111;
	}
	
	.list {
		width:710rpx;
		margin: 20rpx;
		padding: 15rpx 20rpx;
		border-radius: 18rpx;
		background-color: #151515;
		margin-top: 10rpx;
	}

	.list>view {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.list>image {
		width: 130rpx;
		height:160rpx;
		margin-right: 22rpx;
		background-color: #EEEEEE;
		border-radius: 5rpx;
		
	}

	.title {
		font-size: 35rpx;
		font-weight: 500;
		color: #555555;
		display: block;
		margin-bottom: 10rpx;
	}

	.class {
		margin-top: 10rpx;
		font-size: 25rpx;
		color: #555555;
	}

.null{
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
	}
	.btn {
		margin: 20rpx;
		width: 155rpx;
		
		height: 70rpx;
		display: block;
        border: 1rpx solid #555555;
		border-radius: 40rpx;
		color: #555555;
		font-size: 30rpx;
		text-align: center;
		line-height: 70rpx;
	}
	.name{
		color: #999999;
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
