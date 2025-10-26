<template>
	<view>
		<view class="hei"></view>

		<view class="souv">
			<view class="ipv" style="background-color: #151515;;">
				<text class="iconfont">&#xe620;</text>
				<input :adjust-position="false" @focus="jujiao" :focus="true" @confirm="sou" v-model="value" type="text"
					confirm-type="search" placeholder="输入短剧名称搜索..." />
			</view>
			<text class="quxiao" @tap="quxiao">取消</text>
		</view>
		<view class="view" v-if="jiaod">
			<view v-if="list.length > 0">
				<view class="titv">
					<text class="tit"
						style="color: #ff60a3;font-size: 30rpx;font-weight: 600;padding-top: 15rpx;">历史搜索</text>
					<image @tap="remov" src="../../static/remov.png" mode=""></image>
				</view>
				<view>
					<text @tap="sous(item)" class="soubtn" v-for="item in list">{{item}}</text>
				</view>
			</view>
		</view>

		<view style="margin-top:130rpx;">
			<view class="list" v-for="(item,index) in infolist" :key="index.id" @tap="play(item.vod_id,0)">
				<view class="row">
					<view style="width: 200rpx;">
						<image class="image" :src="item.vod_pic" mode="aspectFill" style="margin-left: 20rpx;"></image>
					</view>
					<view style="margin-top: 20rpx;padding:0 40rpx">
						<text class="font vname">{{item.vod_name}}</text>
						<view class="vodinfo" style="color: #FFF;font-size:28rpx ;">{{item.text}}
						</view>
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
				jiaod: true,
				list: [],
				rlist: [],
				value: '',
				infolist: [],
				load: false
			}
		},
		onLoad(item) {
			this.type = item.type;
			plus.navigator.closeSplashscreen()
			uni.getStorage({
				key: 'soulist',
				success: (e) => {
					this.rlist = e.data;
					console.log(e)
				}
			})
			uni.getStorage({
				key: 'soudata',
				success: (e) => {
					this.list = e.data;
				}
			})
		},
		methods: {
			sous(item) {
				this.value = item;
				this.sou();
			},
			jujiao() {
				this.jiaod = true;
			},
			sou() {
				if (this.value != '') {
					this.newlishi(this.value);
					this.jiaod = false;
					this.getdata(true);
				} else {
					this.showToast('请输入搜索的内容');
				}
			},
			newlishi(info) { //写入历史记录
				let ind = this.list.indexOf(info);
				if (ind !== -1) this.list.splice(ind, 1);
				this.list.unshift(info);
				uni.setStorage({
					key: 'soudata',
					data: this.list
				})
			},
			remov() {
				uni.showModal({
					content: '是否清除搜索历史',
					success: (e) => {
						if (e.confirm) {
							this.list = [];
							uni.removeStorage({
								key: 'soudata'
							})
						}
					}
				})
			},
			getdata(is) {
				if (is) this.infolist = [];
				this.load = true;
				let sign = this.md5(this.value + this.$store.state.userinfo.token);
				this.GetJson(this.ip + 'Duanju_api.php', 'POST', {
					info: this.value,
					num: this.infolist.length,
					token: this.$store.state.userinfo.token,
					sign: sign,
					type: 'sou'
				}, e => {
					this.load = false;
					console.log(e);
					if (this.isdata(e)) {
						this.infolist = [...this.infolist, ...e.list];
					}
				})
			},
			setinfo(info) {
				let info2 = info.substr(info.indexOf(this.value), info.length);
				info2 = info2.replace(new RegExp(this.value, 'g'), "<font style='color:#ff85a3'>" + this.value + '</font>')
				return info2
			},
			newinfo(item) {
				this.$store.state.newinfo = JSON.parse(JSON.stringify(item));
				uni.navigateTo({
					url: '../info/info'
				})
			},
			quxiao() {
				if (this.infolist.length == 0 || !this.jiaod) {
					uni.navigateBack({
						animationType: 'fade-out'
					})
				} else {
					this.jiaod = false;
				}
			},
			play(id,index) {
				uni.navigateTo({
					url: 'play?id=' + id + '&courseDetailsId=0'
				})
			},
		},
		onReachBottom() {
			if (!this.load) this.getdata();
		}
	}
