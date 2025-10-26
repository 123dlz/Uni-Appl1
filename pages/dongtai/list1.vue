<template>
	<view>
		<view class="top-bg">
			<view class="search">
				<view @tap="search" class="inputs iconfont">&#xe620; 输入关键词搜索...</view>
			</view>
			<view class="row icotap" >
				<text @tap="dtsc" class="aa1 iconfont">&#xe703;</text>
				<text @tap="add" class="aa2 iconfont">&#xe66c;</text>
			</view>

			<view>
				<scroll-view :scroll-x="true" class="scroll-view " >
					<view v-for="(item,index) in tab" class="tab" :id="'t' + index" @tap="tabtap(index)">
						<text>{{item}}</text>
					</view>
					<text class="tabg" :style="tabgclass"></text>
				</scroll-view>
			</view>
		</view>
		<view class="listtop">
			<view class="list donghua" v-for="(item,index) in list" :key="item.id" @tap="play(item)">
				<view class="user">
					<view class="row">
						<image class="userimg" :src="url+item.user.avatar"></image>
						<view style="margin-top:40rpx;">
							<text class="username">{{item.user.name}}</text>
							<text class="ftime">发布于:{{item.addtime | formatDate}}</text>
						</view>
					</view>
					<view v-if="item.money==0" class="live" style="color: #ff7efa;">
						<text style="padding-top: 20rpx;height: 20rpx;">免费观看</text>
					</view>
					<view v-if="item.money!=0" class="lives" style="color: #fff;">
						<text style="padding-top: 20rpx;">付费{{item.money}}个钻石</text>
					</view>

				</view>

				<view style="margin-top:10rpx;">
					<view class="vinfo">{{item.info}}</view>
				</view>

				<view>
					<image class="listimg" :src="url+item.img"></image>
				</view>


				<!--获取点赞、评论开始-->
				<view class="row" style="margin: 20rpx;height: 80rpx;margin-top: 10rpx;">

					<view style="margin: 40rpx;">
						<image style="width: 40rpx;height: 40rpx;top: 10rpx;" src="../../static/font/zana.png"></image>
						<text style="font-size: 30rpx;color: #777777;">{{item.dianzan}}</text>
					</view>

					<view style="margin: 40rpx;">
						<image style="width: 40rpx;height: 40rpx;top: 10rpx;" src="../../static/font/sca.png"></image>
						<text style="font-size:30rpx;color: #777777;">{{item.sc}}</text>
					</view>

					<view style="margin: 40rpx;">
						<image style="width:40rpx;height:40rpx;top: 10rpx;" src="../../static/font/pl.png"></image>
						<text style="font-size: 30rpx;color: #777777;">{{item.plnum}}</text>
					</view>

					<view style="margin: 40rpx;margin-top: 50rpx;">
						<text style="color: #777777;font-size: 45rpx;" class="iconfont">&#xe64b;</text>
						<text style="font-size: 30rpx;color: #777777;">{{item.jilu}}</text>
					</view>

				</view>

				<!--点赞、评论结束-->

				<view class="fenge"></view>
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
				newinidex: 0,
				tabgclass: {},
				load: false,
				list: [],

			}
		},
		computed: {
			user() {
				return this.$store.state.userinfo;
			}
		},
		onLoad(data) {
			if (data.index != null) this.newinidex = Number(data.index);
			this.GetJson(this.ip + 'setapp.php', 'POST', {}, e => {
				this.tab = e.dtlist
				this.atitle = e.atitle
			})
		},
		onReady() {
			this.tabtap(this.newinidex);
			uni.$on('setorderstate', e => {
				for (let i in this.list) {
					if (this.list[i].id == e.id) {
						if (this.newinidex == 0 || this.newinidex == e.stat) {
							this.list[i].state = e.stat;
						} else {
							this.list.splice(i, 1);
						}
						break;
					}
				}
			})
			uni.$on('sertabindex', e => {
				this.tabtap(e);
			})
		},
		onUnload() {
			uni.$off('setorderstate');
			uni.$off('sertabindex');
		},
		filters: {
			//将时间转换成几天前，几个月前，几小时前等
			formatDate: function(datetime) {
				var dateTimeStamp = datetime * 1000;
				var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
				var hour = minute * 60;
				var day = hour * 24;
				var week = day * 7;
				var halfamonth = day * 15;
				var month = day * 30;
				var now = new Date().getTime(); //获取当前时间毫秒
				var diffValue = now - dateTimeStamp; //时间差

				if (diffValue < 0) {
					console.log("diffValue<0", datetime, dateTimeStamp, now, diffValue);
					return '刚刚';
				}
				var minC = diffValue / minute; //计算时间差的分，时，天，周，月
				var hourC = diffValue / hour;
				var dayC = diffValue / day;
				var weekC = diffValue / week;
				var monthC = diffValue / month;
				var result = "2";
				if (monthC >= 1 && monthC <= 3) {
					result = " " + parseInt(monthC) + "月前"
				} else if (weekC >= 1 && weekC <= 3) {
					result = " " + parseInt(weekC) + "周前"
				} else if (dayC >= 1 && dayC <= 6) {
					result = " " + parseInt(dayC) + "天前"
				} else if (hourC >= 1 && hourC <= 23) {
					result = " " + parseInt(hourC) + "小时前"
				} else if (minC >= 1 && minC <= 59) {
					result = " " + parseInt(minC) + "分钟前"
				} else if (diffValue >= 0 && diffValue <= minute) {
					result = "刚刚"
				} else {
					var datetime = new Date();
					datetime.setTime(dateTimeStamp);
					var Nyear = datetime.getFullYear(); {}
					var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() +
						1;
					var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
					var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
					var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
					var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
					result = Nyear + "-" + Nmonth + "-" + Ndate
				}
				return result;
			}

		},
		methods: {
			tabtap(index) {
				this.newinidex = index;
				setTimeout(() => {
				    uni.createSelectorQuery().in(this).selectAll('#t' + index + ', .scroll-view').fields({
				    	size: true,
				    	scrollOffset: true,
				    	rect: true
				    }, e => {
				    	this.tabgclass = {
				    		left: (e[1].width - uni.upx2px(69)) / 2 + e[1].left + e[0].scrollLeft + 'px'
				    	};
				    }).exec();
				}, 300);
				this.getdata(true);
			},
			getdata(is) {
				if (is === true) this.list = [];
				this.load = true;
				let sign = this.md5(this.newinidex + this.user.token);
				this.GetJson(this.ip + 'dtlist.php', 'POST', {
					type: this.newinidex,
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
			search() {
				uni.navigateTo({
					url: '../sou/dtso',
					animationType: 'fade-in'
				})
			},
			dtsc() {
				uni.navigateTo({
					url: 'dtsc',
					animationType: 'fade-in'
				})
			},
			add() {
				uni.navigateTo({
					url: '../add/index'
				})
			},
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
						'&gz=' + item.gz +
						'&liwu=' + item.liwus +
						'&code=' + item.code
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

	
	.vinfo {
		color:#a3a3a3;
		margin: 20rpx;
		font-size: 30rpx;
	}

	.listimg {
		width: 715rpx;
		height: 400rpx;
		align-items: center;
		justify-content: center;
		margin-left: 20rpx;
		border-radius:8rpx;
		box-shadow: 5px 10px 10px rgba(0, 0, 0, .5);
	}

	.sou {
		margin: 22rpx;
		height: 50rpx;
		width: 50rpx;
		margin-left: 40rpx;
		margin-top: 8rpx;
	}

    .icotap{
		/* #ifdef APP-PLUS */
		margin-top: 12rpx;
		/* #endif */
		/* #ifdef H5 */
		margin-top: -58rpx;
		/* #endif */
		
	}
	
	.inputs {
		margin-top: 13rpx;
		margin-left: 30rpx;
		color: #555555;
	}

	.aa1 {
		margin-left: 580rpx;
		margin-top: 80rpx;
		color: #555555;
		font-size: 60rpx;
	}

	.aa2 {
		margin-left: 20rpx;
		margin-top: 85rpx;
		color: #555555;
		font-size: 60rpx;
	}

	.top-bg {
		background: #111111;
		width: 750rpx;
		/* #ifdef APP-PLUS */
		height: 240rpx;
		/* #endif */
		/* #ifdef H5 */
		height: 180rpx;
		/* #endif */
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 2;
	}

	.ftime {
		color: #555555;
		font-size: 30rpx;
		font-weight: 400;
		display: block;
		padding-left: 15rpx;
	}

	.live {
		border-radius: 10rpx;
		border: 2rpx solid #ff7efa;
		margin-top: 15rpx;
		color: #ff7efa;
		display: inline-block;
		text-align: center;
		color: #000;
		position: absolute;
		left: 77%;
		z-index: 1;
		margin-top: 30rpx;
		font-size: 28rpx;
		padding: 8rpx 15rpx;
	}

	.lives {
		border-radius: 10rpx;
		border: 2rpx solid #ff3565;
		background-color: #ff3565;
		margin-top: 15rpx;
		color: #FFF;
		display: inline-block;
		text-align: center;
		color: #000;
		position: absolute;
		left: 77%;
		z-index: 1;
		margin-top: 30rpx;
		font-size: 20rpx;
		padding: 15rpx 15rpx;
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

	.search {
		background-color: rgba(255,255,255,0.05);
		border-radius: 50rpx;
		margin: 20rpx;
		height: 70rpx;
		width: 550rpx;
		/* #ifdef APP-PLUS */
		margin-top: 90rpx;
		/* #endif */
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 1;
	}

	.scroll-view {
		/* #ifdef H5 */
		margin-top: -70rpx;
		/* #endif */
		width: 750rpx;
		white-space: nowrap;
		height: 70rpx;
		position: fixed;
		top: 165rpx;
		left: 0;
		z-index: 1;

	}

	.tab {
		display: inline-block;
		width: 100rpx;
		text-align: center;
		margin-top: 19rpx;
	}

	.tab>text:nth-child(1) {
		color: #555555;
		font-size: 31rpx;
		font-weight: 700;
		display: block;
		margin-bottom: 2rpx;
	}

	.tabg {
		width: 69rpx;
		height: 10rpx;
		background-color: #fc7e7f;
		border-radius: 100px;
		position: absolute;
		bottom: 0rpx;
		transition: left .5s;
	}
    .listtop{
		/* #ifdef H5 */
		margin-top: 170rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		margin-top: 240rpx;
		/* #endif */
	}
	.load {

		opacity: 0;
		transition: opacity .3s;
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
		top: 400rpx;
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
		background-color: #ff2600;
		border-radius: 20rpx;
		position: absolute;
		top: 400rpx;
		left: 60%;
		z-index: 1;
	}

	.null {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
	}

	/* 分界线 */
	.dixian {
		margin: 30rpx;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		color: #dfdedf;
	}

	.dixian__content {
		font-size: 26rpx;
		color: #dfdedf;
		padding: 0 10px;
		position: relative;
		z-index: 101;
		background-color: #f7f7f7;
	}

	.dixian__line {
		background-color: #dfdedf;
		height: 1px;
		width: 99%;
		position: absolute;
		z-index: 100;
		top: 50%;
		left: 0;
		transform: translateY(50%);
	}

	.fenge {
		align-items: center;
		justify-content: center;
		position: relative;
		border-radius: 1rpx 0rpx 0rpx 1rpx;
		width: 750rpx;
		color: #3c4374;
		background-color: #151515;
		height: 20rpx;
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
		top: 400rpx;
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
		background-color: #ff2600;
		border-radius: 20rpx;
		position: absolute;
		top: 400rpx;
		left: 60%;
		z-index: 1;
	}

	.null {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
	}

	/* 分界线 */
	.dixian {
		margin: 30rpx;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		color: #dfdedf;
	}

	.dixian__content {
		font-size: 26rpx;
		color: #dfdedf;
		padding: 0 10px;
		position: relative;
		z-index: 101;
		background-color: #f7f7f7;
	}

	.dixian__line {
		background-color: #dfdedf;
		height: 1px;
		width: 99%;
		position: absolute;
		z-index: 100;
		top: 50%;
		left: 0;
		transform: translateY(50%);
	}
</style>