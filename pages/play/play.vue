<template>
    <view >
        <!--#ifdef APP-PLUS-->
        <view style="background-color: #000000;position: fixed;left: 0;right: 0;top: 0;z-index: 1;height: 80rpx;"></view>
        <!--#endif -->
		<view v-if="!videostate" class="tishi">
		   <view style="width: 750rpx;height: 418rpx;background-color: #000000;">
		        <text v-if="data!=null && data.vod_points_play!=0" class="tishiinfo" >本片售价<font style="color: red;">{{data==null?'获取中...':data.vod_points_play}}</font>个钻石，需要购买才能观看</text>
		     </view> 
		</view>
        <view v-if="videostate" class="playtop">
           <!--#ifdef APP-PLUS -->
			<video v-if="djs==0 || adstate==2" 
			id="myVideo" 
			class="video" 
			:src="playurl" 
			:autoplay="isplay" 
			@error="videoerr" 
			@fullscreenchange="isfullscreen"
			play-strategy="2" 
			:loop="true" 
			:controls="true" 
			@timeupdate="getvodtime"
			:danmu-list="dmlist"
			:danmu-btn='true'
			:enable-danmu='true'
			:show-center-play-btn="true" 
			:auto-pause-if-open-native="true" 
			:vslide-gesture-in-fullscreen="false" 
			:vslide-gesture="true" 
			:style="{height:height + 'px'}">
            </video>
			<!--#endif-->
			<!--#ifdef H5 -->
				<div v-if="djs==0 || adstate==2 "class="video" id="player"></div>
			<!--#endif-->
            <view v-if="adstate==1">
                <view style="width: 750rpx;height: 418rpx;background-color: #000000;" v-if="djs!=0">
                    <view v-if="adtype==1" @tap="imgurls">
                        <image style="width: 750rpx;height: 418rpx;" :src="adimg" mode="aspectFill"></image>
                        <text class="imgtext">{{djs}}秒后播放视频 <font style="color: #FFFF00;"> 开通VIP去广告</font></text>
                    </view>
                    <view v-if="adtype==2" @tap="imgurls">
                        <video v-if="adtype==2" class="video" :src="advideo" :autoplay="true" :loop="true" :controls="false" :auto-pause-if-open-native="true" :style="{height:height + 'px'}"> </video>
                        <cover-view class="beisu" </cover-view>
                            <cover-view class="videotext">{{djs}}秒后播放视频 开通VIP去广告</cover-view>
                    </view>
                </view>
                <view style="margin-top: 10rpx;"></view>
            </view>
        </view>
      
	 <!--#ifdef APP-PLUS-->
	   <view class="buttom row">
	   	<view @tap="Commenttap" style="background-color: #1e2139;height: 80rpx;width: 700rpx;pandding:0 15rpx;margin: 0 20rpx;border-radius: 15rpx;">
	   		<text style="font-size: 30rpx;color: #4b5389;line-height: 80rpx;padding: 0 20rpx;">发表一下你对这部影视的评论</text>
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
		  background="#1F233B"
		  titleColor="#FC5A8B"
		  cancelColor="#5D6AB8"
		  confirmColor="#FC5A8B"
		  v-model="Danmu" 
		  @confirm="confirm" 
		  :maxlength="100" 
		  @cancel="cancel">
		  </nk-popup-input>
      </view>
      <view>
      	<nk-popup-input title="发布评论"
      	  titleColor background="#1F233B"
      	  titleColor="#FC5A8B"
      	  cancelColor="#5D6AB8"
      	  confirmColor="#FC5A8B"
      	  v-model="Comment" 
      	  @confirm="confirm" 
      	  :maxlength="100" 
      	  @cancel="cancel">
      	</nk-popup-input>
      </view>
	   
        <view class="main">
            <view class="tabbar tabtop row" :style="Is_ios=='ios'?'margin-top: 450rpx;':''">
                <text @tap="tabbartap(1)" :class="tabbar == 1 ? 'newtabbar' : ''">影片介绍</text>
                <text style="margin: 10rpx;" @tap="tabbartap(2)" :class="tabbar == 2 ? 'newtabbar' : ''">评论(<font style="color:#fe4c93;">{{Comment_num}}</font>)</text>
                <!--#ifdef APP-PLUS-->
				<text style="margin: 10rpx;" @tap="showSwitchRate">倍速x<font style="color:#fe4c93;">{{ currentRate }}</font></text>
                <!--#endif-->
				<view style="margin-top:1rpx;">
				    <view style="padding: 0 40rpx;">
						<text @tap="shoucang"  v-if="!isfollow" class="iconfont" style="font-size:48rpx;color:hotpink;margin-top: -15rpx;">&#xe6af;</text>
						<text @tap="shoucang"   v-if="isfollow" class="iconfont" style="font-size:48rpx;color: red;">&#xe8ba;</text>
				        <!--#ifdef APP-PLUS-->
						<text @click="Danmutap" class="iconfont" style="padding: 0 25rpx;font-size: 47rpx;color: hotpink;">&#xe6a5;</text>
						<!--<text @tap="liwu" class="iconfont" style="padding: 0 25rpx;font-size:45rpx;color: hotpink;font-weight:500;">&#xe6a9;</text>-->
						<text @tap="touping" class="iconfont" style="font-size: 45rpx;color: hotpink;">&#xe6ab;</text>
						<!--#endif -->
				    </view>
				
				</view>

                <view class="multi-list rate" :class="{ active: rateShow }">
                    <view v-for="(item, index) in ['0.5', '0.8', '1.0', '1.25', '1.5']" :key="index" class="multi-item rate" :data-rate="item" @tap="switchRate" :class="{ active: item == currentRate }">
                        {{ item }}</view>
                </view>
            </view>

            <view class="top voddata donghua" v-if="tabbar == 1">
                <view class="dataheight" :style="Is_ios=='ios'?'margin-top: 560rpx;':''">
                    <view class="row">
                        <text @tap="h5play" class="font" style="font-size: 40rpx;font-weight: 700;">{{data==null?'获取中...':data.vod_name}}</text>
                       
                    </view>

                    <view class="tagva row" style="font-size: 28rpx;margin-top: 10rpx;color: #4b5389;">
                        视频分类: {{data==null?'获取中...':data.vod_class}}
                    </view>
					<view class="tagva row" style="font-size: 28rpx;margin-top: 8rpx;color: #4b5389;">
					    {{data==null?'获取中...':data.vod_blurb}}
					</view>
                </view>

                
                <view style="height: 25rpx;"></view>
                <swiper class="swiper" :circular="true" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="300">
                    <swiper-item v-for="item in ad" class="swiper-item" @tap="adtap(item)">
                        <image :src="url+item.img" mode="aspectFill"></image>
                    </swiper-item>
                </swiper>
                <view class="fenge"></view>
                <view style="margin-top: 20rpx;">
                    <text class="font" style="font-size: 35rpx;font-weight: 700;margin: 20rpx;">猜您喜欢</text>
                </view>
                <view class="listv row">
                    <view class="list" v-for="item in lists" :key="item.id" @tap="plays(item)">
                        <image :src="item.vod_pic" mode="aspectFill"></image>
                        <view style="margin: 10rpx;">
                            <text class="hottitle fonts">{{item.vod_name}}</text>
                            <view style="margin-top: 20rpx;"></view>
                        </view>
                        <view style="margin-top: 5rpx;" v-if="item.vod_remarks!=''">
                            <text class="yanyuan">时长:{{item.vod_remarks}}</text>
                        </view>
                    </view>
                </view>
                <view style="height: 130rpx;"></view>
            </view>
        </view>

        <!--评论-->
        <view v-if="tabbar == 2" class="donghua">
            <view>
                <view style="margin-top:595rpx">
					<view class="font" style="margin:20rpx;font-size: 35rpx;font-weight: 600;">全部评论（{{Comment_num}}）</view>
                    <view class="lista" style="margin-top:0rpx" v-for="(item,index) in CommentList" :key="index.id">
                        <view class="names font row">
        					<image class="avatar" :src="url + item.user.avatar" mode="aspectFill"></image>
                            <text class="taga">{{item.user.name}}</text>
        					<text class="shijian font">{{gettime(item.addtime,'yyyy-MM-dd hh:mm')}}</text>
                        </view>
                        <view style="margin-top:10rpx;margin-left: 89rpx;">
                            <text class="commentinfo">{{item.comment_content}}</text>
                        </view>
                    </view>
                    <view>
                        <null v-if="CommentList.length == 0 && !load" info="还没有评论,来打个招呼吧!"></null>
                        
                    </view>
                </view>
            </view>
        </view>
        <!--评论-->
    </view>
    </view>
    </view>
    
    </view>

