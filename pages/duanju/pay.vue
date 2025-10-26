<template>
	<view>
		<view style="margin-top:30rpx;">
			<view>
				<view class="row" style="padding: 20rpx 20rpx;">
					<view style="min-width: 220rpx;">
						<image class="lbpic" :src="url + data.img" mode="aspectFill"></image>
					</view>
					<view style="padding: 0 20rpx;margin-top: -5px;">
						<view class="row">
							<text
								style="background-color:hotpink;padding:6rpx 12rpx;color:#FFF;border-radius: 8rpx;font-size:28rpx">{{data.class}}</text>
							<text class="lbvodname"
								style="color:#FFF;font-weight: 700;font-size: 40rpx;padding: 0 15rpx;padding-top: -10rpx;">{{data.name}}</text>
						</view>
						<text class="lbblurb" style="color:#959595;font-size:28rpx;">{{data.info}}</text>
						<view class="row" style="margin-top: 10rpx;">
							<text style="color:#707070;font-size:28rpx;">本月播放:{{data.num}}</text>
							<text style="color:#707070;font-size:28rpx;padding:0 20rpx">喜欢人数:{{data.follow}}</text>
						</view>
					</view>
				</view>
				<view style="margin-top: 50rpx;padding:5rpx 20rpx;width: 700rpx;margin-left: 10rpx">
					<text  style="color: #FFF;font-size: 32rpx;font-weight: 700;">购买整部短剧</text>
				</view>

			</view>
			<view class="view row">
				<input type="text" v-model="card" placeholder="请输入卡密"
					placeholder-style="font-weight: 800; color:#000;" />
			</view>
			<text class="btns " @tap="btns">确定购买</text>
		</view>

		<view>
			<text class="btns" @tap="pay_kami">购买短剧激活卡</text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				card: '',
				data: '',
				vod: ''
			}
		},
		computed: {
			user() {
				return this.$store.state.userinfo;
			}

		},
		onLoad(data) {
			this.data = data;
		},
		methods: {
			pay_kami() {
				let url = this.kamiurl
				if (plus.os.name == 'Android' || plus.os.name == 'iOS') {
					plus.runtime.openURL(url);
					return
				}
				//uni.navigateTo({url: url}) 

			},
			btns() {
				if (this.card.length == '') {
					this.showToast('请输入卡密');
				} else {
					let sign = this.md5(this.$store.state.userinfo.token + this.card + 'vip');
					this.showload('查询中...');
					this.GetJson(this.ip + 'Duanju-api.php', 'POST', {
						type: 'duanju_buy',
						token: this.$store.state.userinfo.token,
						userid: this.$store.state.userinfo.userid,
						sign: sign,
						card: this.card,
						id: this.data.id,
						vod_index: this.data.index,
						state: this.data.state
					}, e => {
						this.hideload();
						console.log(e);
						switch (e.code) {
							case 404:
								this.showToast(e.msg);
								break;
							case 403:
								this.showToast(e.msg);
								break;
							case 201:
								this.showToast(e.msg);
								break;
							case 200:
								this.showToast(e.msg);
								uni.$emit('back', {
									flag: true,
									id: this.data.id,
									index: this.data.index
								});
								this.$store.state.jupay.unshift({
									vod_id: this.data.id,
									vod_index: this.data.index,
									state: e.state,
									time: parseInt(Date.now().toString().slice(0, -3)),
								});
								uni.navigateBack({
									animationType: 'pop-out'
								});
								break;
							default:
								break;
						}
					})
				}
			}
		},
		onReady() {

		}
	}
</script>


<style>
	page {
		width: 100%;

		background-color: #111111;
	}

	.lbblurb {
		font-size: 25rpx;
		display: block;
		margin-top: 10rpx;
		display: flex;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 5;
		-webkit-box-orient: vertical;
		opacity: .7;
	}

	.lbpic {
		border-radius: 9rpx;
		width: 200rpx;
		height: 280rpx;
	}

	.fonta {
		background-image: linear-gradient(to right, #521fad, #7b42e0, #521fad);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.fontb {
		background-image: linear-gradient(to right, #f93bd7, #fcd22c);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.fontc {
		background-image: linear-gradient(to right, #6b45aa, #7649c0, #6b45aa);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.view {
		margin-top: 160rpx;
		margin: 30rpx;
		padding: 20rpx 20rpx;
		background-color: #E8E8E8;
	}

	.view>text {
		width: 700rpx;
		color: #000;
		font-size: 35rpx;
		font-weight: 500;
		display: block;
		margin-right: 26rpx;
	}

	.view>input {
		width: 700rpx;
		font-weight: 800;
		color: #000;
		display: flex;
		flex: 1;
		font-size: 32rpx;
	}

	.view>view {
		margin: 20RPX;
		height: 53rpx;
		position: absolute;
		right: 0;
		color: #000;
		border-radius: 20rpx;
		/*border: 1rpx solid #ff2b71;*/
		font-size: 14px;

		line-height: 53rpx;
		text-align: center;
		border-radius: 100rpx;
	}

	.btns {
		margin: 40rpx auto 28rpx;
		width: 700rpx;
		height: 87rpx;
		background-color: #2E3458;
		border-radius: 20rpx;
		font-size: 34rpx;
		color: #5E6582;
		display: block;
		text-align: center;
		line-height: 87rpx;
	}
</style>