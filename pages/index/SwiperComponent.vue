<template>
	<!-- 条件渲染：当lunboList存在且不为空数组时才渲染 -->
	
		<!-- 顶部容器 -->
		<view class="view-top">
			<!-- 轮播图容器，添加简洁样式类 -->
			<view class="swiper-container simple-style">
				<!-- 轮播图组件 -->
				<swiper class="swiper" :circular="true" :indicator-dots="false" :autoplay="true" :interval="3000"
					:duration="500" @change="onSwiperChange">
					<!-- 遍历轮播图数据 -->
					<swiper-item v-for="(item, index) in lunboList" :key="index" class="swiper-item"
						@tap="play(item,1)">
						<!-- 轮播图片 -->
						<image class="swiper-image" :src="item.vod_pic" mode="aspectFill"></image>

						<!-- 底部信息区域 -->
						<view class="bottom-info">
							<!-- 视频名称 -->
							<text class="title-text">{{item.vod_name}}</text>
							<!-- 分隔符 -->
							<text class="separator"> | </text>
							<!-- 视频描述 -->
							<text class="desc-text">{{item.vod_blurb}}</text>
						</view>

						<!-- 底部渐变遮罩层 -->
						<view class="simple-overlay"></view>
					</swiper-item>
				</swiper>

				<!-- 自定义指示器容器 -->
				<view class="simple-indicator">
					<!-- 遍历生成指示点 -->
					<view v-for="(item, index) in lunboList" :key="index" class="simple-dot"
						:class="{ active: currentIndex === index }">
					</view>
				</view>
			</view>
		</view>
	
</template>

<script>
	// 导出Vue组件配置对象
	export default {
		// 组件属性定义部分
		props: {
			// 轮播图数据列表属性
			lunboList: {
				type: Array, // 指定属性类型为数组
				required: true, // 设置为必须传递的属性
				default: () => [] // 默认值为空数组
			}
		},

		// 组件数据定义部分
		data() {
			return {
				
				// 当前轮播图索引，用于指示器显示
				currentIndex: 0
			}
		},

		// 组件方法定义部分
		methods: {
			// 轮播图切换事件处理函数
			onSwiperChange(e) {
				// 更新当前索引为切换后的索引值
				this.currentIndex = e.detail.current;
			},

			// 点击轮播图项播放视频方法
			play(item, type) {
				// 使用uni-app导航API跳转到播放页面
				uni.navigateTo({
					url: '../play/vplay?id=' + item.vod_id, // 拼接播放页URL并传递视频ID参数
					animationType: 'zoom-fade-out', // 设置页面跳转动画类型为缩放淡出
					animationDuration: 100 // 设置动画时长为100毫秒
				})
			},
		}
	}
</script>

<style scoped>
	/* 样式作用域标识，防止样式污染 */
	/* 页面根元素样式 */
	page {
		/* 设置页面背景颜色为深黑色 */
		background-color: #111111;
	}

	/* 轮播图容器样式 - 简洁风格 */
	.swiper-container.simple-style {
		/* 设置相对定位，为子元素绝对定位提供参照 */
		position: relative;
		/* 宽度占满父容器 */
		width: 100%;
		/* 设置容器高度为400rpx */
		height: 400rpx;
		/* 设置圆角边框，半径为25rpx */
		border-radius: 25rpx;
		/* 隐藏超出容器范围的内容 */
		overflow: hidden;
	}

	/* 轮播图组件样式 */
	.swiper {
		/* 高度占满父容器 */
		height: 100%;
		/* 宽度占满父容器 */
		width: 100%;
	}

	/* 单个轮播项样式 */
	.swiper-item {
		/* 设置相对定位 */
		position: relative;
		/* 宽度占满父容器 */
		width: 100%;
		/* 高度占满父容器 */
		height: 100%;
	}

	/* 轮播图片样式 */
	.swiper-image {
		/* 图片宽度占满容器 */
		width: 100%;
		/* 图片高度占满容器 */
		height: 100%;
	}

	/* 底部信息区域样式 */
	.bottom-info {
		/* 绝对定位，相对于轮播项 */
		position: absolute;
		/* 距离底部15rpx */
		bottom: 15rpx;
		/* 设置高度为40rpx */
		height: 40rpx;
		/* 距离左侧20rpx */
		left: 20rpx;
		/* 距离右侧200rpx，为指示器留出空间 */
		right: 200rpx;
		/* 设置层级为3，确保显示在最上层 */
		z-index: 3;
		/* 使用弹性布局 */
		display: flex;
		/* 垂直居中对齐 */
		align-items: center;
		/* 设置透明背景 */
		background: rgba(0, 0, 0, 0);
		/* 内边距10rpx */
		padding: 10rpx;
		/* 圆角边框，半径为20rpx */
		border-radius: 20rpx;
		/* 隐藏溢出内容 */
		overflow: hidden;
	}

	/* 标题文本样式 */
	.title-text {
		/* 设置文字颜色为白色 */
		color: #ffffff;
		/* 字体大小30rpx */
		font-size: 30rpx;
		/* 字体加粗 */
		font-weight: bold;
		/* 禁止文本换行 */
		white-space: nowrap;
		/* 禁止弹性收缩 */
		flex-shrink: 0;
	}

	/* 分隔符样式 */
	.separator {
		/* 设置文字颜色为浅灰色 */
		color: #cccccc;
		/* 字体大小24rpx */
		font-size: 24rpx;
		/* 左右外边距15rpx */
		margin: 0 15rpx;
		/* 禁止弹性收缩 */
		flex-shrink: 0;
	}

	/* 描述文本样式 */
	.desc-text {
		/* 设置文字颜色为浅灰色 */
		color: #cccccc;
		/* 字体大小26rpx */
		font-size: 26rpx;
		/* 隐藏溢出内容 */
		overflow: hidden;
		/* 文本溢出显示省略号 */
		text-overflow: ellipsis;
		/* 禁止文本换行 */
		white-space: nowrap;
		/* 占据剩余所有空间 */
		flex: 1;
	}

	/* 渐变遮罩层样式 */
	.simple-overlay {
		/* 绝对定位，相对于轮播项 */
		position: absolute;
		/* 底部对齐 */
		bottom: 0;
		/* 左侧对齐 */
		left: 0;
		/* 右侧对齐 */
		right: 0;
		/* 高度为容器高度的40% */
		height: 40%;
		/* 渐变背景：从透明到半透明黑色 */
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
		/* 设置层级为1，在图片上层但在文字下层 */
		z-index: 1;
	}

	/* 指示器容器样式 */
	.simple-indicator {
		/* 绝对定位，相对于轮播容器 */
		position: absolute;
		/* 距离底部20rpx */
		bottom: 20rpx;
		/* 距离右侧20rpx */
		right: 20rpx;
		/* 使用弹性布局 */
		display: flex;
		/* 设置层级为3，确保显示在最上层 */
		z-index: 3;
	}

	/* 单个指示点样式 */
	.simple-dot {
		/* 指示点宽度12rpx */
		width: 12rpx;
		/* 指示点高度12rpx */
		height: 12rpx;
		/* 圆形边框半径 */
		border-radius: 50%;
		/* 半透明白色背景 */
		background: rgba(255, 255, 255, 0.5);
		/* 左侧外边距8rpx */
		margin-left: 8rpx;
		/* 所有属性过渡动画，时长0.3秒 */
		transition: all 0.3s;
	}

	/* 激活状态指示点样式 */
	.simple-dot.active {
		/* 纯白色背景 */
		background: #ffffff;
		/* 放大1.2倍 */
		transform: scale(1.2);
	}
</style>