<template>
	<!-- 顶部内容容器：所有内容都包裹在这个容器中 -->
	<view class="view-top">
		<!-- 网络状态提示 -->
		<view v-if="!isOnline" class="network-tip">
			当前无网络连接，显示离线数据
		</view>

		<!-- APP端搜索框 -->
		<!--#ifdef  APP-PLUS -->
		<view @tap="search()" class="search">
			<view class="iconfont sotext"> &#xe620; 搜索你喜欢的电影或电视剧</view>
		</view>
		<!--#endif-->

		<!-- H5端搜索框 -->
		<!--#ifdef  H5 -->
		<view @tap="search()" class="search" style="margin-top: 20rpx;">
			<view class="iconfont sotext"> &#xe620; 搜索你喜欢的电影或电视剧</view>
		</view>
		<!--#endif-->

		<!-- 顶部导航标签 -->
		<view class="nav-container">
			<scroll-view class="nav-scroll" scroll-x="true" show-scrollbar="false">
				<view class="nav-wrapper">
					<view class="nav-item" :class="{active: currentTab === 'home'}" @tap="switchTab('home')">首页</view>
					<view class="nav-item" :class="{active: currentTab === 'square'}" @tap="switchTab('square')">广场视频
					</view>
					<view class="nav-item" :class="{active: currentTab === 'tv'}" @tap="switchTab('tv')">电视剧</view>
					<view class="nav-item" :class="{active: currentTab === 'movie'}" @tap="switchTab('movie')">电影</view>
				</view>
			</scroll-view>
		</view>

		<!-- 可滑动内容区域 -->
		<scroll-view class="content-scroll" scroll-x="true" show-scrollbar="false" :scroll-with-animation="true"
			:scroll-left="scrollLeft" @scroll="onScroll" @touchstart="touchStart" @touchend="touchEnd">
			<view class="content-wrapper">
				<!-- 首页内容 -->
				<view class="content-page" :class="{active: currentTab === 'home'}">
					<!-- 轮播图组件 -->
					<swiper class="swiper" :circular="true" :indicator-dots="false" :autoplay="true" :interval="3000"
						:duration="300" v-if="data && data.lunbo && data.lunbo.length > 0">
						<swiper-item v-for="item in data.lunbo" class="swiper-item" @tap.stop.prevent="play(item,1)"
							:key="item.vod_id">
							<image :src="item.vod_pic" mode="aspectFill"></image>
							<view class="live row" style="display: flex;">
								<view class=" iconfont" style="font-size:55rpx;font-weight: 700">&#xea82;</view>
								<view style="font-size:40rpx;font-weight: 700;padding-top: -20rpx;margin-left: 15rpx;">
									{{item.vod_name}}</view>
								<view style="font-size:23rpx;font-weight: 400;margin-left: 20rpx;color:#999999;">
									{{item.vod_area}}</view>
							</view>
							<view class="live" style="top: 520rpx;">
								<view class="vinfo"
									style="font-size:23rpx;font-weight: 400;color:#999999;display: inline-block;">
									{{item.vod_blurb}}</view>
							</view>
							<view class="lunbo_bottom"></view>
						</swiper-item>
					</swiper>

					<!-- 最新电影区域 -->
					<view @tap="totab('../video/index')" style="margin-top: 60rpx;margin-left: 20rpx;font-weight: 700"
						class="row iconfont">
						<text style="color: #555555;font-size: 30rpx;">最新电影&#xe625;</text>
					</view>

					<view class="listv row" style="margin-top: 20rpx;">
						<view class="list" v-for="(item,index) in data.newvod" :key="item.vod_id" @tap="play(item,1)">
							<image :src="item.vod_pic" mode="aspectFill"></image>
							<view style="margin: 10rpx;">
								<text class="vodname">{{item.vod_name}}</text>
								<view style="margin-top: 20rpx;"></view>
							</view>
							<view style="margin-top: 5rpx;">
								<text class="yanyuan">{{item.vod_actor==''?'暂无演员信息':item.vod_actor}}</text>
							</view>
						</view>
					</view>

					<view class="null" v-if="data && data.newvod && data.newvod.length == 0"
						style="color: #999; text-align: center; padding: 20rpx;">暂无相关数据!</view>
				</view>

				<!-- 广场视频内容 -->
				<view class="content-page" :class="{active: currentTab === 'square'}">
					<view @tap="totab('../dongtai/list')" style="margin-top: 20rpx;margin-left: 20rpx;font-weight: 700"
						class="row iconfont">
						<text style="color: #555555;font-size: 30rpx;">广场视频 &#xe625;</text>
					</view>

					<view class="dlist donghua" v-for="(item,index) in data.dongtai" :key="item.id" @tap="dplay(item)">
						<view class="user">
							<view class="row">
								<image class="userimg" :src="url+item.user.avatar"></image>
								<view style="margin-top:40rpx;">
									<text class="username">{{item.user.name}}</text>
									<text class="ftime">发布于:{{item.addtime | formatDate}}</text>
								</view>
							</view>
						</view>

						<view style="margin-top:10rpx;margin-left: 20rpx;">
							<view class="vinfo">{{item.info}}</view>
						</view>

						<view style="margin-top:20rpx;">
							<image class="listimg" :src="url+item.img"></image>
						</view>
					</view>

					<view class="null" v-if="data && data.dongtai && data.dongtai.length == 0"
						style="color: #999; text-align: center; padding: 20rpx;">暂无相关数据!</view>
				</view>

				<!-- 电视剧内容 -->
				<view class="content-page" :class="{active: currentTab === 'tv'}">
					<view @tap="totab('../video/index')" style="margin-top: 20rpx;margin-left: 20rpx;font-weight: 700"
						class="row iconfont">
						<text style="color: #555555;font-size: 30rpx;">最新电视剧 &#xe625;</text>
					</view>

					<view class="listv row" style="margin-top: 20rpx;">
						<view class="list" v-for="(item,index) in data.newtv" :key="item.vod_id" @tap="play(item,1)">
							<image :src="item.vod_pic" mode="aspectFill"></image>
							<view style="margin: 10rpx;">
								<text class="vodname">{{item.vod_name}}</text>
								<view style="margin-top: 20rpx;"></view>
							</view>
							<view style="margin-top: 5rpx;">
								<text class="yanyuan">{{item.vod_actor==''?'暂无演员信息':item.vod_actor}}</text>
							</view>
						</view>
					</view>

					<view class="null" v-if="data && data.newtv && data.newtv.length == 0"
						style="color: #999; text-align: center; padding: 20rpx;">暂无相关数据!</view>
				</view>

				<!-- 电影内容 -->
				<view class="content-page" :class="{active: currentTab === 'movie'}">
					<view @tap="totab('../video/index')" style="margin-top: 60rpx;margin-left: 20rpx;font-weight: 700"
						class="row iconfont">
						<text style="color: #555555;font-size: 30rpx;">最新电影&#xe625;</text>
					</view>

					<view class="listv row" style="margin-top: 20rpx;">
						<view class="list" v-for="(item,index) in data.newvod" :key="item.vod_id" @tap="play(item,1)">
							<image :src="item.vod_pic" mode="aspectFill"></image>
							<view style="margin: 10rpx;">
								<text class="vodname">{{item.vod_name}}</text>
								<view style="margin-top: 20rpx;"></view>
							</view>
							<view style="margin-top: 5rpx;">
								<text class="yanyuan">{{item.vod_actor==''?'暂无演员信息':item.vod_actor}}</text>
							</view>
						</view>
					</view>

					<view class="null" v-if="data && data.newvod && data.newvod.length == 0"
						style="color: #999; text-align: center; padding: 20rpx;">暂无相关数据!</view>
				</view>
			</view>
		</scroll-view>

		<!-- 无数据且无网络时显示 -->
		<view v-if="!data && !isOnline" class="offline-empty">
			暂无离线数据，请在联网时加载数据后再使用离线功能
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				test: [],
				data: null,
				url: '',
				currentTab: 'home', // 默认选中首页
				scrollLeft: 0, // 滚动位置
				startX: 0, // 触摸起始X坐标
				startTime: 0, // 触摸开始时间
				pageWidth: 0, // 页面宽度
				isOnline: true, // 网络状态
				localDataKey: 'movieAppOfflineData' // 本地存储键名
			}
		},
		onLoad() {
			// 先读取本地存储的离线数据
			this.loadLocalData();

			// 检查网络状态
			this.checkNetworkStatus();

			//#ifdef APP-PLUS
			this.GetJson(this.ip + 'appup.php', 'GET', {}, e => {
				if (e.data.edition != plus.runtime.version && e.data.type == '0') {
					if (e.data.ios != '' && uni.getSystemInfoSync().platform == 'ios') {
						uni.setStorageSync('upapp', e.data);
						uni.navigateTo({
							url: '../gengxin/gengxin'
						});
						uni.$once('upapp', (is) => {
							plus.runtime.openURL(e.data.ios);
						})
					} else if (e.data.android != '') {
						uni.setStorageSync('upapp', e.data);
						uni.navigateTo({
							url: '../gengxin/gengxin'
						});
						uni.$once('upapp', (is) => {
							this.down(e.data.android);
							this.showToast('已进入后台下载...');
						})
					}
				}
			})

			plus.runtime.getProperty(plus.runtime.appid, (wgtInfo) => {
				this.appVersion = wgtInfo.version;
				this.GetJson(this.ip + 'appup.php', 'GET', {}, e => {
					if (e.data.type == '1' && e.data.wgtedition != wgtInfo.version) {
						if (uni.getSystemInfoSync().platform == 'ios' && e.data.wgtios) {
							this.downwgt(e.data.wgtios);
						} else if (e.data.wgtandroid) {
							this.downwgt(e.data.wgtandroid);
						}
					}
				})
			})
			//#endif

			// 获取屏幕宽度用于计算滚动位置
			uni.getSystemInfo({
				success: (res) => {
					this.pageWidth = res.windowWidth;
				}
			});

			// 监听网络状态变化
			uni.onNetworkStatusChange(res => {
				this.isOnline = res.isConnected;
				// 网络恢复时重新获取数据
				if (res.isConnected) {
					this.getdata(true);
				}
			});
		},
		methods: {
			// 检查网络状态
			checkNetworkStatus() {
				uni.getNetworkType({
					success: (res) => {
						this.isOnline = res.networkType !== 'none';
						// 有网络才请求数据
						if (this.isOnline) {
							this.getdata(true);
						}
					},
					fail: () => {
						this.isOnline = false;
					}
				});
			},

			// 加载本地存储的数据
			loadLocalData() {
				try {
					const localData = uni.getStorageSync(this.localDataKey);
					if (localData) {
						this.data = localData;
					}
				} catch (e) {
					console.error('读取本地数据失败:', e);
				}
			},

			// 保存数据到本地存储
			saveDataToLocal(data) {
				try {
					uni.setStorageSync(this.localDataKey, data);
				} catch (e) {
					console.error('保存数据到本地失败:', e);
				}
			},

			// 切换导航标签
			switchTab(tab) {
				this.currentTab = tab;
				// 计算滚动位置，根据标签索引乘以页面宽度
				const tabIndex = ['home', 'square', 'tv', 'movie'].indexOf(tab);
				this.scrollLeft = this.pageWidth * tabIndex;
			},

			// 触摸开始事件
			touchStart(e) {
				this.startX = e.touches[0].clientX;
				this.startTime = Date.now();
			},

			// 触摸结束事件，判断滑动方向和距离
			touchEnd(e) {
				const endX = e.changedTouches[0].clientX;
				const diffX = endX - this.startX;
				const diffTime = Date.now() - this.startTime;
				const tabs = ['home', 'square', 'tv', 'movie'];
				const currentIndex = tabs.indexOf(this.currentTab);

				// 滑动距离超过50px或快速滑动超过30px则判定为有效滑动
				if ((Math.abs(diffX) > 50) || (Math.abs(diffX) > 30 && diffTime < 300)) {
					if (diffX < 0 && currentIndex < tabs.length - 1) {
						// 向左滑动，切换到下一个标签
						this.switchTab(tabs[currentIndex + 1]);
					} else if (diffX > 0 && currentIndex > 0) {
						// 向右滑动，切换到上一个标签
						this.switchTab(tabs[currentIndex - 1]);
					}
				}
			},

			// 监听滚动事件
			onScroll(e) {
				// 可以在这里处理滚动时的其他逻辑
			},

			appup() {
				this.GetJson(this.ip + 'appup.php', 'GET', {}, e => {
					if (e.data.edition != plus.runtime.version && e.data.type == '0') {
						if (e.data.ios != '' && uni.getSystemInfoSync().platform == 'ios') {
							uni.setStorageSync('upapp', e.data);
							uni.navigateTo({
								url: '../gengxin/gengxin'
							});
							uni.$once('upapp', (is) => {
								plus.runtime.openURL(e.data.ios);
							})
						} else if (e.data.android != '') {
							uni.setStorageSync('upapp', e.data);
							uni.navigateTo({
								url: '../gengxin/gengxin'
							});
							uni.$once('upapp', (is) => {
								this.down(e.data.android);
								this.showToast('已进入后台下载...');
							})
						}
					}
				})
			},

			getdata(is) {
				if (!this.isOnline) return; // 无网络时不请求数据

				if (is) this.list = [];
				this.load = true;
				this.GetJson(this.ip + 'Index_api.php', 'POST', {
					type: 'Get_Index'
				}, e => {
					this.load = false;
					uni.stopPullDownRefresh();
					if (this.isdata(e)) {
						this.data = e.data;
						// 保存数据到本地存储，用于离线显示
						this.saveDataToLocal(e.data);
					}
				})
			},

			search() {
				uni.navigateTo({
					url: '../sou/sou?type=2',
					animationType: 'fade-in'
				})
			},

			ntourl(url) {
				uni.navigateTo({
					url
				})
			},

			totab(url) {
				uni.switchTab({
					url
				})
			},

			play(item) {
				uni.navigateTo({
					url: `../play/vplay?id=${item.vod_id}`,
					animationType: 'zoom-fade-out',
					animationDuration: 100
				})
			},

			dplay(item) {
				uni.navigateTo({
					url: `../dongtai/play?id=${item.id}&data=${item}&url=${item.video}&img=${item.img}&infos=${item.info}&money=${item.money}&addtime=${item.addtime}&toux=${item.user.avatar}&username=${item.user.name}&v=${item.v}&userid=${item.user.userid}&gz=${item.gz}&liwu=${item.liwus}&code=${item.code}`
				})
			},

			down(url) {
				if (url.includes('http')) {
					const downloadTask = uni.downloadFile({
						url,
						success: (res) => {
							plus.runtime.install(res.tempFilePath, {
								force: true
							});
						}
					})
					downloadTask.onProgressUpdate((e) => {
						this.downnum = e.progress;
						uni.$emit('sendNum', {
							data: e.progress
						});
					})
				}
			},

			downwgt(path) {
				if (path.includes('http')) {
					uni.downloadFile({
						url: path,
						success: (res) => {
							plus.runtime.install(res.tempFilePath, {
								force: true
							}, () => {
								plus.runtime.restart();
							});
						}
					})
				}
			},
		},
		filters: {
			formatDate(datetime) {
				const dateTimeStamp = datetime * 1000;
				const minute = 1000 * 60;
				const hour = minute * 60;
				const day = hour * 24;
				const week = day * 7;
				const monthUnit = day * 30;
				const now = new Date().getTime();
				const diffValue = now - dateTimeStamp;

				if (diffValue < 0) return '刚刚';

				const minC = diffValue / minute;
				const hourC = diffValue / hour;
				const dayC = diffValue / day;
				const weekC = diffValue / week;
				const monthC = diffValue / monthUnit;

				if (monthC >= 1 && monthC <= 3) return ` ${parseInt(monthC)}月前`;
				if (weekC >= 1 && weekC <= 3) return ` ${parseInt(weekC)}周前`;
				if (dayC >= 1 && dayC <= 6) return ` ${parseInt(dayC)}天前`;
				if (hourC >= 1 && hourC <= 23) return ` ${parseInt(hourC)}小时前`;
				if (minC >= 1 && minC <= 59) return ` ${parseInt(minC)}分钟前`;
				if (diffValue <= minute) return '刚刚';

				const date = new Date(dateTimeStamp);
				const year = date.getFullYear();
				const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
				const dayStr = date.getDate().toString().padStart(2, '0');
				return `${year}-${monthStr}-${dayStr}`;
			}
		},
		onPullDownRefresh() {
			if (this.isOnline) {
				this.getdata(true);
			} else {
				uni.stopPullDownRefresh();
				uni.showToast({
					title: '无网络连接，无法刷新',
					icon: 'none'
				});
			}
		}
	}
