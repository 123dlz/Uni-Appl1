<!-- components/latest-movie/latest-movie.vue -->
<template>
	<!-- 最外层容器 -->
	<view class="view-top">
		<!-- 最新电影标题区域，点击跳转到视频页 -->
		<view @tap="totab('../video/index')" style="margin-top: 60rpx;margin-left: 20rpx;font-weight: 700"
			class="row iconfont">
			<!-- 标题文本，包含图标 -->
			<text style="color: #555555;font-size: 30rpx;">最新电影&#xe625;</text>
		</view>

		<!-- 电影列表容器，使用flex布局 -->
		<view class="listv row" style="margin-top: 20rpx;">
			<!-- 遍历电影数据，生成每个电影项 -->
			<view class="list" v-for="(item,index) in data.newvod" :key="item.vod_id" @tap="play(item,1)">
				<!-- 电影海报图片 -->
				<image :src="item.vod_pic" mode="aspectFill"></image>
				<!-- 电影名称区域 -->
				<view style="margin: 10rpx;">
					<!-- 电影名称，超出显示省略号 -->
					<text class="vodname">{{item.vod_name}}</text>
					<!-- 间距占位 -->
					<view style="margin-top: 20rpx;"></view>
				</view>
				<!-- 演员信息区域 -->
				<view style="margin-top: 5rpx;">
					<!-- 演员信息，为空时显示默认文本 -->
					<text class="yanyuan">{{item.vod_actor==''?'暂无演员信息':item.vod_actor}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		// 组件数据定义
		data() {
			return {
				// 电影数据
				data: {},
				// 网络状态标识
				isOnline: true,
				// 本地存储的键名
				localDataKey: 'movieAppOfflineData'
			}
		},
		// 页面加载生命周期函数
		onLoad() {
			// 加载本地存储的离线数据
			this.loadLocalData();
			// 检查网络状态
			this.checkNetworkStatus();

			// 获取应用版本信息，检查wgt热更新
			plus.runtime.getProperty(plus.runtime.appid, (wgtInfo) => {
				// 存储应用版本
				this.appVersion = wgtInfo.version;
				// 检查wgt更新
				this.GetJson(this.ip + 'appup.php', 'GET', {}, e => {
					// 判断是否需要wgt更新
					if (e.data.type == '1' && e.data.wgtedition != wgtInfo.version) {
						// iOS平台wgt更新
						if (uni.getSystemInfoSync().platform == 'ios' && e.data.wgtios) {
							this.downwgt(e.data.wgtios);
						} 
						// Android平台wgt更新
						else if (e.data.wgtandroid) {
							this.downwgt(e.data.wgtandroid);
						} 
					}
				})
			})
			//#endif

			// 监听网络状态变化
			uni.onNetworkStatusChange(res => {
				// 更新网络状态
				this.isOnline = res.isConnected;
				// 网络恢复时重新获取数据
				if (res.isConnected) {
					this.getdata(true);
				}
			});
		},
		// 组件方法定义
		methods: {
			// 检查网络状态
			checkNetworkStatus() {
				uni.getNetworkType({
					success: (res) => {
						// 根据网络类型判断是否在线
						this.isOnline = res.networkType !== 'none';
						// 有网络时获取数据
						if (this.isOnline) {
							this.getdata(true);
						}
					},
					fail: () => {
						// 获取网络状态失败时设为离线
						this.isOnline = false;
					}
				});
			},

			// 加载本地存储的数据
			loadLocalData() {
				try {
					// 从本地存储读取数据
					const localData = uni.getStorageSync(this.localDataKey);
					// 如果存在本地数据则使用
					if (localData) {
						this.data = localData;
					}
				} catch (e) {
					// 读取失败时输出错误信息
					console.error('读取本地数据失败:', e);
				}
			},

			// 保存数据到本地存储
			saveDataToLocal(data) {
				try {
					// 将数据保存到本地存储
					uni.setStorageSync(this.localDataKey, data);
				} catch (e) {
					// 保存失败时输出错误信息
					console.error('保存数据到本地失败:', e);
				}
			},

			// 获取电影数据
			getdata(is) {
				// 无网络时不请求数据
				if (!this.isOnline) return;

				// 如果是重新获取数据，清空列表
				if (is) this.list = [];
				// 设置加载状态
				this.load = true;
				// 发送API请求获取首页数据
				this.GetJson(this.ip + 'Index_api.php', 'POST', {
					type: 'Get_Index'
				}, e => {

				})
			},

			// 跳转到tab页面
			totab(url) {
				uni.switchTab({
					url: url
				})
			},

			// 播放电影
			play(item) {
				uni.navigateTo({
					// 跳转到播放页面，传递电影ID
					url: `../play/vplay?id=${item.vod_id}`,
					// 设置页面切换动画
					animationType: 'zoom-fade-out',
					// 设置动画时长
					animationDuration: 100
				})
			},
		},
	}
</script>

<style scoped>
	/* 电影列表容器样式 */
	.listv {
		/* 背景颜色 */
		background-color: #161616;
		/* 允许换行 */
		flex-wrap: wrap;
		/* 圆角边框 */
		border-radius: 15rpx;
	}

	/* 单个电影项样式 */
	.list {
		/* 内边距 */
		padding: 10rpx 0;
		/* 外边距 */
		margin: 8rpx;
		/* 相对定位 */
		position: relative;
		/* 圆角 */
		border-radius: 5rpx;
		/* 固定宽度 */
		width: 160rpx;
		/* 透明度动画 */
		animation: opacitys .1s;
	}

	/* 电影海报图片样式 */
	.list>image {
		/* 左边距 */
		margin-left: 10rpx;
		/* 固定宽高 */
		width: 160rpx;
		height: 220rpx;
		/* 圆角 */
		border-radius: 8rpx;
	}

	/* 电影名称样式 */
	.vodname {
		/* 文字颜色 */
		color: #F2F2F2;
		/* 字体粗细 */
		font-weight: 500;
		/* 字体大小 */
		font-size: 25rpx;
		/* 块级显示 */
		display: block;
		/* 上边距调整 */
		margin-top: -15rpx;
		/* 溢出隐藏 */
		overflow: hidden;
		/* 文本溢出显示省略号 */
		text-overflow: ellipsis;
		/* 弹性盒子布局 */
		display: -webkit-box;
		/* 限制显示行数 */
		-webkit-line-clamp: 1;
		/* 盒子方向 */
		-webkit-box-orient: vertical;
		/* 透明度 */
		opacity: .7;
	}

	/* 演员信息样式 */
	.yanyuan {
		/* 外边距 */
		margin: 10rpx;
		/* 文字颜色 */
		color: #707070;
		/* 字体粗细 */
		font-weight: 400;
		/* 字体大小 */
		font-size: 23rpx;
		/* 块级显示 */
		display: block;
		/* 上边距调整 */
		margin-top: -30rpx;
		/* 溢出隐藏 */
		overflow: hidden;
		/* 文本溢出显示省略号 */
		text-overflow: ellipsis;
		/* 弹性盒子布局 */
		display: -webkit-box;
		/* 限制显示行数 */
		-webkit-line-clamp: 1;
		/* 盒子方向 */
		-webkit-box-orient: vertical;
		/* 透明度 */
		opacity: .7;
	}

	/* 空状态样式 */
	.null {
		/* 文字颜色 */
		color: #999;
		/* 文本居中 */
		text-align: center;
		/* 内边距 */
		padding: 20rpx;
	}
</style>