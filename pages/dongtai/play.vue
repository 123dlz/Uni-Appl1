<template>
	<view>
		<!-- #ifndef H5 -->
		<view class="topindex"></view>
		<!-- #endif -->
		<view v-if="!videostate" >
			<view  v-if="money != 0"  class="buys">
				<view class="tishiinfo">
					<view class="ismoney">本片售价<font style="color: #FFFF00;">{{money}}</font>个钻石，需要购买才能观看</view>
					<view style="flex-direction: column;align-items: center;margin-top: 50rpx;">
						<text @tap="goumai" class="ico iconfont" style="font-size: 30rpx;color: #FFFFFF;">付费购买</text>
						<text @tap="back" class="ico iconfont" style="font-size: 30rpx;color: #FFFFFF;margin-left: 25rpx;">暂不购买</text>
					</view>
				</view>
				
			</view>
		</view>

		<view v-if="videostate" class="videoview">
			<video v-if="djs==0 || adstate==2"
			id="myVideo" 
			class="video" 
			object-fit="fill"
			:src="urls" 
			:autoplay="true" 
			:direction="90"
			@error="videoerr" 
			play-strategy="2" 
			:loop="true" 
			:controls="true" 
			@timeupdate="getvodtime"
			:danmu-list="dmlist"
			:danmu-btn='false' 
			:enable-danmu='true'
			:show-play-btn="true"
			:show-fullscreen-btn="true" 
			:show-center-play-btn="true" 
			:auto-pause-if-open-native="true" 
			:enable-progress-gesture="true" 
			:enable-play-gesture="true" 
			:vslide-gesture-in-fullscreen="false" 
			:vslide-gesture="true" 
			:style="{height:height + 'px'}">
			<cover-view class="beisu" @tap="showSwitchRate">倍速x{{ currentRate }}</cover-view>
			</video> 
			<view v-if="adstate==1" style="position: fixed;left: 0;right: 0;top: 80rpx;z-index: 1;">
				<view style="width: 750rpx;height: 418rpx;background-color: #000000;" v-if="djs!=0">
					<view v-if="adtype==1" @tap="imgurls">
						<image style="width: 750rpx;height: 418rpx;" :src="adimg" mode="aspectFill"></image>
						<text class="imgtext">{{djs}}秒后播放视频 <font style="color: #FFFF00;"> 开通VIP去广告</font></text>
					</view>
					<view v-if="adtype==2" @tap="imgurls">
						<video v-if="adtype==2" class="video" :src="advideo" :autoplay="true" :loop="true"
							:controls="false" :auto-pause-if-open-native="true" :style="{height:height + 'px'}">
						</video>
						<cover-view class="videotext">{{djs}}秒后播放视频 开通VIP去广告</cover-view>
					</view>
				</view>
			</view>
			
			<view class="tabbar row" style="height: 90rpx;margin-top: -10rpx;" >
				<text @tap="tabbartap(1)" :class="tabbar == 1 ? 'newtabbar' : ''">详情</text>
				<text @tap="tabbartap(2)" :class="tabbar == 2 ? 'newtabbar' : ''">评论(<font style="color:hotpink;">
						{{Comment_num}}</font>)</text>
				<text @tap="tabbartap(3)" :class="tabbar == 3 ? 'newtabbar' : ''">礼物(<font style="color:hotpink;">
						{{liwus}}</font>)</text>
			</view>
			
			
		</view>

		
		<!--#ifdef APP-PLUS-->
		  <view class="buttom row">
		  	<view @tap="Commenttap" style="background-color: #151515;height: 80rpx;width: 700rpx;pandding:0 15rpx;margin: 0 20rpx;border-radius: 15rpx;">
		  		<text style="font-size: 30rpx;color: #555555;line-height: 80rpx;padding: 0 20rpx;">发表一下你对这部影视的评论</text>
		  	</view>
		  </view>
		  <!--#endif-->
		  <!--#ifdef H5-->
		    <view class="buttom row">
		    	<view>
		    	  <textarea class="textarea" v-model="info" @confirm="addConmments(info)" type="text" confirm-type="send" placeholder="输入您想要发表的内容。" />
		    	</view>
		        <text class="btns" @tap="addConmments(info)">发布</text>
		    </view>
		<!--#endif-->
        <view >
        	<nk-popup-input title="发送弹幕"
        	titleColor background="#1F233B"
        	titleColor="hotpink"
        	cancelColor="#5D6AB8"
        	confirmColor="hotpink"
        	v-model="Danmu" 
        	@confirm="confirm" 
        	:maxlength="100" 
        	@cancel="cancel">
        	</nk-popup-input>
        </view>
        <view>
        	<nk-popup-input title="发布评论"
        	  titleColor background="#111111"
			  titleColor="#707688"
			  cancelColor="#707688"
			  confirmColor="#FC5A8B"
        	  v-model="Comment" 
        	  @confirm="confirm" 
        	  :maxlength="100" 
        	  @cancel="cancel">
        	</nk-popup-input>
        </view>
		<view class="main" :style="Is_ios=='ios'?'margin-top: 440rpx;position: fixed;left: 0;right: 0;top: 0;z-index: 2;':'margin-top: 470rpx;position: fixed;left: 0;right: 0;top: 0;z-index: 2;'" >
			<view class="multi-list rate" :class="{ active: rateShow }">
				<view v-for="(item, index) in ['0.5', '0.8', '1.0', '1.25', '1.5']" :key="index" class="multi-item rate"
					:data-rate="item" @tap="switchRate" :class="{ active: item == currentRate }">
					{{ item }}
				</view>
			</view>

		</view>
		
		<view class="top donghua" v-if="tabbar == 1" >
			<view  :style="Is_ios=='ios'?'margin-top: 520rpx;':'margin: 20rpx;margin-top:560rpx;'">
				<view style="padding-top: 40rpx;margin-top: 15rpx;">
					<image @tap="userpage" class="touximg" :src="url+toux"></image>
					<view style="float: right;margin-top: 10rpx; ">
						<!--#ifdef APP-PLUS-->
						<text v-if="!isdown && videostate" @tap="down" class="iconfont downa">&#xe63d;</text>
						<text v-if="isdown" class="iconfont downb">{{jindu}}%</text>
						<text @tap="dashang" class="iconfont dashang">&#xe66b;</text>
						<!--#endif -->
						<text @tap="shoucang" v-if="!isfollows" class="iconfont shouca">&#xe643;</text>
						<text @tap="shoucang" v-if="isfollows" class="iconfont shoucb">&#xe643;</text>
						<!--#ifdef APP-PLUS-->
						<text @tap="touping" class="iconfont toup">&#xe718;</text>
						<!--<text @click="Danmutap" class="iconfont danmus" >&#xe6a5;</text>-->  
						<!-- 关闭弹幕，这个板块的弹幕本来没打算加上去的，但想想其他两个板块都加了就顺带一起做上去好了，但不知道为啥不显示，也没时间整这些东西，没去排查。自行研究去把。请把:danmu-btn='false' 改为true -->
						<!--#endif -->
					</view>
				</view>

				<view style="margin-top: -85rpx;">
					<view style="margin-left: 90rpx;">
						<text class="username">{{username}}</text>
						<text @tap="guanzhu" v-if="!isfollowss" style="top: 20rpx; ">
							<font class="guanzhua">关注
							</font>
						</text>
						<text @tap="guanzhu" v-if="isfollowss" style="top: 20rpx; ">
							<font class="guanzhub">已关注
							</font>
						</text>
					</view>
					<view style="margin-top: -10rpx;margin-left: 75rpx;" class="row">
						<text class="fensi">粉丝<font style="color:#9B63FF">{{gz}}</font></text>
						<text class="fensi" style="margin-left:8rpx;">视频<font style="color:#9B63FF;">{{v}}</font></text>
					</view>
					<view style="padding-top: 20rpx;display: block;">
						<text class="infotext">{{infos}}</text>
					</view>
				</view>

				<view class="tagva row" style="font-size: 28rpx;margin-top: 20rpx;color: #555555;">
					发布时间:{{gettime(addtime,'yyyy-MM-dd hh:mm')}}
				</view>
			</view>
			<!--获取点赞、评论开始-->
			<view class="row" style="margin: 20rpx;">
				<view style="display: flex;">
					<text @tap="dianzans" v-if="isfollows" style="color: #555555;" class="iconfont">&#xec7f;</text>

					<text @tap="dianzans" class=" zans" style="color: #555555;">点赞数:<font style="color:hotpink">{{zan}}</font></text>
					<text class="iconfont zanico" style="color: #555555;">&#xe64b;</text>
					<text class="looknum" style="color: #555555;">观看次数:<font style="color:hotpink">{{jilu}}</font></text>
				</view>

			</view>
			<!--点赞、评论结束-->
			<view class="fenge"></view>
			<swiper class="swiper" :circular="true" :indicator-dots="true" :autoplay="true" :interval="3000"
				:duration="300">
				<swiper-item v-for="item in ad" class="swiper-item" @tap="adtap(item)">
					<image :src="url+item.img" mode="aspectFill"></image>
				</swiper-item>
			</swiper>

			<view class="lista" style="margin-top:0rpx" v-for="(item,inde)  in CommentList" :key="inde.id">
				<view class="user">
					<image :src="url + item.user.avatar" mode="aspectFill"></image>
				</view>
				<view class="names">
					<text class="taga">{{item.user.name}}</text>
				</view>
				<view>
					<text class="shijian">{{gettime(item.time,'yyyy-MM-dd hh:mm')}}</text>
					<view>
						<view class="plinfo" style="margin-top:2rpx">
							<text class="info" style="font-size: 28rpx;">{{item.info}}</text>
						</view>
					</view>
				</view>
			</view>
			<view>
				<view style="height: 200rpx;"></view>
				<null v-if="CommentList.length == 0 && !load" info="还没有评论,来打个招呼吧!"></null>
			</view>
		</view>

		<!--评论-->
		<view class="donghua" v-if="tabbar == 2" style="margin-top: 550rpx;">
			<view class="plnum">全部评论（{{Comment_num}}）</view>
			<view>
				<view class="pl">
					<view class="lista" style="margin-top:0rpx" v-for="(item,index) in CommentList" :key="index">
						
						<view class="user">
							<image :src="url + item.user.avatar" mode="aspectFill"></image>
						</view>
						<view class="names">
							<text class="taga ">{{item.user.name}}</text>
						</view>
						<view>
							<text class="shijian">{{gettime(item.time,'yyyy-MM-dd hh:mm')}}</text>
							<view>
								<view class="plinfo" style="margin-top:8rpx">

									<text class="info" style="font-size: 28rpx;">{{item.info}}</text>
								</view>
							</view>
						</view>
					</view>
					<view >
						<null style="margin-top: 250rpx;" v-if="CommentList.length == 0 && !load" info="还没有评论,来打个招呼吧!"></null>
					</view>
				</view>
			</view>
		</view>
		<!--评论-->
		
		<view class="donghua" v-show="tabbar == 3" style=" background-color: #111111;">
			<view style="height: 10rpx;color:#555555;font-size: 30rpx;margin-top:550rpx;margin-left: 20rpx;">{{liwu.length==0?'':'该视频收到的礼物'}}</view>
			<view style="margin-top: 50rpx;">
				<view class="liwu" v-for="item in liwu" :key="item.id">
					<view class="row v1">
						<image :src="url+item.users.avatar"></image>
						<view>
							<text class="fonts usersname">{{item.users.name}}</text>
							<text class="fonts" style="font-size:30rpx;">打赏礼物：<font class="res">{{item.gif.title}}
								</font></text>
							<text style="font-size: 28rpx;color: #444444;">{{gettime(item.time,'yyyy.MM.dd')}}</text>
						</view>
						<image :src="url + item.gif.img" mode=""></image>
					</view>
				</view>
				<load :style="{opacity:load ? '1' : '0'}"></load>
				<null  style="margin-top:180rpx;" class="null" v-if="!load && liwu.length == 0" info="该视频没有收到礼物"></null>
			</view>
		</view>
	</view>
	</view>
	</view>
	</view>