</script>
<style>
	page {
		
	}

	.font {
		font-size: 40rpx;
		background-image: linear-gradient(to right, #f93bd7, #FE82E3, #FC5A8B);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.vodinfo {
		color: #000000;
		font-size: 23rpx;
		display: block;
		margin-top: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		opacity: .7;
	}

	.list {
		border-radius: 25rpx;
		position: relative;
		width: 700rpx;
		margin-bottom: 30rpx;
		animation: opacitys .1s;
	}

	.tag {
		display: inline-block;
		width: auto;
		text-align: center;
		min-width: 20rpx;
		height: 40rpx;
		line-height: 40rpx;
		padding: 0 10rpx;
		font-size: 28rpx;
		color: #ffffff;
		background-image: linear-gradient(to right, #d71af9, #f9c71a);
		border-radius: 20rpx;
		position: absolute;
		top: 10rpx;
		left: 70%;
		z-index: 1;
	}

	.image {
		border-radius: 20rpx;
		width: 180rpx;
		height: 220rpx;
		border-radius: 8rpx;
	}

	.tagtag {
		color: #5764b5;
		font-weight: 800;
		font-size: 30rpx;
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

	.hot {
		margin: 20rpx;
		font-size: 25rpx;
		line-height: 70rpx;
		padding: 3rpx 8rpx;
		border-radius: 10rpx;
		background-image: linear-gradient(to right, #d71af9, #f9c71a);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-top: 10rpx;
	}

	.times {
		margin: 5rpx;
		float: right;
		font-size: 28rpx;
		background-image: linear-gradient(to right, #d71af9, #f9c71a);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		line-height: 70rpx;
	}

	.null {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
	}

	.mianfei {
		display: inline-block;
		width: auto;
		text-align: center;
		min-width: 20rpx;
		height: 40rpx;
		line-height: 40rpx;
		padding: 0 10rpx;
		font-size: 28rpx;
		color: #d1b8fe;
		background-image: linear-gradient(to right, #9B63FF, #5a18d1);
		border-radius: 20rpx;
		position: absolute;
		top: 10rpx;
		left: 60%;
		z-index: 1;
	}

	.shoufei {
		display: inline-block;
		width: auto;
		text-align: center;
		min-width: 20rpx;
		height: 40rpx;
		line-height: 40rpx;
		padding: 0 10rpx;
		font-size: 28rpx;
		color: #ffffff;
		background-image: linear-gradient(to right, #d71af9, #f9c71a);
		border-radius: 20rpx;
		position: absolute;
		top: 10rpx;
		left: 60%;
		z-index: 1;
	}


	.hei {
		height: var(--status-bar-height);
	}

	.view {
		position: fixed;
		z-index: 1;
		left: 0;
		right: 0;
		bottom: 0;
		top: calc(var(--status-bar-height) + 136rpx);
		background-color: #181818;
		padding: 30rpx;
	}

	.souv {
		background-color: #111111;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		z-index: 2;
		padding: 30rpx;
		padding-top: calc(var(--status-bar-height) + 30rpx);
	}

	.ipv {
		color:#545454;
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 76rpx;
		background-color: #111111;
		flex: 1;
		border-radius: 38px;
		padding: 0 30rpx;
	}

	.ipv>text {
		color: #545454;
		font-size: 32rpx;
		margin-right: 30rpx;
	}

	.ipv>input {
		color: #545454;
		display: flex;
		flex: 1;
		font-size: 25rpx;
		transition: all .3s;
	}

	.quxiao {
		color:#545454;
		font-size: 30rpx;
		display: block;
		margin-left: 30rpx;
	}

	.titv {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.titv>image {
		width: 31rpx;
		height: 33rpx;
	}

	.tit {
		color:#545454;
		display: flex;
		flex: 1;
		color: #222222;
		font-size: 27rpx;
		margin: 30rpx 0;
	}

	.tag {
		background-color: #111111;
		padding: 3rpx 8rpx;
		border-radius: 10rpx;
		font-size: 20rpx;
		color: #FFFFFF;
		margin-left: 0rpx;
		margin-top: 10rpx;
	}

	
	.soubtn {
		background: #111111;
		margin-top: 15rpx;
		border-radius: 33rpx;
		padding: 10rpx 25rpx;
		color:#545454;
		font-size: 23rpx;
		display: inline-block;
		margin-right: 15rpx;
	}

	.main {
		margin-top: calc(var(--status-bar-height) + 50rpx);
		background-color: #111111;
	}

	.shoufei {
		display: inline-block;
		width: auto;
		text-align: center;
		min-width: 20rpx;
		height: 40rpx;
		line-height: 40rpx;
		padding: 0 10rpx;
		font-size: 28rpx;
		color: #ffffff;
		background-color: #ff2600;
		border-radius: 20rpx;
		position: absolute;
		top: 400rpx;
		left: 60%;
		z-index: 1;
	}

	.null {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
	}
</style>