<template>
	<view>
		<view class="list" v-for="(item,index) in list" :key="item.id" @tap="play(item)" style="margin-top:10rpx;">

			<view style="padding: 15rpx;font-size: 32rpx;font-weight: 700;color:#9B63FF;display: flex;">
				<image style="width: 100rpx;height: 100rpx;border-radius: 100rpx;top: 20rpx;"
					:src="url+item.user.avatar"></image>
				<text
					style="font-size: 32rpx;padding-top: 20rpx;padding-left: 15rpx;font-weight: 400;color: #9B63FF;">{{item.user.name}}</text>
				<view>


				</view>
				<text v-if="item.dt.money==0" style="padding-top: 20rpx;height: 20rpx;">
					<font
						style="border-radius: 20rpx; font-size: 27rpx;padding: 10rpx;color:#FFFFFF;background-color: #5fd67e;margin: 10rpx;">
						免费观看
					</font>
				</text>
				<text v-if="item.dt.money!=0" style="padding-top: 20rpx;">
					<font
						style="border-radius: 20rpx; font-size: 27rpx;padding: 10rpx;color:#FFFFFF;background-color: #fc7e7f;margin: 10rpx;">
						付费视频
					</font>
				</text>
				<text
					style="margin-left: 35rpx;margin:20rpx;color: #cbcbcd;font-size: 30rpx;font-weight: 400;">发布于:{{gettime(item.dt.addtime,'yyyy-MM-dd')}}</text>
			</view>


			<view style="margin-top: -50rpx;">
				<view style="padding-left: 110rpx;margin: 20rpx;font-size: 30rpx;color: #9B63FF;">
					{{item.dt.info}}
				</view>
			</view>

			<view>
				<image style="width: 710rpx;height: 400rpx;margin: 20rpx;border-radius: 5rpx;" :src="url+item.dt.img">
				</image>
				<!--<video id="myVideo" style="width: 100%;height:420rpx;" :autoplay="true" :muted="true" show-fullscreen-btn :src="item.video" :controls="false" direction="0" @timeupdate='timeupdate'></video>-->
			</view>


			<!--获取点赞、评论开始-->
			<view class="row"
				style="margin: 20rpx;margin-top: 15rpx;height: 80rpx;margin-top: -10rpx;margin-top: -10rpx;background-color:#262A47">

				<view style="margin:20rpx;">
					<image style="width: 40rpx;height: 40rpx;top: 10rpx;" src="../../static/font/zana.png"></image>
					<text style="font-size: 30rpx;color: #9B63FF;">{{item.dianzan}}</text>
				</view>

				<view style="margin:20rpx;">
					<image style="width: 40rpx;height: 40rpx;top: 10rpx;" src="../../static/font/sca.png"></image>
					<text style="font-size:30rpx;color: #9B63FF;">{{item.sc}}</text>
				</view>

				<view style="margin:20rpx;">
					<image style="width:40rpx;height:40rpx;top: 10rpx;" src="../../static/font/pl.png"></image>
					<text style="font-size: 30rpx;color: #9B63FF;">{{item.plnum}}</text>
				</view>

				<view style="margin:20rpx;">
					<image style="width:40rpx;height: 40rpx;top: 10rpx;" src="../../static/font/guank.png"></image>
					<text style="font-size: 30rpx;color: #9B63FF;">{{item.jilu}}</text>
				</view>

				<view style="margin:20rpx;" @tap.stop.prevent="deletes(item,index)">
					<image style="width:40rpx;height: 40rpx;top: 10rpx;" src="../../static/remov.png"></image>
					<text style="font-size: 30rpx;color: #9B63FF;">删除</text>
				</view>

			</view>

			<!--点赞、评论结束-->

			<view class="fenge"></view>
		</view>
		<null class="null" v-if="!load && list.length == 0" info="还没有内容哦!"></null>
		<load class="load" :style="{opacity:load ? '1' : '0'}"></load>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				list: [],
				load: true
			}
		},
		onLoad() {
			this.getdata();

		},
		onShow() {
			setTimeout(function() {

			}, 1000);
			uni.startPullDownRefresh();
		},
		computed: {

			user() {
				return this.$store.state.userinfo;
			},
		},
		methods: {
			getdata(is) {
				if (is === true) this.list = [];
				this.load = true;
				let sign = this.md5(this.user.token);
				this.GetJson(this.ip + 'myfollows.php', 'POST', {
					token: this.user.token,
					num: this.list.length,
					sign: sign
				}, e => {
					this.load = false;
					uni.stopPullDownRefresh();
					if (this.isdata(e)) {

						this.list = [...this.list, ...e.list];
					}
				})
			},

			deletes(item, index) {
				this.showload();
				let sign = this.md5(this.user.token + 'follows');
				this.GetJson(this.ip + 'deldt.php', 'POST', {
					sign: sign,
					token: this.user.token,
					id: item.ruserid,
					is: 'remov'
				}, e => {

					this.hideload();
					if (this.isdata(e)) {
						this.list.splice(index, 1);
						this.showToast('已删除记录')
					}

				})
			},
			play(item) {
				uni.navigateTo({
					url: 'play?id=' + item.dt.id +
						'&data=' + item +
						'&url=' + item.dt.video +
						'&img=' + item.dt.img +
						'&infos=' + item.dt.info +
						'&money=' + item.dt.money +
						'&addtime=' + item.dt.addtime +
						'&toux=' + item.user.avatar +
						'&username=' + item.user.name +
						'&v=' + item.v +
						'&userid=' + item.user.userid +
						'&gz=' + item.gz +
						'&liwu=' + item.liwus
				})
			}
		},
		onReachBottom() {
			if (this.load == true) this.getdata('is')

		},

		onPullDownRefresh() {
			this.getdata(true);
		},
		onNavigationBarButtonTap(e, index) {
			uni.showModal({
				content: '清空全部记录，是否继续？',
				success: (e) => {
					if (e.confirm) {
						this.showload();

						let sign = this.md5(this.user.token + 'follows');
						this.GetJson(this.ip + 'deletedt.php', 'POST', {
							sign: sign,
							token: this.user.token,
							is: 'remov'
						}, e => {

							this.hideload();
							if (this.isdata(e)) {
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
	page {
		background-color: #111111;
	}
</style>