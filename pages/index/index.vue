<template>
	<!-- 主容器 -->
	<view class="view-top">
		<!-- 顶部背景区域 -->
		<view class="top-bg">
			<!-- 图标按钮行 -->
			<view class="row icotap">
				<!-- 第一个图标按钮 -->
				<text @tap="dtsc" class="aa1 iconfont">&#xe703;</text>
				<!-- 第二个图标按钮 -->
				<text @tap="add" class="aa2 iconfont">&#xe7eb;</text>
			</view>

			<!-- APP平台下的搜索框 -->
			<!--#ifdef APP-PLUS -->
			<view @tap="search()" class="search ">
				<view class="iconfont sotext"> &#xe620; 搜索你喜欢的电影或电视剧名称...</view>
			</view>
			<!--#endif-->

			<!-- H5平台下的搜索框 -->
			<!--#ifdef H5 -->
			<view @tap="search()" class="search " style="margin-top: 28rpx;">
				<view class="iconfont sotext"> &#xe620; 搜索你喜欢的电影或电视剧名称...</view>
			</view>
			<!--#endif-->

			<!-- 顶部导航栏容器 -->
			<view class="nav-container">
				<!-- 可横向滚动的导航栏 -->
				<scroll-view class="nav-scroll" scroll-x="true" :scroll-left="scrollLeft" scroll-with-animation
					:show-scrollbar="false">
					<!-- 导航标签容器 -->
					<view class="nav-tabs">
						<!-- 遍历导航列表 -->
						<view v-for="(tab, index) in navList" :key="index" class="nav-tab"
							:class="{ 'active': currentTab === index }" @tap="switchTab(index)" :id="'tab-' + index">
							<!-- 显示导航标签文本 -->
							{{ tab }}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 内容区域 - 支持左右滑动切换的swiper -->
		<swiper class="content-swiper" :current="currentTab" @change="onSwiperChange" :duration="300"
			:style="swiperStyle">
			<!-- 遍历导航列表创建对应的swiper-item -->
			<swiper-item v-for="(tab, index) in navList" :key="index">
				<!-- 可纵向滚动的scroll-view -->
				<scroll-view class="scroll-content" scroll-y="true" :style="scrollStyle">
					<!-- 首页内容 -->
					<view v-if="index === 0" class="page-content">
						<!-- 首页内容容器 -->
						<view>
							<!-- 引用轮播图子组件 -->
							<swiper-component :lunboList="lunboData"></swiper-component>

							<!-- 给组件传数据（通过props） -->
							<latest-movies></latest-movies>

						</view>
					</view>

					<!-- 发现内容 -->
					<view v-else-if="index === 1" class="page-content">
						<text>发现内容</text>
					</view>

					<!-- 电视剧内容 -->
					<view v-else-if="index === 2" class="page-content">
						<text>视剧内容</text>
					</view>

					<!-- 电影内容 -->
					<view v-else-if="index === 3" class="page-content">
						<text>电影内容</text>
					</view>

					<!-- 动漫内容 -->
					<view v-else-if="index === 4" class="page-content">
						<text>动漫内容</text>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	// 导入轮播图子组件
	import LatestMovies from './LatestMovies.vue'
	import SwiperComponent from './SwiperComponent.vue'
	export default {

		// 注册子组件
		components: {
			SwiperComponent, // 已有的轮播组件
			LatestMovies // 新增：注册LatestMovies组件
		},

		data() {
			return {
				test: [], // 测试数据
				data: null, // 页面数据
				// 网络状态标识
				isOnline: true,
				// 本地存储的键名
				localDataKey: 'movieAppOfflineData',
				// 导航栏数据
				navList: ['首页', '发现', '视剧', '电影', '动漫'], // 导航标签列表
				currentTab: 0, // 当前选中的标签索引
				scrollLeft: 0, // 导航栏横向滚动位置
				tabWidth: 0, // 每个导航标签的宽度
				navScrollWidth: 0, // 导航滚动区域总宽度
				contentMarginTop: 0, // 内容区域距离顶部的高度
				scrollHeight: 0, // 滚动区域高度
				// 导航栏数据结束
				systemInfo: {}, // 系统信息对象
				lunboData: [] // 轮播图数据

			}
		},
		// 计算属性
		computed: {
			// 动态计算swiper高度
			swiperStyle() {
				return `height: ${this.scrollHeight}px;`;
			},
			// 动态计算滚动区域高度
			scrollStyle() {
				return `height: ${this.scrollHeight}px;`;
			}
		},
		// 页面加载生命周期
		onLoad() {
			this.getSystemInfo(); // 获取系统信息
			this.calculateLayout(); // 计算布局
			this.getData(); // 获取页面数据
			// 加载本地存储的离线数据
			this.loadLocalData();
			// 检查网络状态
			this.checkNetworkStatus();
			// APP平台下的更新检查
			//#ifdef APP-PLUS
			// 整包更新检查
			this.GetJson(this.ip + 'appup.php', 'GET', {}, e => {
				// 检查版本是否需要更新
				if (e.data.edition != plus.runtime.version && e.data.type == '0') {
					// iOS平台处理
					if (e.data.ios != '' && uni.getSystemInfoSync().platform == 'ios') {
						uni.setStorageSync('upapp', e.data); // 存储更新信息
						uni.navigateTo({
							url: '../gengxin/gengxin' // 跳转到更新页面
						});
						// 监听更新事件
						uni.$once('upapp', (is) => {
							plus.runtime.openURL(e.data.ios); // 打开App Store
						})
					}
					// Android平台处理
					else if (e.data.android != '') {
						uni.setStorageSync('upapp', e.data); // 存储更新信息
						uni.navigateTo({
							url: '../gengxin/gengxin' // 跳转到更新页面
						});
						// 监听更新事件
						uni.$once('upapp', (is) => {
							this.down(e.data.android); // 下载APK
							this.showToast('已进入后台下载...'); // 显示提示
						})
					}
				}
			})
			// 资源包（wgt）更新检查
			plus.runtime.getProperty(plus.runtime.appid, (wgtInfo) => {
				this.appVersion = wgtInfo.version; // 获取当前应用版本
				this.GetJson(this.ip + 'appup.php', 'GET', {}, e => {
					// 检查wgt更新
					if (e.data.type == '1' && e.data.wgtedition != wgtInfo.version) {
						// iOS平台wgt更新
						if (uni.getSystemInfoSync().platform == 'ios' && e.data.wgtios) {
							this.downwgt(e.data.wgtios); // 下载iOS wgt包
						}
						// Android平台wgt更新
						else if (e.data.wgtandroid) {
							this.downwgt(e.data.wgtandroid); // 下载Android wgt包
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
		// 页面准备就绪生命周期
		onReady() {
			this.calculateTabWidth(); // 计算标签宽度
		},
		// 方法定义
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
			// 获取网络API调用页面数据
			getData() {
				// 无网络时不请求数据

				// 显示加载状态（通常用于显示loading动画）
				this.load = true;
				// 调用API获取数据
				this.GetJson(this.ip + 'Index_api.php', 'POST', {
					type: 'Get_Index', // 请求参数：获取首页数据
				}, e => {
					// 请求完成，隐藏加载状态
					this.load = false;

					// 检查返回数据是否有效（isdata可能是数据验证方法）
					if (this.isdata(e)) {
						// 将API返回的轮播数据赋值给组件的lunboData属性
						this.lunboData = e.data.lunbo;
					}
				})
			},
			// 跳转到搜索页面
			search() {
				uni.navigateTo({
					url: '../sou/sou?type=2',
					animationType: 'fade-in'
				})
			},
			// 第一个图标点击事件
			dtsc() {
				console.log('点击了第一个图标');
			},
			// 第二个图标点击事件
			add() {
				console.log('点击了第二个图标');
			},
			// 获取系统信息
			getSystemInfo() {
				uni.getSystemInfo({
					success: (res) => {
						this.systemInfo = res; // 存储系统信息
						this.calculateScrollHeight(); // 计算滚动高度
					}
				});
			},
			// 计算布局
			calculateLayout() {
				// 根据不同平台计算顶部高度
				let topHeight = 0;
				// #ifdef APP-PLUS
				topHeight = 259; // APP平台高度
				// #endif
				// #ifdef H5
				topHeight = 180; // H5平台高度
				// #endif
				this.contentMarginTop = topHeight; // 设置内容区域顶部边距
			},
			// 计算滚动区域高度
			calculateScrollHeight() {
				const windowHeight = this.systemInfo.windowHeight || 667; // 获取窗口高度
				const topHeight = uni.upx2px(this.contentMarginTop); // 转换单位
				this.scrollHeight = windowHeight - topHeight; // 计算滚动高度
			},
			// 计算标签宽度
			calculateTabWidth() {
				const query = uni.createSelectorQuery().in(this); // 创建选择器查询
				query.select('.nav-tab').boundingClientRect(data => {
					if (data) {
						this.tabWidth = data.width; // 获取标签宽度
						this.navScrollWidth = this.tabWidth * this.navList.length; // 计算总宽度
					}
				}).exec(); // 执行查询
			},
			// 切换标签方法
			switchTab(index) {
				if (this.currentTab === index) return; // 如果已经是当前标签则返回

				this.currentTab = index; // 更新当前标签索引
				this.adjustNavScroll(); // 调整导航栏滚动位置
				console.log('切换到标签:', this.navList[index]); // 打印日志

				// 延迟加载新标签内容
				setTimeout(() => {
					this.loadCurrentTabContent(); // 加载当前标签内容
				}, 100);
			},
			// swiper切换事件
			onSwiperChange(e) {
				const current = e.detail.current; // 获取当前swiper索引
				if (this.currentTab !== current) {
					this.currentTab = current; // 更新当前标签索引
					this.adjustNavScroll(); // 调整导航栏滚动位置
				}
			},
			// 调整导航栏滚动位置
			adjustNavScroll() {
				// 计算需要滚动的距离，让当前标签居中显示
				const scrollViewWidth = this.systemInfo.windowWidth || 375; // 获取滚动视图宽度
				const tabCenter = this.currentTab * this.tabWidth + this.tabWidth / 2; // 计算标签中心位置
				const scrollCenter = scrollViewWidth / 2; // 计算滚动视图中心位置

				let targetScrollLeft = tabCenter - scrollCenter; // 计算目标滚动位置

				// 边界处理
				targetScrollLeft = Math.max(0, targetScrollLeft); // 最小值为0
				targetScrollLeft = Math.min(this.navScrollWidth - scrollViewWidth, targetScrollLeft); // 最大值处理

				this.scrollLeft = targetScrollLeft; // 设置滚动位置
			},
			// 加载当前标签内容
			loadCurrentTabContent() {
				// 根据currentTab加载对应内容
				console.log('加载内容:', this.navList[this.currentTab]); // 打印日志
				// 实际开发中这里可以调用API加载数据
			},
		},
	}
</script>

<style>
	/* 页面背景色 */
	page {
		background-color: #111111;
	}

	/* 搜索框样式 */
	.search {
		background-color: rgba(0, 0, 0, 0.3);
		/* 半透明黑色背景 */
		border-radius: 50rpx;
		/* 圆角 */
		margin: 95rpx;
		/* 外边距 */
		height: 70rpx;
		/* 高度 */
		width: 550rpx;
		/* 宽度 */
		/* #ifdef APP-PLUS */
		margin-top: 95rpx;
		/* APP平台上边距 */
		/* #endif */
		position: fixed;
		/* 固定定位 */
		left: 0;
		/* 左对齐 */
		right: 0;
		/* 右对齐 */
		top: 0;
		/* 顶部对齐 */
		z-index: 999999;
		/* 层级 */
	}

	/* 搜索框文本样式 */
	.sotext {
		margin-top: 15rpx;
		/* 上边距 */
		margin-left: 15rpx;
		/* 左边距 */
		color: #999999;
		/* 颜色 */
		font-size: 30rpx;
		/* 字体大小 */
	}

	/* 搜索框按钮行样式 */
	.icotap {
		/* #ifdef APP-PLUS */
		margin-top: 12rpx;
		/* APP平台上边距 */
		/* #endif */
		/* #ifdef H5 */
		margin-top: -58rpx;
		/* H5平台上边距 */
		/* #endif */
	}

	/* 第一个图标样式 */
	.aa1 {
		margin-left: 20rpx;
		/* 左边距 */
		margin-top: 83rpx;
		/* 上边距 */
		color: #555555;
		/* 颜色 */
		font-size: 60rpx;
		/* 字体大小 */
	}

	/* 第二个图标样式 */
	.aa2 {
		margin-left: 590rpx;
		/* 左边距 */
		margin-top: 90rpx;
		/* 上边距 */
		color: #555555;
		/* 颜色 */
		font-size: 65rpx;
		/* 字体大小 */
	}

	/* 顶部背景区域样式 */
	.top-bg {
		background: #222222;
		/* 背景色 */
		width: 750rpx;
		/* 宽度 */
		/* #ifdef APP-PLUS */
		height: 240rpx;
		/* APP平台高度 */
		/* #endif */
		/* #ifdef H5 */
		height: 180rpx;
		/* H5平台高度 */
		/* #endif */
		position: fixed;
		/* 固定定位 */
		left: 0;
		/* 左对齐 */
		right: 0;
		/* 右对齐 */
		top: 0;
		/* 顶部对齐 */
		z-index: 999999;
		/* 层级 */
	}

	/* 导航栏容器样式 */
	.nav-container {
		width: 100%;
		/* 宽度100% */
		/* #ifdef APP-PLUS */
		margin-top: 1rpx;
		/* APP平台上边距 */
		/* #endif */
		/* #ifdef H5 */
		margin-top: 1rpx;
		/* H5平台上边距 */
		/* #endif */
		overflow: hidden;
		/* 溢出隐藏 */
	}

	/* 导航滚动区域样式 */
	.nav-scroll {
		width: 100%;
		/* 宽度100% */
		white-space: nowrap;
		/* 不换行 */
		height: 60rpx;
		/* 高度 */
	}

	/* 导航标签容器样式 */
	.nav-tabs {
		display: inline-flex;
		/* 行内弹性布局 */
		height: 100%;
		/* 高度100% */
		padding: 0 10rpx;
		/* 内边距 */
	}

	/* 导航标签样式 */
	.nav-tab {
		flex-shrink: 0;
		/* 不收缩 */
		color: #999999;
		/* 颜色 */
		font-size: 30rpx;
		/* 字体大小 */
		padding: 13rpx 40rpx;
		/* 内边距 */
		transition: all 0.3s;
		/* 过渡效果 */
		text-align: center;
		/* 文本居中 */
	}

	/* 激活状态的导航标签样式 */
	.nav-tab.active {
		color: #FFFFFF;
		/* 白色文字 */
		font-weight: bold;
		/* 粗体 */
		border-bottom-color: #FF0000;
		/* 红色底部边框 */
	}

	/* 内容区域swiper样式 */
	.content-swiper {
		width: 100%;
		/* 宽度100% */
		/* #ifdef APP-PLUS */
		margin-top: 240rpx;
		/* APP平台上边距 */
		/* #endif */
		/* #ifdef H5 */
		margin-top: 180rpx;
		/* H5平台上边距 */
		/* #endif */
	}

	/* 滚动内容区域样式 */
	.scroll-content {
		width: 100%;
		/* 宽度100% */
	}

	/* 页面内容区域样式 */
	.page-content {
		width: 100%;
		/* 宽度100% */
		height: 100%;
		/* 高度100% */
		padding: 20rpx;
		/* 内边距 */
		color: #ffffff;
		/* 白色文字 */
		font-size: 32rpx;
		/* 字体大小 */
	}

	/* 渐变文字样式类 */
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