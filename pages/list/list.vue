<template>
	<view>
		<view class="topbg">
			<view class="htop">
				<text class="title fonts">{{atitle}} | 今日更新:<font style="color: #ff3939;">{{movdata}}</font>部</text>
			</view>
			<view>
				<view @tap="search" class="search">
					<view class="soso iconfont">&#xe620; 搜索你喜欢的...</view>
				</view>

			</view>
			<scroll-view :scroll-x="true" class="scroll-view">
				<view v-for="(item,index) in tab" class="tab" :id="'t' + index" @tap="tabtap(index)">
					<view @tap="ts(item)" class="tab" :class="type == item ? 'tabs' : ''">
						<text>{{item}}</text>
					</view>
				</view>
				<text class="tabg" :style="tabgclass"></text>
			</scroll-view>
		</view>
		<view class="listv row">
			<view class="list donghua" v-for="(item,index) in list" :key="item.id" @tap="play(item.vod_id)">
				<image :src="item.vod_pic" mode="aspectFill"></image>
				<view style="margin: 10rpx;">
					<view v-if="item.vod_points_play==0" class="mianfei">免费观看</view>
					<view v-if="item.vod_points_play!=0" class="shoufei">{{item.vod_points_play}}个钻石</view>
					<view v-if="item.vod_points_down!=0" class="vip">会员专属</view>
					<text class="tagtag font">{{item.vod_name}}</text>
				</view>
				<view style="margin-top:-20rpx;">
					<text class="hot">{{item.vod_class}}</text>
					<text class="vodtime">更新时间:{{gettime(item.vod_time_add,'yyyy-MM-dd')}}</text>
				</view>
			</view>
		</view>
		<null class="null" v-if="!load && list.length == 0" info="还没有内容哦!"></null>
		<load class="load" :style="{opacity:load ? '1' : '0'}"></load>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tab: [],
				atitle: '',
				so: '',
				movdata: '',
				zdata: '',
				newinidex: 0,
				tabgclass: {},
				load: false,
				list: [],
				type: '',

			}
		},
		computed: {
			user() {
				return this.$store.state.userinfo;
			},
			vip() {
				return this.$store.state.vip.vip;
			}
		},
		onLoad(data) {
			// #ifdef H5
			uni.getStorage({
				key:'userinfo',
				success: (es) => {
					let sign = this.md5(es.data.token);
					this.GetJson(this.ip + 'userinfo.php','POST',{
						token:es.data.token,
						sign:sign
					},res=>{
						this.$store.state.userinfo = res.userinfo;
						this.$store.state.vip.vip = res.vip;
						if(res.code == 405 || res.userinfo == null || res.userinfo == ''){
							uni.removeStorage({key:'ulogin'})
							uni.reLaunch({url:'../login/login'})
						}
					})
				}
			})
			//#endif
			
			this.GetJson(this.ip + 'setapp.php', 'POST', {}, e => {
				this.tab = e.tab
				this.atitle = e.atitle
				this.movdata = e.movdata
				this.zdata = e.zdata
			})
			if (data.index == null) this.newinidex = Number(data.index);
		},
		onReady() {
			
			this.tabtap(this.newinidex);
			uni.$on('sertabindex', e => {
				this.tabtap(e);
			})
		},
		onUnload() {
			
		},
		methods: {
			sexplay() {
				uni.navigateTo({
					url: 'index'
				})
			},
			ts(idex) {
				this.$set(this, 'type', idex)
			},
			tabtap(index) {
				this.newinidex = index;
				uni.createSelectorQuery().in(this).selectAll('#t' + index + ', .scroll-view').fields({
					size: true,
					scrollOffset: true,
					rect: true
				}, e => {
					let widths = e.length==1?'67':e[1].width;
					let lefts = e.length==1?'0':e[1].left;
					this.tabgclass = {
						left: (widths - uni.upx2px(130)) / 2 + lefts + e[0].scrollLeft + 'px'
					};
				}).exec();
				
				this.getdata(true);
			},
			getdata(is) {
				if (is === true) this.list = [];
				this.load = true;
				let sign = this.md5(this.newinidex + this.user.token);
				this.GetJson(this.ip + 'list.php', 'POST', {
					type: this.newinidex,
					token: this.user.token,
					num: this.list.length,
					sign: sign
				}, e => {
					//console.log(e.list)
					this.load = false;
					uni.stopPullDownRefresh();
					if (this.isdata(e)) {
						this.list = [...this.list, ...e.list];
					}
				})
			},
			search() {
				uni.navigateTo({
					url: '../sou/sou?type=1',
					animationType: 'fade-in'
				})
			},
			play(id) {
				uni.navigateTo({
					url: '../play/play?id=' + id,
					animationType: 'zoom-fade-out',
					animationDuration: 200
				})
			}
		},

		onNavigationBarButtonTap(e) {
			console.log(e);
			if (e.index < 2) {
				uni.navigateTo({
					url: '../wode/record/record',
					animationType: 'fade-in'
				})

			} else {
				uni.navigateTo({
					url: '../wode/record/record',
					animationType: 'fade-in'
				})
			}
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
		background-color: #111111;
	}
    .topbg {
		/* #ifdef APP-PLUS */
		background: linear-gradient(45deg,#121525,#121525,#121525);
		height: 150;
		width: 750rpx;
		border-radius: 0rpx;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 5;
		/*#endif*/
	}
	.htop{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 6;
		height: 260rpx;background: linear-gradient(45deg,#121525,#121525,#121525);
	}
	.title {
		font-size: 35rpx;
		font-weight: 600;
		margin: 20rpx;
		/* #ifdef H5 */
		line-height: 90rpx;
		/*#endif*/
		/* #ifdef APP-PLUS */
		line-height: 250rpx;
		/*#endif*/
	}
.search {
		background-color: rgba(38, 43, 75, 0.5);
		border-radius: 50rpx;
		margin: 20rpx;
		height: 70rpx;
		margin-top: -80rpx;
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		top: 170rpx;
		/*#endif*/
		/* #ifdef APP-PLUS */
		top: 250rpx;
		/*#endif*/
		z-index: 7;

	}
	.aimg {
		margin: 22rpx;
		height: 50rpx;
		width: 50rpx;
		margin-left: 40rpx;
		margin-top: 8rpx;
	}

	.soso {
		margin-top: 13rpx;
		margin-left:30rpx;
		color: #525298;
	}

	

	.scroll-view {
		width: 750rpx;
		white-space: nowrap;
		height: 80rpx;
		position: fixed;
		/* #ifdef H5 */
		top: 170rpx;
		/*#endif*/
		/* #ifdef APP-PLUS */
		background: linear-gradient(45deg,#121525,#121525,#121525);
		top: 250rpx;
		/*#endif*/
		left: 0;
		z-index: 8;
		
	}

	.tab {
		display: inline-block;
		width: 140rpx;
		text-align: center;
		margin-top: 10rpx;
	}

	.tab>text {
		background-image: linear-gradient(to right,#D047B7,#FE1978);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		font-size: 30rpx;
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
		background-image: linear-gradient(to right,#931BFC,#DC10B6);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		font-weight: 800;
		font-size: 35rpx;
		color: #FFFFFF;
		display: block;
		margin-bottom: 10rpx;
	}

	.tabg {
		width: 120rpx;
		height: 10rpx;
		background-color: #5c34ac;
		border-radius: 100px;
		position: absolute;
		bottom: 0rpx;
		transition: left .5s;
	}

	.load {

		opacity: 0;
		transition: opacity .3s;
	}

	.listv {
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 20rpx;
		/* #ifdef H5 */
		padding-top:260rpx;
		/*#endif*/
		/* #ifdef APP-PLUS */
		padding-top:350rpx;
		/*#endif*/
	}

	.list {
		border-radius: 20rpx;
		position: relative;
		background-color: #222222;
		width: 347rpx;
		margin-bottom: 30rpx;
		animation: opacitys .1s;
	}

	.list>image {
		width: 347rpx;
		height: 450rpx;
		border-radius: 8rpx 8rpx 0 0;
		background-color: #22263f;
	}

	.list>view>image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 100px;
		margin-right: 10rpx;
		background-color: #22263f;
		;
	}

	.font {
		background-image: linear-gradient(to right, #d71af9, #f9c71a);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.fonts {
		background-image: linear-gradient(to right, #d71af9, #f9c71a);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.tagtag {
		color: #000000;
		font-weight: 500;
		font-size: 25rpx;
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
		margin: 8rpx;
		font-size: 23rpx;
		line-height: 70rpx;
		border-radius: 10rpx;
		background-image: linear-gradient(to right, #5a18d1, #9B63FF);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-top: 10rpx;
	}

	.times {
		float: right;
		font-size: 23rpx;
		background-image: linear-gradient(to right, #5a18d1, #9B63FF);
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

	.vip {
		display: inline-block;
		width: auto;
		text-align: center;
		min-width: 20rpx;
		height: 40rpx;
		line-height: 40rpx;
		padding: 0 10rpx;
		font-size: 28rpx;
		color: #ffffff;
		background-color: #fe4c93;
		border-radius: 20rpx;
		position: absolute;
		top: 10rpx;
		left: 60%;
		z-index: 1;
	}
	.vodtime {
		display: inline-block;
		width: 100%;
		text-align: left;
		min-width: 100rpx;
		height: 40rpx;
		line-height: 40rpx;
		padding: 0 10rpx;
		font-size: 25rpx;
		color:  rgba(255,255,255,0.6);
		position: absolute;
		top: 412rpx;
		left: 0;
		background-color: rgba(0,0,0,0.4);
		z-index: 1;
	}
</style>