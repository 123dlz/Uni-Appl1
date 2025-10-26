<template>
	<view>
		<view class="top-bg">
			<view class="search">
				<view @tap="search" class="inputs iconfont">&#xe620; 输入关键词搜索...</view>
			</view>
			<view class="row rightico">
				<text @tap="opentap('./record')" class="aa1 iconfont">&#xe8c5;</text>
				<text @tap="opentap('./follow')" class="aa2 iconfont">&#xe68f;</text>
			</view>
			
			<!--导航-->
			<scroll-view :scroll-x="true" class="scroll-view" style="margin-top:10rpx;padding: 0 10rpx;">
				<view class="tab_top">
					<view class="row"  v-for="(item,index) in tabList" @tap="tabtap(index,item.type_id,item.type_name)">
						<view class="tabtitle" :class="vodtitle == item.type_name ? 'show' : ''">{{item.type_name}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<view v-if="newindex!=0" class="indextop">
			<view class="listv row ">
				<view class="list donghua" v-for="(item,index) in list" :key="item.id" @tap="play(item.vod_id,0)">
					<image :src="item.vod_pic" mode="aspectFill"></image>
					<view style="margin: 10rpx;">
						<text class="title">{{item.vod_name}}</text>
					</view>
				</view>
			</view>
			<null class="null" v-if="!load && list.length == 0 && tuijian.length==0" info="还没有内容哦!"></null>
			<load class="load" :style="{opacity:load ? '1' : '0'}"></load>
		</view>


		<view v-if="newindex==0" class="indextop">
			<view class="listtop">
				<swiper class="swiper" :circular="true" :indicator-dots="false" :autoplay="true" :interval="3000"
					:duration="300">
					<swiper-item v-for="item in lunbo" style="width: 100%;" @tap="play(item.vod_id,0)">
						<view class="row">
							<view style="min-width: 220rpx;">
								<image class="lbpic" :src="item.vod_pic" mode="aspectFill"></image>
							</view>
							<view style="padding: 0 20rpx;margin-top: -5px;">
								<view class="row">
									<text class="lbvodname"
										style="color:#FFF;font-weight: 700;font-size: 40rpx;padding-top: -10rpx;">{{item.vod_name}}</text>
								</view>
								<text
									style="margin-top: 15rpx;padding:6rpx 12rpx;color:#555555;border-radius: 8rpx;font-size:28rpx;display: block;border: 1rpx solid #222222;;">{{item.vod_class}}</text>
								<text class="lbblurb" style="color:#959595;font-size:28rpx;">{{item.info}}</text>
								<view class="row" style="margin-top: 10rpx;">
									<text style="color:#707070;font-size:28rpx;">本月播放:{{item.vod_hits_month}}</text>
									<text
										style="color:#707070;font-size:28rpx;padding:0 20rpx">总计播放:{{item.vod_hits}}</text>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<!--最新上线-->
			<view style="margin-top: 20rpx;">
				<view style="background-color:#0000">
					<view class="row" style="margin: 20rpx;">
						<text style="background-color: #FC5A8B;width: 15rpx;height: 35rpx;"></text>
						<text style='padding: 8rpx 15rpx;font-weight: 700;color:#FFFFFF;'>最新上线</text>
					</view>
						<view class="listv row">
							<view class="list" v-for="(item,index) in newlist" :key="index" @tap="play(item.vod_id,0)">
								<view class="tagtime" style="font-size: 15rpx;">{{gettime(item.vod_time_add,'yyyy-MM-dd')}}</view>
								<image :src="item.vod_pic" mode="aspectFill"></image>
								<view class="viewbottom row iconfont">
									<text>&#xe763; {{item.vod_score_all}}</text>
									<text>&#xe68f; {{item.vod_hits}}</text>
									<text>&#xe682; {{item.vod_comments_num}}</text>
								</view>
								<view style="margin: 10rpx;">
									<text class="title">{{item.vod_name}}</text>
								</view>
							</view>
						</view>
					<null v-if='newlist.length == 0 ' info='暂无相关数据!'></null>
				</view>
			</view>
			<!--最新上线-->
			
			<!--热播短剧-->
			<view style="margin-top: 20rpx;">
				<view style="background-color:#0000">
					
					<view style='padding: 8rpx 15rpx;font-weight: 700;color:#FFFFFF;'>热播短剧</view>
						<view class="listv row">
							<view class="list" v-for="(item,index) in hotlist" :key="index" @tap="play(item.vod_id,0)">
								<view class="tag">喜欢:{{item.vod_up}}</view>
								<image :src="item.vod_pic" mode="aspectFill"></image>
								<view class="viewbottom row iconfont">
									<text>&#xe763; {{item.vod_score_all}}</text>
									<text>&#xe68f; {{item.vod_hits}}</text>
									<text>&#xe682; {{item.vod_comments_num}}</text>
								</view>
								<view style="margin: 10rpx;">
									<text class="title">{{item.vod_name}}</text>
								</view>
								
							</view>
						</view>
					<null v-if='hotlist.length == 0 ' info='暂无相关数据!'></null>
				</view>
			</view>
			<!--热播短剧-->

			<!--推荐-->
			<view style="margin-top: 20rpx;">
				<view style="background-color:#0000">
					<view class="row" style="margin: 20rpx;">
						<text style="background-color: #FC5A8B;width: 15rpx;height: 35rpx;"></text>
						<text style='padding: 8rpx 15rpx;font-weight: 700;color:#FFFFFF;'>热门推荐</text>
					</view>
					<scroll-view :scroll-x='true'>
						<view class='row' style='padding: 8rpx 15rpx;'>
							<view style="position: relative;z-index:5" v-for='(item,index) in tuijian' :key='index'
								@tap="play(item.vod_id,0)">
								<view class="tag">观看:{{item.vod_hits}}</view>
								<image class='vodimg' :src='item.vod_pic' mode='aspectFill'></image>
								<view class="title" style="font-size: 25rpx;color:#C5C4C4;text-align: center;">
									{{item.vod_name}}</view>
								<view style="font-size: 20rpx;color:#C5C4C4;text-align: center;">

								</view>
							</view>
						</view>
					</scroll-view>
					<null v-if='tuijian.length == 0 ' info='暂无相关数据!'></null>
				</view>
			</view>
			<!--推荐-->
		</view>


		<uni-popup type="top" ref="popup" :safe-area="false" background-color="rgba(0,0,0,0.1)">
			<view @click="closeList()" class="openwindows"
				:style="'background-color:rgba(0,0,0,1);width: 400rpx;height:1590rpx;margin-left:50%;'">
				<view class="list-title">
					<view @tap="opentap('./follow')" class="list-title-l" style="padding-top: 160rpx;">
						<text class="list-title-ls">我的追剧</text>
					</view>
					<view @tap="opentap('./record')" class="list-title-l">
						<text class="list-title-ls">观看记录</text>
					</view>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: [],
				tuijian: [],
				newlist: [],
				hotlist: [],
				lunbo: [],
				newindex: 0,
				tabgclass: {},
				load: false,
				list: [],
				typename: '',
				vodtitle:'',
				height: uni.getSystemInfoSync().screenHeight

			}
		},
		computed: {
			user() {
				return this.$store.state.userinfo;
			}
		},
		onShow() {
			//#ifdef H5
			uni.getStorage({
				key: 'userinfo',
				success: (e) => {
					let sign = this.md5(e.data.token);
					this.GetJson(this.ip + 'userinfo.php', 'POST', {
						token: e.data.token,
						sign: sign
					}, res => {
						if (res.code == 405 || res.userinfo == null || res.userinfo == '') {
							uni.removeStorage({
								key: 'ulogin'
							})
							uni.reLaunch({
								url: '../login/login'
							})
						}
						if (this.isdata(res)) {
							this.$store.state.userinfo = res.userinfo;
							this.$store.state.vip.vip = res.vip;
							this.$store.state.userinfo = res.userinfo;
						}
					})
				}
			})
			//#endif
		},
		onLoad(data) {
			this.GetJson(this.ip + 'Duanju_api.php', 'POST', {
				type: 'gettab'
			}, e => {
				//console.log(e);
				this.tabList = e.tablist;
				this.newlist = e.newlist;
				this.lunbo = e.lunbo;
				this.tuijian = e.tuijian;
				this.hotlist = e.hotlist;
				this.tabList.unshift({
					type_name: '首页',
					type_id: 0,
				});
			})
			//console.log(this.$store.state.jufollow);
		},
		onReady() {
			this.tabtap(0, 0);
		},
		onUnload() {

		},
		methods: {
			tabtap(index, id,name) {
				this.newindex = id;
				this.$set(this, 'vodtitle', name)
				if (this.newindex != 0) this.getdata(true);
			},
			getdata(is) {
				if (is === true) this.list = [];
				this.load = true;
				this.GetJson(this.ip + 'Duanju_api.php', 'POST', {
					type: 'getlists',
					num: this.list.length,
					typeid: this.newindex
				}, e => {
					//console.log(e)
					this.load = false;
					uni.stopPullDownRefresh();
					if (this.isdata(e)) {
						this.list = [...this.list, ...e.list];
					}
				})
			},
			search() {
				uni.navigateTo({
					url: './sou',
					animationType: 'fade-in'
				})
			},
			play(id, index) {
				uni.navigateTo({
					url: 'play?id=' + id + '&courseDetailsId=' + index,
					animationType: 'zoom-fade-out',
					animationDuration: 200
				})
			},
			closeList() {
				this.$refs.popup.close()
			},
			setting() {
				this.$refs.popup.open('top')
			},
			opentap(url) {
				uni.navigateTo({
					url: url
				})
			},
		},
		onReachBottom() {
			if (this.load == false) this.getdata('is')

		},
		onPullDownRefresh() {
			this.getdata(true);
		}
	}