</template>

<script>
	let subNVue, subNVue2;
	var that
	export default {
		data() {
			return {
				videostate: false,
				rateShow: false, // 倍速浮层
				currentRate: 1.0, // 默认倍速
				vurl: '',
				imgurl: '',
				adstate: '',
				adtype: '',
				adtime: '',
				adimg: '',
				advideo: '',
				djs: '',
				urls: '',
				id: '',
				infos: '',
				toux: '',
				v: '',
				gz: '',
				liwus: '',
				username: '',
				Comment_num: '',
				zan: '',
				jilu: '',
				money: '',
				tabbar: 1,
				isplay: false,
				load: false,
				isfollows: false,
				isfollowss: false,
				isdianzan: false,
				isrecordss: false,
				height: 200,
				CommentList: [],
				ad: [],
				liwu: [],
				isdown: false,
				jindu: 0,
				videoContext: '',
				info:'',
				dmlist: [],
				danmuValue: '',
				Danmu:false,
				Comment:false,
				Is_ios:''
			}
		},
		created() {
			// 创建视频实例指向视频控件
			this.videoContext = uni.createVideoContext('myVideo');
		},
		mounted() {
			
		},
		computed: {
			vip() {
				return this.$store.state.vip;
			},
			user() {
				return this.$store.state.userinfo;
			}
		},
		onUnload() {
		},
		onLoad(item) {
			this.Is_ios = uni.getSystemInfoSync().platform;
			this.data = item
			this.id = item.id
			this.urls = item.url
			this.toux = item.toux
			this.v = item.v
			this.gz = item.gz
			this.liwus = item.liwu
			this.userid = item.userid
			this.username = item.username
			this.infos = item.infos
			this.money = item.money
			this.addtime = item.addtime
			this.jilus();
			this.dianzans();
			this.getpinglun();
			this.getliwu();
			this.GetJson(this.ip + 'Get_dt_danmu.php', 'POST', {
				type:'get',
				id:this.id
			}, e => {
				this.dmlist = e.dmlist;
				//console.log(e)
			})
			setTimeout( () => {this.getad()}, 500)
			if (this.userid != this.$store.state.userinfo.userid) {
				this.buy();
			} else {
				this.videostate = true;
				this.isplay = true;
			}

			this.GetJson(this.ip + 'setapp.php', 'GET', {}, e => {
				//console.log(e)
				if (this.isdata(e)) {
					this.advideo = e.advideo;
					this.adimg = e.adimg;
					this.adon = e.adon;
					this.adtype = e.adtype;
					this.adtime = e.adtime;
					this.adstate = e.adstate;
					this.imgurl = e.imgurl;
					this.vurl = e.vurl;
					if (e.adstate == '1' && this.$store.state.vip == 0) {
						let end = (new Date()).getTime() + Number(e.adtime);
						this.daojis(end, null)
						let initimes = setInterval(() => {
							this.daojis(end, initimes)
						}, 500)
					}
				}
			})
			uni.getStorage({
				key: 'maindata',
				success: (e) => {
					this.ad = e.data.ad;
					this.$nextTick(function() {
						plus.navigator.closeSplashscreen();
					})
				}
			})
			
            
		},

		onReady() {
			//#ifdef H5
			this.videoContext = uni.createVideoContext('myVideo', this);
			if (this.urls) {
				this.$nextTick(() => {
					this.videoContext.play()
				})
			}
			//#endif
			//#ifdef APP-PLUS
			uni.$emit('sendNum', {
				userid: this.userid,
				username: this.username,
				title: this.infos,
				vodid: this.id
			});
			subNVue = uni.getSubNVueById('gift');
          //#endif
		  
			let json = this.$store.state.follows;
			for (let i in json) {
				if (json[i].ruserid == this.id) {
					this.isfollows = true;
					break;
				}
			}
			let jsons = this.$store.state.followss;
			for (let s in jsons) {
				if (jsons[s].ruserid == this.userid) {
					this.isfollowss = true;
					break;
				}
			}
		},
		methods: {
			touping() {
				this.videoContext.pause();
				uni.navigateTo({
					url: '../play/dlna?name=' + this.infos + '&url=' + this.urls
				})
			},
			showSwitchRate(rate) {
				console.log('rateShow');
				this.rateShow = true;
			},
			// 切换倍速
			switchRate(e) {
				let rate = Number(e.currentTarget.dataset.rate);
				this.currentRate = rate;
				this.rateShow = false;
				this.videoContext.playbackRate(rate);
			},
			tabbartap(index) {
				this.tabbar = index;
			},
			back(){
				uni.navigateBack()
			},
			tabbartaps(index) {
				this.tabbars = index;
			},
			dashang(item) {
				subNVue.show('slide-in-bottom');
			},
			userpage() {
				uni.navigateTo({
					url: 'userpage?userid=' + this.userid + '&toux=' + this.toux + '&username=' + this.username
				})
				this.videoContext.pause(); //暂停
			},
			imgurls() {
				let url = this.imgurl
				if (plus.os.name == 'Android' || plus.os.name == 'iOS') {
					plus.runtime.openURL(url);
					return
				}
				uni.navigateTo({
					url: url
				})

			},
			vurls() {
				let url = this.vurl
				if (plus.os.name == 'Android' || plus.os.name == 'iOS') {
					plus.runtime.openURL(url);
					return
				}
				uni.navigateTo({
					url: url
				})

			},
			daojis(end, initimes) {
				let times = this.showtime(end);
				if (times === false) {
					if (initimes != null) clearInterval(initimes);
				} else {
					this.djs = times
				}
			},
			getad() {
				this.GetJson(this.ip + 'Get_ad.php', 'GET', {}, e => {
					this.ad = e.ad;
				})
			},
			adtap(item) {
				plus.runtime.openWeb(item.url);
			},
			shoucang() {
				let sign = this.md5(this.user.token + 'isfollows' + this.id + this.userid);
				this.GetJson(this.ip + 'setfollows.php', 'POST', {
					sign: sign,
					token: this.user.token,
					id: this.id,
					userid: this.userid,
					is: this.isfollows ? 'remov' : 'add'
				}, e => {
					console.log(e)
					if (this.isdata(e)) {
						if (this.isfollows) {
							let json = this.$store.state.follows;
							for (let i in json) {
								if (json[i].ruserid == this.id) {
									this.$store.state.follows.splice(i, 1);
									this.isfollows = false;
									this.showToast('已取消收藏')
									break;
								}
							}
						} else {
							let datas = JSON.parse(JSON.stringify(this.data));
							this.$store.state.follows.push({
								ruserid: datas.id
							});
							this.isfollows = true;
							this.showToast('已加入收藏')
						}
					}
				})
			},
			down() {
				let _this = this;
				this.isdown = true;
				uni.showLoading({
					title: '正在下载...',
				})
				const downloadTask = uni.downloadFile({
					url: this.urls,
					success: res => {
						if (res.statusCode === 200) {
							// 视频保存到手机相册
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									uni.showToast({
										title: '已保存到相册',
										icon: 'none'
									});
									uni.hideLoading()
									_this.isdown = false;
								},
								fail: function() {
									uni.hideLoading();
									uni.showToast({
										title: '保存失败，请稍后重试',
										icon: 'none'
									});
								}
							});
						}
					}
				});
				// 下载进度监听
				downloadTask.onProgressUpdate(res => {
					this.jindu = res.progress;
				});

			},
			guanzhu() {
				let sign = this.md5(this.user.token + 'isfollowss' + this.userid);
				this.GetJson(this.ip + 'setfollowss.php', 'POST', {
					sign: sign,
					token: this.user.token,
					id: this.userid,
					is: this.isfollowss ? 'remov' : 'add'
				}, e => {
					console.log(e)
					if (this.isdata(e)) {
						if (this.isfollowss) {
							let jsons = this.$store.state.followss;
							for (let s in jsons) {
								if (jsons[s].ruserid == this.userid) {
									this.$store.state.followss.splice(s, 1);
									this.isfollowss = false;
									this.showToast('已取消关注')
									break;
								}
							}
						} else {
							this.$store.state.followss.push({
								ruserid: this.userid
							});
							this.isfollowss = true;
							this.showToast('已关注')
						}
					}
				})
			},
			dianzans() {
				this.load = true;
				let sign = this.md5(this.$store.state.userinfo.token + this.id);
				this.GetJson(this.ip + 'dianzan.php', 'POST', {
					sign: sign,
					token: this.$store.state.userinfo.token,
					id: this.id
				}, e => {
					this.load = false;
					if (this.isdata(e)) {
						//this.showToast('已赞');
						this.zan = e.zan
					}
				})
			},
			jilus() {
				this.load = true;
				let sign = this.md5(this.$store.state.userinfo.token + this.id);
				this.GetJson(this.ip + 'dtjilu.php', 'POST', {
					sign: sign,
					token: this.$store.state.userinfo.token,
					id: this.id
				}, e => {
					this.load = false;
					if (this.isdata(e)) {
						this.jilu = e.jilus
					}
				})
			},
			getpinglun(is) {
				if (is === true) this.CommentList = [];
				this.load = true;
				let sign = this.md5(this.$store.state.userinfo.token);
				this.GetJson(this.ip + 'Get_Dt_comment.php', 'POST', {
					sign: sign,
					type:'get',
					num: this.CommentList.length,
					token: this.$store.state.userinfo.token,
					id: this.id,
				}, e => {
					this.load = false;
					uni.stopPullDownRefresh();
					if (this.isdata(e)) {
						this.CommentList = [...this.CommentList, ...e.list];
						this.Comment_num = e.pnum;
						this.Invitation = e.Invitation;
					}
				})
			},
			getliwu(up) {
				if (up === true) this.liwu = [];
				this.load = true;
				let sign = this.md5(this.user.token + 'giftc');
				this.GetJson(this.ip + 'vodliwu.php', 'POST', {
					token: this.user.token,
					sign: sign,
					id: this.id,
					num: this.liwu.length
				}, e => {
					//console.log(e);
					this.load = false;
					uni.stopPullDownRefresh();
					if (this.isdata(e)) {
						this.liwu = [...this.liwu, ...e.liwu];
					}
				})
			},
			buy() {
				let sign = this.md5(this.user.token + 'vod_identify');
				this.GetJson(this.ip + 'vod_identify.php', 'POST', {
					sign: sign,
					token: this.user.token,
					vod_id: this.id,
					userid: this.$store.state.userinfo.userid,
					type: 2
				}, e => {
					console.log(e);
					if (e.code == 200) {
						this.showToast(e.msg);
						this.$nextTick(() => {
							this.videoContext.play()
						})
						this.videostate = true;
						this.isplay = true;
					} else {
						//this.goumai();//进入付费视频自动弹出购买窗口
						if (this.money == 0) {
							this.videostate = true;
							this.isplay = true;
						}	
						
					}

				})
			},
			goumai() {
				let _this = this;
				if (this.money != 0) {
					uni.showModal({
						title: '提示',
						cancelText: "暂不付费",
						confirmText: "付费观看",
						confirmColor: '#f55850',
						cancelColor: '#39B54A',
						content: '本视频需要扣除' + _this.money + '个钻石才能观看！是否继续？',
						success: function(res) {
							if (res.confirm) {
								let sign = _this.md5(_this.user.token + 'zuanshibuy');
								_this.GetJson(_this.ip + 'zuanshibuy.php', 'POST', {
									sign: sign,
									token: _this.user.token,
									vod_id: _this.id,
									userid: _this.$store.state.userinfo.userid,
									money: _this.money,
									type: 2
								}, e => {
									console.log(e);
									if (e.code == 406) {
										_this.showToast(e.msg);
										_this.$nextTick(() => {
											_this.videoContext.play()
										})
										_this.videostate = true;
										_this.isplay = true;
									}
									if (e.is == 300) {
										uni.navigateBack();
										uni.showToast({
											icon: 'none',
											title: '钻石不足，赶紧充值吧！'
										})
										setTimeout(() => {
											uni.navigateTo({
												url: '../vip/view?url=' + _this.ip +
													'zuanshi/index.php?userid=' + _this
													.user.userid
											})
										}, 1000)
									}
									if (e.code == 200) {
										_this.showToast('已扣除' + _this.money + '个钻石')
										_this.videoContext = uni.createVideoContext('myVideo', _this);
										if (e.diamonds) {
											_this.$nextTick(() => {
												_this.videoContext.play()
											})
										}
										_this.$store.state.vod.push({
											vod_id: _this.id,
											userid: _this.$store.state.userinfo.userid
										});
										_this.$store.state.userinfo.diamonds = e.diamonds;
										_this.videostate = true;
										_this.isplay = true;

									}
								})
							} else if (res.cancel) {
								uni.navigateBack();
							}
						}
					});
				} else {
					this.videostate = true;
					this.isplay = true;
				}
			},
			Danmutap(){
				this.Danmu = true;
			},
			Commenttap(){
				this.Comment = true;
			},
			getvodtime(e){
				this.dmtime = e.detail.currentTime;
				//console.log(e.detail.currentTime)
			},
			confirm(text){
				if(this.Danmu){
				   this.danmuValue = text;
				if (text == '') {
				    this.showToast('请输入弹幕内容')
				} else if (text == null) {
				    this.showToast('请输入弹幕内容')
				} else {
				    let sign = this.md5(this.$store.state.userinfo.token + 'Add_danmu' + this.id);
				    this.GetJson(this.ip + 'Get_dt_danmu.php', 'POST', {
				    	type:'post',
				    	sign:sign,
				    	token:this.$store.state.userinfo.token,
				    	id:this.id,
				        text: this.danmuValue,
				        color:this.danmucolor(),
				    	vod_time:this.dmtime
				    }, e => {
				    	if (this.isdata(e)) {
				    	    this.showToast('发布成功');
				    	}
				    })
				}
				this.videoContext.sendDanmu({
				    text: this.danmuValue,
				    color: this.danmucolor()
				});
				this.danmuValue = '';
				}else{
					this.addConmments(text);
				}
			},
			cancel(text){
				//this.show = false;
			},
			danmucolor(){
			    const rgb = []
			    for (let i = 0; i < 3; ++i) {
			        let color = Math.floor(Math.random() * 256).toString(16)
			        color = color.length == 1 ? '0' + color : color
			        rgb.push(color)
			    }
			    return '#' + rgb.join('')
			},
			addConmments(text) {
				//console.log(text)
					if (text == '') {
						this.showToast('请输入具体内容')
					} else {
					let sign = this.md5(this.$store.state.userinfo.token);
					this.GetJson(this.ip + 'Get_Dt_comment.php', 'POST', {
						sign: sign,
						type:'add',
						token: this.$store.state.userinfo.token,
						info: text,
						vid: this.id,
						uuserid:this.userid
					}, e => {
						this.hideload();
						if (this.isdata(e)) {
							this.info = '';
							//console.log(e)
							this.CommentList.unshift({
								info:text,
								time:parseInt(Date.now().toString().slice(0, -3)),
								user:{avatar:this.$store.state.userinfo.avatar,name: this.$store.state.userinfo.name},
							});
							this.Comment_num = Number(this.Comment_num) + 1 ;
							this.showToast('发布成功');
				
						}
					  })
					}
			},
			Get_vod_comment(is) {
			    if (is === true) this.CommentList = [];
			    this.load = true;
			    let sign = this.md5(this.$store.state.userinfo.token + this.CommentList.length.toString() + 'getpinglun');
			    this.GetJson(this.ip + 'Get_vod_comment.php', 'POST', {
			        sign: sign,
			        num: this.CommentList.length,
			        token: this.$store.state.userinfo.token,
			        id: this.id,
			    }, e => {
			        this.load = false;
			        uni.stopPullDownRefresh();
			        if (this.isdata(e)) {
						//console.log(e.list)
			            this.CommentList = [...this.CommentList, ...e.list];
			            this.Comment_num = e.Comment_num;
			        }
			    })
			},
			videoerr(){
				this.showToast('播放失败');
			}
		},
		onPullDownRefresh() {
			this.getpinglun(true);
			this.getad();
			if (this.load = true) this.liwu = [];
			this.getliwu(true);
		}
	}