</template>

<script>
	import ygcComment from '@/components/ygc-comment/ygc-comment.vue';
    const lyzmlDLNA = uni.requireNativePlugin('lyzml-DLNA');
    let subNVue, subNVue2;
    export default {
		components: {
			ygcComment
		},
        data() {
                return {
					data:null,
                    change: 1,
                    rateShow: false, // 倍速浮层
                    currentRate: 1.0, // 默认倍速
                    vurl: '',
                    imgurl: '',
					info:'',
                    adstate: '',
                    adtype: '',
                    adtime: '',
                    adimg: '',
                    advideo: '',
                    djs: 0,
                    ad: [],
                    date: new Date().toISOString().slice(0, 10),
                    vipend: '',
                    jrtime: '',
                    commentContent: '',
                    id: '',
                    playurl: '',
					videostate:false,
                    tabbar: 1,
                    load: false,
                    isplay: false,
                    audiopay: false,
                    isfollow: false,
                    height: 200,
                    lists: [],
                    CommentList: [],
                    Comment_num: 0,
                    videourl: '',
                    percentage: 0,
                    complete: 0,
                    count: 0,
                    showload: false,
					Comment:false,
					dmlist: [],
					danmuValue: '',
					Danmu:false,
					Comment:false,
                    //#ifdef H5
                    user: null,
                    //#endif
					Is_ios:''

                }
            },
            computed: {
                vip() {
                        return this.$store.state.vip.vip;
                    },
                    user() {
                        return this.$store.state.userinfo;
                    },
               
            },

            onLoad(item) {
				this.Is_ios = uni.getSystemInfoSync().platform;
				// #ifdef H5
				uni.getStorage({
					key:'userinfo',
					success: (es) => {
						let sign = this.md5(es.data.token);
						this.GetJson(this.ip + 'userinfo.php','POST',{
							token:es.data.token,
							sign:sign
						},res=>{
							this.$store.state.follow = e.follow;
							this.$store.state.userinfo = es.userinfo;
							this.$store.state.vip = es.vip;
							if(res.code == 405 || res.userinfo == null || res.userinfo == ''){
								uni.removeStorage({key:'ulogin'})
								uni.reLaunch({url:'../login/login'})
							}
						})
					}
				})
				//#endif
				this.id = item.id
				this.GetJson(this.ip + 'Get_vod_list.php', 'POST', {
				    //token: this.$store.state.userinfo.token, 
				    id: this.id
				}, e => {
					//console.log(e.data)
					this.data = e.data;
				    this.jlist = e.list;
				    let object = e.list;
				    let vod_url = Object.keys(object).map(key => object[key])
					this.vodtitle = vod_url[0].name;
					uni.setNavigationBarTitle({title:e.data.vod_name + '-' + vod_url[0].name});
				    this.playurl = vod_url[0].url;
				   
				})
				
				setTimeout( () => {
                this.GetJson(this.ip + 'setapp.php', 'GET', {}, e => {
                    if (this.isdata(e)) {
                        this.advideo = e.advideo;
                        this.adimg = e.adimg;
                        this.adon = e.adon;
                        this.adtype = e.adtype;
                        this.adtime = e.adtime;
                        this.adstate = e.adstate;
                        this.imgurl = e.imgurl;
                        this.vurl = e.vurl;
                        if (this.adstate == '1' && this.$store.state.vip.vip == 0) {
                            let end = (new Date()).getTime() + Number(e.adtime);
                            this.daojis(end, null)
                            let initimes = setInterval(() => {
                                this.daojis(end, initimes)
                            }, 500)
                        }
                    }
					if(e.app.vip_video == 1){
					  if(this.$store.state.vip.vip==0){
						let _this = this;
						setTimeout(()=>{
							uni.showModal({
							    title: '提示',
							    content: '您还不是会员，暂无法为您播放，是否开通会员？',
								confirmText: "暂不开通",
								cancelText: "开通VIP",
							    success: function (res) {
							        if (res.confirm) {
										uni.navigateBack()
							        } else if (res.cancel) {
										uni.redirectTo({
										    url:'../vip/view?url='+_this.ip+'vip/index.php?userid='+ _this.$store.state.userinfo.userid
										})
							        }
							    }
							 });
					       },500) 
					    }else{
							this.videostate = true;
						   this.isplay = true;
						   //#ifdef H5
						     if(this.adstate==1){
						   		setTimeout( () => {this.h5play();}, Number(this.adtime)+200);
						     }else{
						   		setTimeout( () => {this.h5play();}, 200);
						     }
						   //#endif
					   }
					}else if(e.app.vip_video == 2){
							this.buy();
						}else{
							this.videostate = true;
							this.isplay = true;
							//#ifdef H5
							  if(this.adstate==1){
								setTimeout( () => {this.h5play();}, Number(this.adtime)+200);
							  }else{
								setTimeout( () => {this.h5play();}, 200);
							  }
							//#endif
						}
						
                })
				}, 500)

                uni.getStorage({
                    key: 'maindata',
                    success: (e) => {
                        this.ad = e.data.ad;
                        this.$nextTick(function() {
                            plus.navigator.closeSplashscreen();
                        })
                    }
                })
				this.GetJson(this.ip + 'Get_danmu.php', 'POST', {
					type:'get',
					id:this.id
				}, e => {
					//console.log(e)
					this.dmlist = e.list;
				})
                this.record();
                this.getpinglun();
				setTimeout( () => {this.getdata(); this.getad();}, 600)
            },
            onUnload() {
            	this.id = null ;
            },
            onReady() {
                this.videoContext = uni.createVideoContext('myVideo')
                 //#ifdef APP-PLUS
                subNVue = uni.getSubNVueById('gift');
                 //#endif
                let json = this.$store.state.follow;
                for (let i in json) {
                    if (json[i].ruserid == this.id) {
                        this.isfollow = true;
                        break;
                    }
                }
                let jsons = this.$store.state.record;
                for (let i in json) {
                    if (json[i].ruserid == this.id) {
                        this.isrecord = true;
                        break;
                    }
                }
            },
            methods: {
				toggleMask(type) {
						console.log(this.id)
						let id = this.id;
						this.$refs.ygcComment.toggleMask(type,id);
					},
					pubComment(commentContent1) {
						console.log(commentContent1)
						uni.hideKeyboard();
						this.$refs.ygcComment.toggleMask();
						this.commentContent = commentContent1;
						this.$refs.ygcComment.content = '';
				},		
                touping() {
                        this.videoContext.pause();
                        uni.navigateTo({
                            url: 'dlna?name=' + this.data.vod_name + '&url=' + this.playurl
                        })
                    },
                    changeplay() {
                        this.change = 2
                    },
                    showSwitchRate(rate) {

                        this.rateShow = true;
                    },
                    // 切换倍速
                    switchRate(e) {
                        let rate = Number(e.currentTarget.dataset.rate);
                        this.currentRate = rate;
                        this.rateShow = false;
                        this.videoContext.playbackRate(rate);
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
					videoerr(){
						this.showToast('该影片已失效，无法播放');
					},
                    adtap(item) {
                        plus.runtime.openWeb(item.url);
                    },
                    getad() {
                        this.load = true;
                        this.GetJson(this.ip + 'ad.php', 'POST', {}, e => {
                            this.ad = e.ad;
                            this.load = false;
                            uni.stopPullDownRefresh();
                            if (!plus.navigator.hasSplashscreen()) plus.navigator.closeSplashscreen();
                            uni.setStorage({
                                key: 'maindata',
                                data: e
                            })
                        })
                    },
                    getdata(is) {
                        this.GetJson(this.ip + 'vtuijian.php', 'POST', {
                            type: this.data.vod_class,
							vodtype:1
                        }, e => {
                            this.lists = e.lists;
                        })
                    },
                    listtap(item) {
                        this.playurlss = item.vod_play_url
                    },
					
                    plays(item) {
                        uni.redirectTo({
                            url: '../play/play?data=' + item + '&zuanshi=' + item.vod_points_play + '&play=' + item.vod_play_url + '&playname=' + item.vod_name + '&playimg=' + item.vod_pic + '&playtime=' + item.vod_remarks + '&playclass=' + item.vod_class + '&id=' + item.vod_id
                        })
                    },
                    tabbartap(index) {
                        this.tabbar = index;
                    },
                    tabbartaps(index) {
                        this.tabbars = index;
                    },
                    isfullscreen(){
						if(!e.detail.fullScreen){ 
			                plus.screen.lockOrientation('portrait-primary');
		                }
					},
                    liwu(item) {
                        subNVue.show('slide-in-bottom');
                    },
                    shoucang() {
                        let sign = this.md5(this.$store.state.userinfo.token + 'isfollow' + this.id);
                        this.GetJson(this.ip + 'setfollow.php', 'POST', {
                            sign: sign,
                            token: this.$store.state.userinfo.token,
                            id: this.id,
                            is: this.isfollow ? 'remov' : 'add',
							type:1
                        }, e => {
                            console.log(e)
                            if (this.isdata(e)) {
                                if (this.isfollow) {
                                    let json = this.$store.state.follow;
                                    for (let i in json) {
                                        if (json[i].ruserid == this.id) {
                                            this.$store.state.follow.splice(i, 1);
                                            this.isfollow = false;
                                            this.showToast('已取消收藏')
                                            break;
                                        }
                                    }
                                } else {
                                    let datas = JSON.parse(JSON.stringify(this.data));
                                    this.$store.state.follow.push({
                                        ruserid: datas.vod_id
                                    });
                                    this.isfollow = true;
                                    this.showToast('已加入收藏')
                                }
                            }
                        })
                    },
                    record() {
                        let sign = this.md5(this.$store.state.userinfo.token + 'records' + this.id);
                          this.GetJson(this.ip + 'setrecords.php', 'POST', {
                              sign: sign,
                              token: this.$store.state.userinfo.token,
                              id: this.id,
                    	  	  type:2
                          }, e => {
							  this.$store.state.record.unshift({vod_id:this.id});
                        })
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
						    this.GetJson(this.ip + 'Get_danmu.php', 'POST', {
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
					cancel(event){
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
					    } else if (text == null) {
					        this.showToast('请输入具体内容')
					    } else {
					        let sign = this.md5(this.$store.state.userinfo.token);
					        this.GetJson(this.ip + 'Add_vod_comment.php', 'POST', {
					            sign: sign,
					            token: this.$store.state.userinfo.token,
					            info: text,
					            id: this.id
					        }, e => {
					            this.hideload();
					            if (this.isdata(e)) {
									this.CommentList.unshift({
										comment_content:text,
										user:{avatar:this.$store.state.userinfo.avatar,name: this.$store.state.userinfo.name},
										addtime:parseInt(Date.now().toString().slice(0, -3))
									});
									this.info = '';
									this.Comment_num = Number(this.Comment_num) + 1 ;
					                this.showToast('发布成功');
					            }
					        })
					    }
					},
                    getpinglun(is) {
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
                                this.Invitation = e.Invitation;
                                this.Comment_num = e.Comment_num;
                            }
                        })
                    },
                    buy() {
						let sign = this.md5(this.$store.state.userinfo.token + 'vod_identify');
						this.GetJson(this.ip + 'vod_identify.php', 'POST', {
						    sign: sign,
						    token: this.$store.state.userinfo.token,
							vod_id:this.id,
						    userid:this.$store.state.userinfo.userid,
							type:1
						}, e => {
						    //console.log(e);
							if(e.code ==200){
								this.showToast(e.msg);
								this.videostate = true;
								this.isplay = true;
								//#ifdef APP-PLUS
								this.$nextTick(()=>{
									this.videoContext.play()
								})
								//#endif
								//#ifdef H5
								setTimeout(() => {this.h5play();}, 500); 
								//#endif
							}else{
								this.goumai();
							}
							
						})
                    },
					goumai(){
						let _this = this;
						if ( _this.data.vod_points_play != 0) {
						    uni.showModal({
						        title: '提示',
						        cancelText: "暂不付费",
						        confirmText: "付费观看",
						        confirmColor: '#f55850',
						        cancelColor: '#39B54A',
						        content: '本视频需要扣除' + _this.data.vod_points_play + '个钻石才能观看！是否继续？',
						        success: function(res) {
						            if (res.confirm) {
										let sign = _this.md5(_this.$store.state.userinfo.token + 'zuanshibuy');
										_this.GetJson(_this.ip + 'zuanshibuy.php', 'POST', {
										    sign: sign,
										    token: _this.$store.state.userinfo.token,
											vod_id:_this.id,
										    userid: _this.$store.state.userinfo.userid,
										    money: _this.data.vod_points_play,
											type:1
										}, e => {
											if(e.code ==406){
												_this.showToast(e.msg);
												//#ifdef APP-PLUS
												_this.$nextTick(()=>{
													_this.videoContext.play()
												})
												//#endif
												_this.videostate = true;
												_this.isplay = true;
												//#ifdef H5
												  if(_this.adstate==1){
														setTimeout( () => {_this.h5play();}, Number(_this.adtime)+500);
												  }else{
														setTimeout( () => {_this.h5play();}, 500);
												  }
												//#endif
											}
										    if (e.is == 300) {
										        uni.navigateBack();
										        uni.showToast({
										            icon: 'none',
										            title: '钻石不足，赶紧充值吧！'
										        })
										        setTimeout(() => {
										            uni.navigateTo({
										                url: '../vip/view?url=' + _this.ip + 'zuanshi/index.php?userid=' + _this.$store.state.userinfo.userid
										            })
										        }, 1000)
										    } 
											if(e.code==200){
												_this.showToast('已扣除'+_this.data.vod_points_play+'个钻石')
												_this.videoContext = uni.createVideoContext('myVideo', _this);
												if(e.diamonds){
													_this.$nextTick(()=>{
														_this.videoContext.play()
													})
												}
												_this.$store.state.vod.push({vod_id:_this.id,userid:_this.$store.state.userinfo.userid});
												_this.videostate = true;
												_this.isplay = true;
												//#ifdef H5
												  if(_this.adstate==1){
														setTimeout( () => {_this.h5play();}, Number(_this.adtime)+200);
												  }else{
														setTimeout( () => {_this.h5play();}, 200);
												  }
												//#endif
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
							//#ifdef H5
							  if(this.adstate==1){
									setTimeout( () => {this.h5play();}, Number(this.adtime)+200);
							  }else{
									setTimeout( () => {this.h5play();}, 200);
							  }
							//#endif
						}
					},
					h5play() {
						let that = this;
						var player = new AipPlayer({
							container: document.getElementById("player"),
							header: true, //全屏显示头部信息(返回图标+标题) 
							title: that.data.vod_name + that.vodtitle, //视频标题
							autoplay: true, //自动播放
							minHeader: true, //非全屏时是否显示 标题
							playNext: false, //全屏时是否显示下一集图标   选集数组小于等于1时不显示
							screenshot: true,
							airplay: false,
							loop: true, //循环播放 默认false
							live: false, //是否是直播
							playbackSpeed: [1.0, 1.25, 1.5, 2.0, 2.5, 3.0],
							playbackSpeedTxt: "倍数",
							speedIndex: 0, //playbackSpeed数组下标 初始的速度 默认0
							showMobilePlay: true, //手机中心播放暂停图标 
							currentIndex: 0, //设置当前激活选集的下标索引  默认0
							height:240, //高度px
							//spisodes: [], //选集数组 空数组默认不显示
							spisodes: [], //选集数组 空数组默认不显示
							spisodesTxt: "选集",
							showDanmaku: false, //弹幕开启  配置danmaku后才可生效  false关闭图标样式切换等
							landscape: false, //手机端默认进入横屏全屏时设置true  默认false
							video: {
								url: that.playurl, //视频url
								pic:''
							},
							danmaku: {
								id: 'demo01',
								api: ''    ,//这里填写弹幕地址
								user: 'dplayer',
							}
						});
					
						player.on('fullscreen', function() {
						  screen.orientation.lock("landscape-primary");
						});
						player.on('fullscreen_cancel', function() {
						   screen.orientation.unlock();
						});
						player.on('back', function() {
					      uni.navigateBack();
						});
					},
            },
            onPullDownRefresh() {
                this.getpinglun(true);
            }
    }
</script>

<style>
    page {
        background-color: #181b2e;
    }
    .playtop{
    	position: fixed;
    	left: 0;
    	right: 0;
    	/*#ifdef H5 */
    	top: 0;
    	margin-top: -30rpx;
    	/*#endif */
    	/*#ifdef APP-PLUS */
    	top: 80rpx;
    	/*#endif */
    	z-index: 1;
    	background-color: #000000;
    }
	.tabtop{
		/* #ifdef H5 */
		top: 433rpx;
		/*#endif*/
		/* #ifdef APP-PLUS */
		margin-top: 495rpx;
		top: 0;
		/*#endif*/
		height: 90rpx;
		position: fixed;
		left: 0;
		right: 0;
		z-index: 1;
	}
	.tishi{
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		top: 0;
		/*#endif*/
		/* #ifdef APP-PLUS */
		top: 80rpx;
		/*#endif*/
		z-index: 1;
	}
	.voddata{
		/* #ifdef H5 */
		margin-top: 650rpx; 
		/*#endif*/
		/* #ifdef APP-PLUS */
		margin-top: 670rpx;
		/*#endif*/
	}
	.dataheight{
		margin: 20rpx;
		/* #ifdef H5 */
		margin-top: 545rpx; 
		/*#endif*/
		/* #ifdef APP-PLUS */
		margin-top: 610rpx;
		/*#endif*/
	}
    .font {
        background-image: linear-gradient(to right, #521fad, #7b42e0, #521fad);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .fonts {
        background-image: linear-gradient(to right, #f93bd7, #fcea22, #f93bd7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .video {
        width: 750rpx;
    }
    
    .top {
        margin-top: 100rpx;
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
    
    .fenge {
        border-radius: 1rpx 0rpx 0rpx 1rpx;
        width: 750rpx;
        color: #FFFFFF;
        background-color: #1c1f35;
        height: 20rpx;
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
        top: 20rpx;
        left: 150rpx;
        z-index: 99;
    }
    .tishiinfo {
        display: inline-block;
        text-align: center;
        width: 750rpx;
        height: 80rpx;
        font-size: 30rpx;
        font-weight: 700;
        line-height: 70rpx;
        color: #fcea22;
        position: absolute;
        top: 150rpx;
        left: 10rpx;
        z-index: 99;
    }
    .videotext {
        display: inline-block;
        text-align: center;
        width: 750rpx;
        height: 80rpx;
        font-size: 30rpx;
        font-weight: 700;
        line-height: 70rpx;
        color: #ffffff;
        position: absolute;
        top: 20rpx;
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
    
    .lista {
        background-color: #181b2e;
        margin: 8rpx 11rpx;
        padding: 20rpx 9rpx;
        border-bottom: 1rpx solid #21253e;
    }
    .avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 100rpx;
        margin-right: 42rpx;
        background-color: #181b2e;
    
    }
    .commentinfo{
		font-size: 30rpx;
		color:#7649c0;
	}
    .taga {
        border-radius: 1rpx;
        font-size: 32rpx;
        font-weight: 600;
        margin-left: -10rpx;
    }
    
    .shijian {
        font-size: 25rpx;
        color: #a09e9e;
        margin-top: 1rpx;
        margin-left: 20rpx;
    }
    .shijian {
        font-size: 25rpx;
        color: #a09e9e;
        margin-top: 5rpx;
        margin-left: 135rpx;
    }
    
    .plinfo {
        margin-left: 130rpx;
    }
    
    .tabbar {
        color: #3a4373;
        width: 750rpx;
        background-color: #121525;
    }
    
    .tabbar>text {
        margin: 8rpx;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        font-size: 35rpx;
        padding: 10rpx 0;
    }
    
    .newtabbar {
        margin: 20rpx;
        color: #7b31c6;
        font-size: 35rpx;
        font-weight: 700;
        border-bottom: 3px solid #4d5588;
    }
    
    .listv {
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 20rpx;
        background-color: #181b2e;
    }
    
    .list {
        border-radius: 5rpx;
        box-shadow: 10rpx 10rpx 8rpx 4rpx rgba(0, 0, 0, 0.05);
        position: relative;
        background-color: #212640;
        width: 230rpx;
        margin-bottom: 30rpx;
        animation: opacitys .1s;
    }
    
    .list>image {
        width: 230rpx;
        height: 300rpx;
        border-radius: 8rpx 8rpx 0 0;
        background-color: #2b3151;
    }
    
    .list>view>image {
        width: 60rpx;
        height: 60rpx;
        border-radius: 100px;
        margin-right: 10rpx;
        background-color: #2b3151;
    }
    .yanyuan {
        margin: 10rpx;
        color: #616061;
        font-weight: 400;
        font-size: 26rpx;
        display: block;
        margin-top: -15rpx;
        display: flex;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        opacity: .7;
    }
    
    .hottitle {
        color: #000000;
        font-weight: 500;
        font-size: 30rpx;
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
        height: 120rpx;
        background-color: #333a5f;
        padding: 8rpx;
    }
    
    .btns {
        margin: 60rpx auto 0;
        width: 150rpx;
        height: 80rpx;
        margin-top: -7rpx;
        border-radius: 21rpx;
        font-size: 16px;
        color: #525e98;
        display: block;
        text-align: center;
        line-height: 85rpx;
    }
    
    .textarea {
        margin: 10rpx;
        width: 700rpx;
        height: 80rpx;
        border-radius: 20rpx;
        color: #525e98;
        background-color: #22263f;
        font-size: 35rpx;
    }
    
    .swiper {
        margin-top: -170rpx;
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
        right: -40rpx;
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

    /* 视频CSS结束 */
</style>