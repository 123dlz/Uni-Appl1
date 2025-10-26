<template>
	<view>
		<view
			style="background-color: #111111;;height:450rpx;width: 750rpx;position: fixed;left: 0;right: 0;top: 0;z-index: 2;">
			<text
				style="font-size: 40rpx;font-weight: 700;margin: 100rpx;line-height: 250rpx;color:#555555">{{username}}的视频主页</text>
		</view>

		<view style="margin-top: 160rpx;width: 750rpx;position: fixed;left: 0;right: 0;top: 0;z-index: 2;">
			<view class="views row">
				<image style="width: 180rpx;height:180rpx;border-radius: 100rpx;top: 2rpx;margin: 20rpx;"
					:src="url+toux"></image>
				<view class="hengv">
					<text style="font-size: 32rpx;color: #9B63FF">{{gznum}}</text>
					<text style="color: #797979">粉丝</text>
				</view>

				<view class="hengv">
					<text style="font-size: 32rpx;color: #9B63FF">{{dznum}}</text>
					<text style="color: #797979">获赞</text>
				</view>
				<view class="hengv">
					<text style="font-size: 32rpx;color: #9B63FF">{{scnum}}</text>
					<text style="color: #797979">收藏</text>
				</view>
				<view class="hengv">
					<text style="font-size: 32rpx;color: #9B63FF">{{plnum}}</text>
					<text style="color: #797979">评论</text>
				</view>
			</view>
		</view>

		<view class="listv row" style="margin-top: 470rpx;">
			<view class="servv">
				<view class="list row" v-for="item in list" :key="item.id" @tap="play(item)">
					<image :src="url+item.img" mode="aspectFill"></image>
					<view>
						<text class="name">{{item.info}}</text>
						<view class="class row">
							<text style="font-size: 25rpx;color: #0fdc27;" v-if="item.money==0">免费观看</text>
							<text style="font-size: 25rpx;color: #fb7b0a;" v-if="item.money!=0">付费观看</text>
						</view>
						<view class="ropw">
						<text style="font-size: 23rpx;color: #555555;;margin-top: 5rpx;">{{gettime(item.addtime,'yyyy-MM-dd')}}</text>
						<text style="font-size: 23rpx;color: #555555;;margin-top: 5rpx;margin-left: 20rpx">{{item.hot}}次观看 </text>
						</view>
					</view>
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
				userid: '',
				userame: '',
				toux: '',
				v: '',
				gz: '',
				load: true,
				list: [],
				plnum: '',
				dznum: '',
				scnum: '',
				vnum: '',
				gznum: ''
			}
		},
		computed: {

			vip() {
				return this.$store.state.vip.vip;
			},
			user() {
				return this.$store.state.userinfo;
			}
		},
		onUnload() {

		},
		onLoad(item) {

			this.toux = item.toux
			this.userid = item.userid
			this.username = item.username
			uni.getStorage({
				key: 'maindata',
				success: (e) => {
					this.list = e.data.list;
					this.$nextTick(function() {
						plus.navigator.closeSplashscreen();
					})
				}
			})
			this.GetJson(this.ip + 'userpage.php', 'POST', {
				userid: this.userid
			}, e => {
				this.list = e.list;
				this.plnum = e.plnum
				this.dznum = e.dznum
				this.scnum = e.scnum
				this.vnum = e.vnum
				this.gznum = e.gznum
				uni.stopPullDownRefresh();
				if (!plus.navigator.hasSplashscreen()) plus.navigator.closeSplashscreen();
				uni.setStorage({
					key: 'maindata',
					data: e
				})
			})
		},
		onReady() {

			let json = this.$store.state.follows;
			for (let i in json) {
				if (json[i].ruserid == this.id) {
					this.isfollows = true;
					break;
				}
			}
			let jsons = this.$store.state.followss;
			for (let s in jsons) {
				if (jsons[s].ruserid == this.userid) {
					this.isfollowss = true;
					break;
				}
			}
		},
		methods: {
			play(item) {
				uni.navigateTo({
					url: 'play?id=' + item.id +
						'&data=' + item +
						'&url=' + item.video +
						'&img=' + item.img +
						'&infos=' + item.info +
						'&money=' + item.money +
						'&addtime=' + item.addtime +
						'&toux=' + item.user.avatar +
						'&username=' + item.user.name +
						'&v=' + item.v +
						'&userid=' + item.user.userid +
						'&gz=' + item.gz
				})
		}
		
	},
	onPullDownRefresh() {
		this.getdata(true);
	}
	}
</script>


<style>
	page {
		background-color: #111111;
	}

	.views {
		margin: 20rpx;
		background-color: #151515;
		border-radius: 20rpx;
		margin-top: 15rpx;
		padding: 20rpx 0;
		justify-content: space-around;
	}

	.hengv {
		text-align: center;
	}

	.hengv>text:nth-child(1) {
		font-size: 24rpx;
		font-weight: bold;
		color: #000000;
		display: block;
	}

	.hengv>text:nth-child(2) {
		color: #504F4F;
		font-size: 24rpx;
	}

	.list {
		width: 710rpx;
		margin: 20rpx;
		padding: 15rpx 20rpx;
		border-radius: 18rpx;
		background:#171717;
		margin-top: 10rpx;
	}

	.list>view {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.list>image {
		width: 200rpx;
		height: 140rpx;
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

	.null {
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
		border: 1rpx solid #866EF9;
		border-radius: 40rpx;
		color: #866EF9;
		font-size: 30rpx;
		text-align: center;
		line-height: 70rpx;
	}

	.name {
		color: #555555;
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

	.info {
		min-width: 300rpx;
		min-height: 100rpx;
		margin: 10rpx;
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
		opacity: .5;
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
		color: #ffffff;
		background-color: #2bdf9d;
		border-radius: 20rpx;
		position: absolute;
		top: 10rpx;
		left: 60%;
		z-index: 2;
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
		top: 10rpx;
		left: 60%;
		z-index: 2;
	}
</style>