<template>
	<view>
		<div id="player"></div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: '',
			}
		},
		onReady() {
			this.h5play();
		},
		methods: {
			h5play() {
				var that = this;
				var player = new AipPlayer({
					container: document.getElementById("player"),
					header: true, //全屏显示头部信息(返回图标+标题) 
					title: "视频demo", //视频标题
					autoplay: false, //自动播放
					minHeader: true, //非全屏时是否显示 标题
					playNext: true, //全屏时是否显示下一集图标   选集数组小于等于1时不显示
					screenshot: false,
					airplay: false,
					loop: false, //循环播放 默认false
					live: false, //是否是直播
					playbackSpeed: [1.0, 1.25, 1.5, 2.0, 2.5, 3.0],
					playbackSpeedTxt: "倍数",
					speedIndex: 0, //playbackSpeed数组下标 初始的速度 默认0
					showMobilePlay: true, //手机中心播放暂停图标 
					currentIndex: 0, //设置当前激活选集的下标索引  默认0
					height: 240, //高度px
					spisodes: [{
						"name": "01"
					}, {
						"name": "02"
					}], //选集数组 空数组默认不显示
					spisodesTxt: "选集",
					showDanmaku: true, //弹幕开启  配置danmaku后才可生效  false关闭图标样式切换等
					landscape: false, //手机端默认进入横屏全屏时设置true  默认false
					video: {
						url: that.src, //视频url
					},
				});

				player.on('changeSpisodes', function() {
					let currentIndex = player.options.currentIndex;
					//点击时,会修改spisodes索引下标，根据下标获取视频url
					player.switchVideo({
						url: that.src
					});
					player.play();
				});
				
				player.on('back', function() {
		           //小屏时点击顶部返回按钮触发
				});
			},
		}
	}
</script>

<style>

</style>