</script>

<style>
	/* 样式部分 */
	page {
		background-color: #111111;
	}

	.view-top {
		width: 100%;
		z-index: 99;
	}

	.network-tip {
		background-color: #ff9800;
		color: white;
		text-align: center;
		padding: 10rpx 0;
		font-size: 26rpx;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
	}

	.offline-empty {
		color: #999;
		text-align: center;
		padding: 100rpx 20rpx;
		font-size: 30rpx;
		margin-top: 170rpx;
	}

	.lunbo_bottom {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		top: 0;
		z-index: 3;
		background-image: linear-gradient(to top, rgba(17, 17, 17, 1), rgba(17, 17, 17, 0.5), rgba(17, 17, 17, 0.1));
		width: 100%;
		height: 620rpx;
	}

	.search {
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 60rpx;
		margin: 95rpx;
		height: 70rpx;
		width: calc(80% - 40rpx);
		position: fixed;
		top: 0;
		z-index: 999;
	}

	/* 顶部导航标签样式 */
	.nav-container {
		position: fixed;
		top: 0rpx;
		left: 0;
		right: 0;
		height: 160rpx;
		background-color: #222222;
		z-index: 998;
		padding-top: 70rpx;
	}

	.nav-scroll {
		width: 100%;
		white-space: nowrap;
	}

	.nav-wrapper {
		display: inline-flex;
		padding: 2 20rpx;
	}

	.nav-item {
		padding: 0 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 30rpx;
		color: #999999;
		text-align: center;
	}

	.nav-item.active {
		color: #ffffff;
		font-weight: bold;
		position: relative;
	}

	.nav-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 6rpx;
		background-color: #7b42e0;
		border-radius: 3rpx;
	}

	/* 滑动内容区域样式 */
	.content-scroll {
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		margin-top: 170rpx;
		/* 与导航栏对齐 */
	}

	.content-wrapper {
		display: inline-flex;
	}

	.content-page {
		width: 100vw;
		display: inline-block;
		vertical-align: top;
		white-space: normal;
	}

	.listv {
		background-color: #161616;
		flex-wrap: wrap;
		border-radius: 15rpx;
	}

	.list {
		padding: 10rpx 0;
		margin: 8rpx;
		position: relative;
		border-radius: 5rpx;
		width: 160rpx;
		animation: opacitys .1s;
	}

	.list>image {
		margin-left: 10rpx;
		width: 160rpx;
		height: 220rpx;
		border-radius: 8rpx;
	}

	.vodname {
		color: #F2F2F2;
		font-weight: 500;
		font-size: 25rpx;
		display: block;
		margin-top: -15rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		opacity: .7;
	}

	.yanyuan {
		margin: 10rpx;
		color: #707070;
		font-weight: 400;
		font-size: 23rpx;
		display: block;
		margin-top: -30rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		opacity: .7;
	}

	.listimg {
		width: 96%;
		height: 400rpx;
		margin-left: 20rpx;
		border-radius: 8rpx;
	}

	.sotext {
		margin-top: 15rpx;
		margin-left: 15rpx;
		color: #999999;
		font-size: 30rpx;
	}

	.vinfo {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		opacity: .7;
	}

	.swiper {
		height: 610rpx;
		width: 100%;
		margin-top: 0;
		/* 调整轮播图位置 */
	}

	.swiper-item>image {
		width: 100%;
		height: 610rpx;
	}

	.live {
		display: inline-block;
		width: 750rpx;
		height: 80rpx;
		font-size: 28rpx;
		font-weight: 700;
		color: #ffffff;
		position: absolute;
		top: 450rpx;
		padding: 0 50rpx;
		left: 0rpx;
		z-index: 99;
	}

	.user {
		padding: 15rpx;
		font-size: 32rpx;
		font-weight: 700;
		color: #000000;
		display: flex;
	}

	.username {
		font-size: 32rpx;
		padding-top: 30rpx;
		padding-left: 15rpx;
		font-weight: 700;
		color: #a3a3a3;
	}

	.userimg {
		width: 100rpx;
		height: 100rpx;
		border-radius: 100rpx;
		top: 20rpx;
	}

	.ftime {
		color: #555555;
		font-size: 30rpx;
		font-weight: 400;
		display: block;
		padding-left: 15rpx;
	}

	.fonta {
		background-image: linear-gradient(to right, #521fad, #7b42e0, #521fad);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.fontb {
		background-image: linear-gradient(to right, #7b42e0, #7b42e0);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.fonts {
		background-image: linear-gradient(to right, #FE6191, #FB6794, #F98DAD);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.fontc {
		background-image: linear-gradient(to right, #6b45aa, #7649c0, #6b45aa);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.font {
		background-image: linear-gradient(to right, #f93bd7, #FE82E3, #FC5A8B);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>