</script>

<style>
	page {
		background-color: #000000;

	}

	.openwindows {
		width: 750rpx;
		align-items: center;

	}

	.list-title {
		width: 710rpx;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.list-title-l {
		flex-direction: row;
		align-items: center;
		padding: 30rpx 10rpx;
	}

	.list-title-ls {
		padding: 30rpx 30rpx;
		margin-left: 15rpx;
		color: #FFFFFF;
		font-size: 35rpx;
		font-weight: 700;
	}

	.sou {
		margin: 22rpx;
		height: 50rpx;
		width: 50rpx;
		margin-left: 40rpx;
		margin-top: 8rpx;
	}

	.inputs {
		margin-top: 13rpx;
		margin-left: 30rpx;
		color: #767575;
	}

	.indextop {
		/*#ifdef APP-PLUS*/
		margin-top: 240rpx;
		/*#endif*/
		/*#ifdef H5*/
		margin-top: 200rpx;
		/*#endif*/
	}
	.tab_top {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		height: 60rpx;
	}
	.tabtitle{
		margin-left: 10rpx;
		background-color: #121212;
		border-radius: 7rpx;
		color:#555555;
		margin-top: -6rpx;
		font-size: 30rpx;
		font-weight: 700;
		padding: 1rpx 15rpx;
	}
	.show {
		margin-top: -6rpx;
		font-size: 30rpx;
		font-weight: 700;
		padding: 1rpx 15rpx;
		background-color: rgba(250, 90, 154, 1);
		color: #FFFFFF;
		/*border-bottom: 10rpx solid rgba(250, 90, 154, 1);*/
		transition: .5s;
	}
	.rightico {
		/*#ifdef APP-PLUS*/
		margin-top: 18rpx;
		/*#endif*/
		/*#ifdef H5*/
		margin-top: -50rpx;
		/*#endif*/
	}

	.aa1 {
		margin-left: 600rpx;
		margin-top: 80rpx;
		color: #5F5E5E;
		font-size: 54rpx;
	}

	.aa2 {
		margin-left: 20rpx;
		margin-top: 80rpx;
		color: #5F5E5E;
		font-size: 55rpx;
	}

	.top-bg {
		background: #000;
		width: 750rpx;
		/*#ifdef APP-PLUS*/
		height: 240rpx;
		/*#endif*/
		/*#ifdef H5*/
		height: 190rpx;
		/*#endif*/
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 999;
	}

	.search {
		background-color: #121212;
		border-radius: 50rpx;
		margin: 20rpx;
		height: 70rpx;
		width: 550rpx;
		/*#ifdef APP-PLUS*/
		margin-top: 90rpx;
		/*#endif*/
		/*#ifdef H5*/
		margin-top: 20rpx;
		/*#endif*/
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 1;
	}

	.swiper {
		padding: 20rpx 10rpx;
		background-color: #121212;
		margin: 20rpx;
		border-radius: 9rpx;
		height: 350rpx;
		width: 95%;
	}

	.lbpic {
		border-radius: 9rpx;
		width: 220rpx;
		height: 300rpx;
	}

	.scroll-view {
		width: 750rpx;
		white-space: nowrap;
		height: 70rpx;
		position: fixed;
		/*#ifdef APP-PLUS*/
		top: 165rpx;
		/*#endif*/
		/*#ifdef H5*/
		top: 110rpx;
		/*#endif*/
		left: 0;
		z-index: 1;

	}

	.lbtitle {
		display: inline-block;
		text-align: center;
		width: 750rpx;
		height: 80rpx;
		font-size: 35rpx;
		font-weight: 700;
		line-height: 70rpx;
		font-size: 18px;
		color: #ffffff;
		background-color: rgba(0, 0, 0, 0.2);
		position: absolute;
		top: 275rpx;
		left: 0rpx;
		z-index: 99;
	}

	.tab {
		display: inline-block;
		width: 100rpx;
		text-align: center;
	}

	.tab>text:nth-child(1) {
		color: #5F5E5E;
		font-size: 35rpx;
		font-weight: 700;
		display: block;
		margin-bottom: 2rpx;
	}

	.tabs {
		display: inline-block;
		width: 100rpx;
		font-size: 35rpx;
		text-align: center;
		margin-top: 10rpx;
	}

	.tabs>text {
		background-image: linear-gradient(to right, pink, hotpink);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		display: block;
	}

	.tabg {
		width: 69rpx;
		height: 10rpx;
		background-color: hotpink;
		border-radius: 100px;
		position: absolute;
		bottom: 0rpx;
		transition: left .5s;
	}

	.vodimg {
		padding: 0 5rpx;
		width: 220rpx;
		height: 280rpx;
		border-radius: 10rpx 10rpx 10rpx 10rpx;
	}

	.listv {
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 20rpx;
	}

	.list {
		position: relative;
		z-index:5;
		border-radius: 5rpx;
		width: 230rpx;
		margin-bottom: 20rpx;
	}

	.list>image {
		width: 230rpx;
		height: 300rpx;
		border-radius: 8rpx;
	}

	.title {
		color: #FFF;
		font-size: 25rpx;
		font-weight: 700;
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

	.lbvodname {
		color: #FFF;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		opacity: .7;
	}

	.listimg {
		width: 715rpx;
		height: 400rpx;
		align-items: center;
		justify-content: center;
		margin-left: 20rpx;
		border-radius: 8rpx;
	}

	.tag {
		border-radius: 20rpx 0 20rpx 0;
		border: 2rpx solid #ff3565;
		background-color: #ff3565;
		margin-top: 15rpx;
		color: #FFF;
		display: inline-block;
		text-align: center;
		position: absolute;
		left: 56%;
		z-index: 10;
		margin-top: 0;
		font-size: 20rpx;
		padding: 10rpx 10rpx;
	}

	.tagtime {
		border-radius: 20rpx 0 20rpx 0;
		border: 2rpx solid #ff3565;
		background-color: #ff3565;
		margin-top: 15rpx;
		color: #FFF;
		display: inline-block;
		text-align: center;
		position: absolute;
		left: 50.4%;
		z-index: 10;
		margin-top: 0;
		font-size: 20rpx;
		padding: 10rpx 10rpx;
	}
    .viewbottom{
		width: 100%;
		border-radius:  0  0 15rpx 15rpx;
		background: linear-gradient(to bottom,rgba(0,0,0,0.0),rgba(0,0,0,0.1),rgba(0,0,0,0.2),rgba(0,0,0,0.4),rgba(0,0,0,0.6),rgba(0,0,0,8));
		color: #FFF;
		display: inline-block;
		text-align: center;
		position: absolute;
		left: 0;
		top:72%;
		z-index: 10;
		font-size: 20rpx;
		padding: 10rpx 10rpx;
	}
	.viewbottom>text{
		margin-left: 10rpx;
	}
	.ztitle {
		color: #FFF;
		font-size: 20rpx;
		font-weight: 400;
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

	.zvodimg {
		padding: 0 5rpx;
		width: 170rpx;
		height: 200rpx;
		border-radius: 10rpx 10rpx 10rpx 10rpx;
	}

	.ztagtime {
		border-radius: 20rpx 0 20rpx 0;
		border: 2rpx solid #A142FF;
		background-color: #A142FF;
		margin-top: 15rpx;
		color: #FFF;
		display: inline-block;
		text-align: center;
		position: absolute;
		left: 41%;
		z-index: 10;
		margin-top: 0;
		font-size: 18rpx;
		padding: 6rpx 6rpx;
	}

	

	.load {

		opacity: 0;
		transition: opacity .3s;
	}

	.null {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
	}
</style>