</script>

<style>
	page {
		left: 0;
		right: 0;
		top: 0;
		margin: 0;
		background-color: #111111;
	}

	.fonts {
		color:#555555;
	}
    .videoview{
		position: fixed;
		left: 0;
		right: 0;
		/* #ifndef H5 */
		top: 80rpx;
		/* #endif */
		/* #ifdef H5 */
		top: 0;
		/* #endif */
		z-index: 1;
	}
	.imgtext {
		display: inline-block;
		text-align: center;
		width: 750rpx;
		height: 80rpx;
		font-size: 30rpx;
		font-weight: 700;
		line-height: 70rpx;
		color: #ffffff;
		position: absolute;
		top: 10rpx;
		left: 150rpx;
		z-index: 99;
	}
    
	.beisu {
		display: inline-block;
		text-align: center;
		width: 750rpx;
		height: 80rpx;
		font-size: 30rpx;
		font-weight: 700;
		line-height: 70rpx;
		color: rgba(255, 255, 255, 0.3);
		position: absolute;
		top: 10rpx;
		left: 40%;
		z-index: 99;
	}
   .ico{
		padding: 30rpx 100rpx ;
		background-color: #1a1f25;
		border-radius: 10rpx;
	}
	.videotext {
		display: inline-block;
		text-align: center;
		width: 750rpx;
		height: 80rpx;
		font-size: 32rpx;
		font-weight: 700;
		line-height: 70rpx;
		color: #ffffff;
		position: absolute;
		top: 10rpx;
		left: 150rpx;
		z-index: 99;
	}

	.videoname>text {
		font-size: 30rpx;
		font-weight: 700;
		display: block;
		color: #000000;
		display: flex;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		opacity: .8;
	}

	.topindex {
		background-color: #000000;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 1;
		height: 80rpx;
	}

	.v_bideo {
		position: fixed;
		left: 0;
		right: 0;
		top: 80rpx;
		z-index: 1;
	}
    .ismoney{
		/* #ifdef APP-PLUS */
		margin-top: 210rpx;
		/* #endif */
		/* #ifdef H5 */
		margin-top: 150rpx;
		/* #endif */
	}
	.buys {
		width: 750rpx;
		background-color:pink;
	}
    .tishiinfo {
		display: inline-block;
		background-color:#000;
		text-align: center;
		width: 750rpx;
		
		font-size: 30rpx;
		font-weight: 700;
		color: #FFFFFF;
		/* #ifdef APP-PLUS */
		height:530rpx;
		position: absolute;
		top:0;
		left: 0;
		z-index: 99;
		/* #endif */
		/* #ifdef H5 */
		height:430rpx;
		/* #endif */
	}
	.touximg {
		width: 80rpx;
		height: 80rpx;
		border-radius: 100rpx;
		top:10rpx;
	}

	.downa {
		margin: 20rpx;
		color: hotpink;
		font-size:45rpx;
		top: -15rpx;
	}

	.downb {
		margin: 20rpx;
		color: red;
		font-size: 45rpx;
		top: -15rpx;
	}

	.dashang {
		margin: 20rpx;
		color: hotpink;
		font-size: 45rpx;
		top: -15rpx;
	}

	.shouca {
		margin: 20rpx;
		color: hotpink;
		font-size: 45rpx;
		top: -15rpx;
	}

	.shoucb {
		margin: 20rpx;
		color: red;
		font-size: 45rpx;
		top: -15rpx;
	}

	.toup {
		margin: 20rpx;
		color: hotpink;
		font-size:45rpx;
		top: -15rpx;
	}
    .danmus{
		margin: 20rpx;
		font-size: 47rpx;
		color: hotpink;
	}
	.username {
		font-size:29rpx;
		font-weight: 400;
		background-image: linear-gradient(to right, #5a18d1, #9B63FF);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.guanzhua {
		border-radius: 5rpx;
		border: 1rpx solid #5a18d1;
		font-size: 27rpx;
		padding: 1rpx 10rpx;
		color: #5a18d1;
		margin: 10rpx;
	}

	.guanzhub {
		border-radius: 5rpx;
		background-image: linear-gradient(to right, #5a18d1, #9B63FF);
		font-size: 27rpx;
		padding: 3rpx 10rpx;
		color: #FFFFFF;
		margin: 10rpx;
	}

	.fensi {
		font-size: 29rpx;
		padding-left: 15rpx;
		font-weight: 400;
		line-height: 60rpx;
		color: #6e6e70;
	}

	.infotext {
		font-size: 30rpx;
		font-weight: 700;
		padding-top: 30rpx;
		background-image: linear-gradient(to right, #666666, #666666);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.zan {
		font-size: 40rpx;
		margin-top: 24rpx;
	}

	.zans {
		font-size: 25rpx;
		padding-top: 25rpx;
		margin-right: 10rpx;
	}

	.zanico {
		font-size: 40rpx;
		margin-top: 17rpx;
		padding: 10rpx 10rpx;
	}

	.looknum {
		font-size: 25rpx;
		padding-top: 25rpx;
		padding-right: -10rpx;
	}

	.plnum {
		font-size: 35rpx;
		font-weight: 600;
		margin-top: 100rpx;
		margin-left: 20rpx;
		color:#555555;
	}
	

	.usersname {
		font-size: 30rpx;
		padding-top: 20rpx;
		font-weight: 700;
	}

	.video {
		width: 750rpx;
		z-index: 1;
	}

	.top {
		/* #ifdef H5 */
		margin-top: -90rpx;
		/* #endif */
	}

	.playtime {
		background-color: #fdc8e1;
		padding: 3rpx 8rpx;

		border-radius: 10rpx;
		font-size: 20rpx;
		color: #FFFFFF;
		/*margin-left: 10rpx;*/
		margin-top: 10rpx;
	}

	.width {
		background-color: red;
		height: 3px;
	}

	.back {
		flex: 1;
		background-color: #eee;
		height: 3px;
		margin-right: 20rpx;
	}

	.load {
		display: flex;
		align-items: center;
		margin: 20rpx 0;
	}

	* {
		box-sizing: border-box;
	}

	.content {
		padding: 20rpx 30rpx;
	}

	textarea {
		padding: 20rpx 30rpx;
		width: 100%;
	}

	.fenge {

		border-radius: 1rpx 0rpx 0rpx 1rpx;
		width: 750rpx;
		color: #FFFFFF;
		background-color: #131313;
		height: 20rpx;
	}

	.videoname>text {
		font-size: 30rpx;
		font-weight: 700;
		display: block;
		color: #000000;
		display: flex;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		opacity: .8;
	}

	.lista {

		margin: 8rpx 11rpx;
		padding: 20rpx 9rpx;
		border-bottom: 1rpx solid #151515;
	}

	.user {
		margin-top: 15rpx;
	}

	.user>image {
		width: 90rpx;
		height: 90rpx;
		border-radius: 100rpx;
		margin-right: 42rpx;

	}

	.user>view {
		color: #FFFFFF;
	}

	.names {
		margin-top: -97rpx;
		margin-left: 115rpx;
		color: #555555;
	}

	.taga {
		color: #555555;
		border-radius: 1rpx;
		font-size: 32rpx;
		font-weight: 600;
		margin-left: 15rpx;
	}

	.shijian {
		font-size: 25rpx;
		color: #555555;
		margin-top: 5rpx;
		margin-left: 135rpx;
	}

	.info {
		color:#a09e9e;
	}

	.plinfo {
		margin-left: 130rpx;
	}

	.tabbar {
		color: #555555;
		width: 750rpx;
		background-color: #060606;
		z-index: 2;
	}

	.tabbar>text {
		margin: 20rpx;
		font-size: 32rpx;
		padding: 10rpx 0;
	}

	

	.newtabbar {
		color: hotpink;
		font-size: 32rpx;
		font-weight: 700;
		border-bottom: 2rpx solid hotpink;
	}

	.listv {
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 20rpx;

	}

	.list {
		border-radius: 20rpx;
		background-color: #FFFFFF;
		width: 347rpx;
		margin-bottom: 30rpx;
		animation: opacitys .1s;
	}

	.list>image {
		width: 350rpx;
		height: 400rpx;
		border-radius: 20rpx;
		background-color: #f3f1f1;
	}

	.list>view>image {
		width: 40rpx;
		height: 40rpx;
		border-radius: 100px;
		margin-right: 10rpx;
		background-color: #f3f1f1;
	}

	.hottitle {
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
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		opacity: .7;
	}

	.btnv {
		margin-left: 80rpx;
		margin-top: 20rpx;
	}

	.btnv>view {
		margin-right: 15rpx;
		width: 190rpx;
		height: 50rpx;
		line-height: 40rpx;
		border-radius: 30rpx 0rpx 0rpx 30rpx;
		background-color: #72dfb2;
		border: 1rpx solid #72dfb2;
		font-size: 30rpx;
		color: #FFFFFF;
		margin-right: -30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.btnv>view:nth-child(2) {
		width: 210rpx;
		font-size: 30rpx;
		background-color: #e9bdfb;
		color: #FFFFFF;
		border: 1rpx solid #e9bdfb;
	}

	.btnv>view:nth-child(3) {
		margin-right: 15rpx;
		width: 190rpx;
		font-size: 30rpx;
		background-color: #e9bdfb;
		color: #FFFFFF;
		border: 1rpx solid #e9bdfb;
	}

	.btnv>view:nth-child(2)>:nth-child(1) {
		margin-right: 15rpx;
	}

	.buttom {
		position: relative;
		z-index: 1;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background-color: #080808;
		padding: 8rpx;

	}

	.btns {
		margin: 60rpx auto 0;
		width: 150rpx;
		height: 80rpx;
		margin-top: -7rpx;
		border-radius: 21rpx;
		font-size: 40rpx;
		color: #555555;
		display: block;
		text-align: center;
		line-height: 85rpx;
	}

	.textarea {
		width: 550rpx;
		height: 80rpx;
		border-radius: 20rpx;
		color: #333333;
		border: 1rpx solid #333333;
		font-size: 35rpx;
		padding: 18rpx;
	}

	.swiper {
		margin-top: -150rpx;
		height: 200rpx;
		margin: 20rpx;
	}

	.swiper-item>image {
		width: 700rpx;
		height: 200rpx;
		border-radius: 10rpx;
		margin-left: 8rpx;
		background-color: #f3f1f1;
	}

	.liwu {
		margin: 15rpx 14rpx 0;
		padding: 10rpx 26rpx;
		background-color: #181818;
		border-radius: 20rpx;
	}

	.liwu>text {
		font-size: 19rpx;
		color: #999999;
		display: block;
		margin-bottom: 19rpx;
	}

	.v1>:nth-child(1) {
		width: 120rpx;
		height: 120rpx;
		border-radius: 100rpx;
		margin-right: 26rpx;
	}

	.v1>view {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.v1>view>:nth-child(1) {
		font-size: 30rpx;
		display: block;
		margin-bottom: 10rpx;
	}

	.v1>view>:nth-child(2) {
		font-size: 30rpx;

	}

	.v1>:nth-child(3) {
		font-size: 28;
		color: #cccccc;
		width: 90rpx;
		height: 90rpx;
	}

	.res {
		color: #FF57A3;
	}

	.course_image {
		width: 100%;
	}

	.video-control {
		background-color: rgba(0, 0, 0, 0.1);
		height: 90rpx;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 997;
	}

	.video-wrap {
		position: relative;
	}

	.multi-list.full-screen.vertical {
		height: 100rpx !important;
		padding: 8rpx 0;
	}

	.multi-list.full-screen.horizontal {
		height: 100rpx !important;
		padding: 8rpx 0;
	}

	.multi {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		z-index: 998;
		width: 100rpx;
		color: #fff;
		padding: 10rpx 0;
		text-align: center;
		transition: color ease 0.3s;
	}

	.multi.rate {
		right: 30rpx;
	}

	.multi-list {
		position: absolute;
		width: 0;
		background-color: rgba(0, 0, 0, 0.65);
		top: 0;
		right: 0;
		transition: width 0.3s ease;
		z-index: 999;
		box-sizing: border-box;
		padding: 50rpx 0;
	}

	.multi-list.rate {
		padding: 25rpx 0;
	}

	.multi-list.active {
		width: 300rpx;
	}

	.multi-item {
		text-align: center;
		color: #fff;
		line-height: 80rpx;
		transition: color ease 0.3s;
	}

	.multi-item.rate {
		line-height: 70rpx;
	}

	.multi-item:hover,
	.multi:hover {
		color: #ff649e;
	}

	.multi-item.active {
		color: #ff649e;
	}

	/* 视频CSS结束 */
</style>