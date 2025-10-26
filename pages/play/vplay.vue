<template>
	<view >
		<!--#ifdef APP-PLUS-->
		<view style="background-color: #000000;position: fixed;left: 0;right: 0;top: 0;z-index: 1;height: 80rpx;"></view>
		<!--#endif -->
		<view v-if="videostate" class="playtop" >
		   <!--#ifdef APP-PLUS -->
		   <view v-if="!isurl && play_type == 0"><!--使用原生播放器-->
			<video v-if="djs==0 || adstate==2" 
			id="myVideo" 
			class="video" 
			object-fit="fill"
			:src="playurls" 
			:autoplay="isplay" 
			:title="data.vod_name + '-' + vodtitle" 
			:poster="data.vod_pic"
			@error="videoerr" 
			play-strategy="2" 
			:loop="loop" 
			@ended="endvideo(playnum)"
			:controls="true" 
			@timeupdate="getvodtime"
			:danmu-list="dmlist"
			:danmu-btn='true'
			:enable-danmu='true'
			:show-loading='true'
			@waiting="waiting"
			:show-center-play-btn="true" 
			:auto-pause-if-open-native="true" 
			:vslide-gesture="true" 
			:show-mute-btn="true" 
			:vslide-gesture-in-fullscreen="true"
			@controlstoggle="controlstoggle"
			:style="{height:height + 'px'}">
		    </video>
			</view>
			<view v-if="djs==0 && !isurl && play_type == 1"> <!--使用mu3u8解析-->
				<iframe  :src="m3u8_url + playurls"  allow="fullscreen" frameborder="0" width="97%" height="180px"></iframe>
			</view>
			<view  v-if="isurl">
			    <!--<web-view v-if="isurl" allow="fullscreen" :src="playurls" style="width: 750rpx; height: 180px;"></web-view>-->
				<iframe  :src="playurls"  allow="fullscreen" frameborder="0" width="97%" height="180px"></iframe>
			</view>
			<!--#endif-->
			<!--#ifdef H5 -->
			    <view v-if="djs==0 || adstate==2" style="margin-top:20rpx;">
					<view v-if="play_type == 1 && isurl">
						<iframe  :src="playurls"  allow="fullscreen" frameborder="0" width="97%" height="230px"></iframe>
					</view>
			    	
			    </view>
				<div v-if="!isurl && djs==0 || adstate==2 " class="video" id="SycPlayer"></div>
			<!--#endif-->
		    <view v-if="adstate==1">
		        <view style="width: 100%;height: 418rpx;background-color: #000000;" v-if="djs!=0">
		            <view v-if="adtype==1" @tap="imgurls">
		                <image style="width: 100%;height: 418rpx;" :src="adimg" mode="aspectFill"></image>
		                <text class="imgtext">{{djs}}秒后播放视频 <font style="color: #FFFF00;"> 开通VIP去广告</font></text>
		            </view>
		            <view v-if="adtype==2 && djs!=0" @tap="imgurls">
		                <video  class="video"  object-fit="cover" :src="advideo" :autoplay="true" :loop="true" :controls="false" :auto-pause-if-open-native="true" style="height: 220px;"> 
						<cover-view class="videotext">{{djs}}秒后播放视频 开通VIP去广告</cover-view>
						</video>
		                
		            </view>
		        </view>
		        <!-- <view style="margin-top: 10rpx;"></view> -->
		    </view>
			<!-- tabbar区 -->
			 <view class="tabbar tabtop row" style="margin-top: -13rpx;">
			     <view>
					<text @tap="tabbartap(1)" style="font-size:30rpx;color:#FCFCFC;margin-left: 20rpx;" :class="tabbar == 1 ? 'newtabbar' : ''">影片详情</text>
					<text style="margin: 10rpx;font-size:30rpx;color:#FCFCFC;margin-left: 30rpx;" @tap="tabbartap(2)" :class="tabbar == 2 ? 'newtabbar' : ''">评论(<font style="color:#FC5A8B;">{{Comment_num}}</font>)</text>
				    <text v-if="isurl" @tap="select_jx()" style="font-size:30rpx;color:#FCFCFC;margin-left: 20rpx;" :class="tabbar == 3 ? 'newtabbar' : ''">解析通道</text>
				 </view>
			 	<view style="margin-top:1rpx;">
			         <view style="padding: 0 40rpx;">
			 			<!-- #ifdef H5 -->
			 			<text @tap="shoucang"  v-if="!isfollow" class="iconfont" style="font-size:48rpx;color: hotpink;margin-top: -15rpx;">&#xe6af;</text>
			 			<text @tap="shoucang"   v-if="isfollow" class="iconfont" style="font-size:48rpx;color: red;">&#xe8ba;</text>
			 			<!--#endif -->
					 </view>
			     </view>
				
			     <view class="multi" v-if="!isurl && play_type == 0">
			     <view class="multi-list rate" :class="{ active: rateShow }">
			         <view v-for="(item, index) in reteList" :key="index" class="multi-item rate" :data-rate="item" @tap="switchRate" :class="{ active: item == currentRate }">
			             {{ item }}
			         </view>
			     </view>
			 	</view>
			 </view>
			<!-- tabbar区 !-->
		</view>
        
		
        <view>
            <view class="donghua" v-if="tabbar == 1" >
                <view class="datatop"  :style="Is_ios=='ios'?'margin-top: 560rpx;':''">
					
                    <view class="row" >
                        <text  style="font-size: 40rpx;font-weight: 800;color:#FFF">{{data.vod_name}}</text>
						<text style="font-size: 40rpx;font-weight: 800;margin-left: 10rpx;color:#FFF">{{vodtype==2? ' - ' + vodtitle:''}}</text>
                    </view>

                    <!--<view @tap="more" style="margin-top: -50rpx;font-size: 30rpx;color: #8C8989;float: right;">详情></view>
                <view style="background-color: #000000;padding: 20rpx 15rpx;margin-top: 20rpx;border-radius: 20rpx;">
                    <view class="tagva row" style="font-size: 30rpx;color: #4b5389;">
                        导演: {{data.vod_director}} | 年份: {{data.vod_year}}
                    </view>
                    <view class="tagva row" style="font-size: 30rpx;margin-top:2rpx;color: #4b5389;">
                        分类: {{data.vod_class}} | 地区: {{data.vod_area}}
                    </view>
                    <view class="tagva vinfo row" style="font-size: 30rpx;margin-top:2rpx;color: #4b5389;">
                       演员: {{data.vod_actor==''?'暂无演员信息':data.vod_actor}}
                    </view>
				 </view>  -->
				   
                    <view style="font-size: 30rpx;margin-top: 20rpx;">
                       <text style="display: block;font-size: 28rpx;color:#707688;">{{data.vod_blurb}}</text>
                    </view>
					
                    <view style="font-size: 30rpx;margin-top: 20rpx;">
                       <text style="display: block;font-size: 25rpx;color:#515050;"> {{data.vod_class}} | {{data.vod_area}}</text>
                    </view>
                   
				    <!--#ifdef APP-PLUS-->
                    <view style="padding: 30rpx 2rpx;display: flex;flex: 1;justify-content: space-around;align-items: center;" class="row">
						<view class="ico">
							<text @tap="shoucang"  v-if="!isfollow" class="iconfont" style="font-size:48rpx;color: #a4a4a4;margin-top: -15rpx;">&#xe6af;</text>
							<text @tap="shoucang"   v-if="isfollow" class="iconfont" style="font-size:48rpx;color: red;">&#xe8ba;</text>
						</view>
						
						
						<view class="ico" style="margin-left: 30rpx">
							<text @click="Danmutap" class="iconfont" style="font-size: 47rpx;color: #a4a4a4;">&#xe6a5;</text>
							
						</view>
						
						<view class="ico" style="margin-left: 30rpx">
							<text @tap="touping" class="iconfont" style="font-size: 45rpx;color: #a4a4a4;">&#xe6ab;</text>
						</view>
						
						<view class="ico" style="margin-left: 30rpx">
							<text @tap="Share()" class="iconfont" style="font-size: 36rpx;color: #a4a4a4;">&#xe6c6;</text>
						</view>
						
						<view class="ico" style="margin-left: 30rpx">
							<text @tap="showSwitchRate" class="iconfont" style="font-size: 30rpx;color: #a4a4a4;">倍速{{ currentRate }}</text>
						</view>
                    </view>
                    <!--#endif -->
					
					<!--<view v-if="isurl" style="margin-bottom: 40rpx;margin-top: -40rpx;">
					   <view style="margin-left:5rpx;">
						   <view  style="color: #fff;padding:10rpx 0;" class="row">
							   <text style="background-color: #FC5A8B;width: 15rpx;height: 35rpx;"></text>
							   <text style="margin-left: 10rpx;">选择解析通道</text>
						   </view> 
						   <scroll-view :scroll-x="true" class="scroll-view" style="margin-top:-5rpx;">
						   <view style="margin-left:5rpx;">
						   		<text @tap="select_jx(item)"  v-for="item in jx_list" class="jxbutton" :class="jxname == item.name ? 'jxshow' : ''">{{item.name}}</text>
						   </view>
						   </scroll-view>
					   </view>
					</view>-->
					
                    <view v-if="data_type==1" style="margin-bottom: 40rpx;">
                       <view style="margin-left:5rpx;">
						   <view v-if="jlist.length!=1" style="color: #fff;padding:0 10rpx;" class="row">
							   <text style="background-color: #FC5A8B;width: 15rpx;height: 35rpx;"></text>
							   <text style="margin-left: 10rpx;">选集</text>
						   </view> 
						   <scroll-view :scroll-x="true" class="scroll-view" style="margin-top:-5rpx;">
						   <view v-if="jlist.length!=1" style="margin-left:5rpx;">
						   		
						   		<text @tap="playvod(item)"  v-for="item in jlist" class="vodclass" :class="vodnum == item.name ? 'show' : ''">{{item.name}}</text>
						   </view>
						   </scroll-view>
                           
                       </view>
                    </view>


                    <view style="padding: 0 10rpx;">
                    <view v-if="data_type==2" style="margin-bottom: 40rpx;"> 
						<view style="color: #707688;" class="row">
							<text style="background-color: #FC5A8B;width: 15rpx;height: 35rpx;"></text>
							<text style="margin-left: 10rpx;">播放片源</text>
						</view>
						<view style="margin-top:5rpx;">
						<view class="row" v-if="jlist.a.length==1 && jlist.b.length==1" >
						<view @tap="atapa('播放片源①')" class="plays">
							<text class="vodselect" :class="pname == '播放片源①' ? 'selectshow' : ''">播放片源①</text>
						</view>
						<view @tap="atapb('播放片源②')" class="plays" style="margin-left: 15rpx;">
							<text class="vodselect" :class="pname == '播放片源②'? 'selectshow' : ''">播放片源②</text>
						</view>
						</view>
						</view>
						
						<scroll-view :scroll-x="true" class="scroll-view" style="margin-top:20rpx;">
                       <view v-if="aorb" style="margin-left:5rpx;">
						   <text v-if="jlist.a.length!=1"  class="showleft">片源①</text>
						   <text v-if="jlist.a.length!=1" v-for="(item,index) in jlist.a" :key="index" @tap="playvod(item)"  class="vodclass" :class="vodnum == item.name ? 'show' : ''">{{item.name}}</text>
					   </view>
					   </scroll-view>
					   <scroll-view :scroll-x="true" class="scroll-view" style="margin-top:-5rpx;">
					   <view  style="margin-left:5rpx;">
					   		<text v-if="jlist.b.length!=1"  class="showleft">片源②</text>
					   		<text v-if="jlist.b.length!=1" v-for="(item,index) in jlist.b" :key="index" @tap="playvods(item)"  class="vodclass" :class="vodnums == item.name ? 'show' : ''">{{item.name}}</text>
					   </view>
					   </scroll-view>
					  </view> 
                    </view>
                    <!--<view class="tagva row" style="font-size: 30rpx;margin-top: 20rpx;color: #8C8989;">
												导演：{{daoyan}}
						</view>					   
											   
					    <view class="tagva row" style="font-size: 30rpx;margin-top: 20rpx;color: #8C8989;">
						演员：{{yanyuan}}
					   </view>-->

                </view>
               

                <swiper class="swiper" :circular="true" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="300">
                    <swiper-item v-for="item in ad" class="swiper-item" @tap="adtap(item)">
                        <image :src="url+item.img" mode="aspectFill"></image>
                    </swiper-item>
                </swiper>

                <view  style="font-size: 35rpx;margin: 20rpx;font-weight: 700;color: #FFF;" class="row">
					<text style="background-color: #FC5A8B;width: 15rpx;height: 35rpx;"></text>
                    <text style="margin-left: 10rpx;">猜你喜欢</text>
                </view>
                <view class="listv row">
                    <view class="list" v-for="item in lists" :key="item.id" @tap="plays(item)">
                        <image :src="item.vod_pic" mode="aspectFill"></image>
                        <view style="margin: 10rpx;">
                            <text class="hottitle">{{item.vod_name}}</text>
                            <view style="margin-top: 20rpx;"></view>
                        </view>
                        <view style="margin-top: 5rpx;">
                            <text class="yanyuan">{{item.vod_actor==''?'暂无演员信息':item.vod_actor}}</text>
                        </view>
                        <view style="height: 10rpx;"></view>
                    </view>

                </view>
            </view>
            <view style="height: 130rpx;"></view>
        </view>

          <!--#ifdef APP-PLUS-->
            <view class="buttom row">
            	<view @tap="Commenttap" style="background-color: #0d0d0d;height: 80rpx;width: 700rpx;pandding:0 15rpx;margin: 0 20rpx;border-radius: 15rpx;">
            		<text style="font-size: 30rpx;color: #727272;line-height: 80rpx;padding: 0 20rpx;">发表一下你对这部影视的评论</text>
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
		  
		  
        <!--评论-->
        <view v-if="tabbar == 2" class="donghua comments">
            <view  style="margin:20rpx;font-size: 32rpx;font-weight: 600;color:#FCFCFC">全部评论（{{Comment_num}}）</view>
            <view>
                <view class="pl">
                    <view class="lista" style="margin-top:0rpx" v-for="(item,index) in CommentList" :key="index.id">
                        <view class="names row">
							<image class="avatar" :src="url + item.user.avatar" mode="aspectFill"></image>
                            <text class="taga">{{item.user.name}}</text>
							<text class="shijian">{{gettime(item.addtime,'yyyy-MM-dd hh:mm')}}</text>
                        </view>
                        <view style="margin-top:10rpx;margin-left: 89rpx;">
                            <text class="commentinfo">{{item.comment_content}}</text>
                        </view>
                    </view>
                    <view>
                        <null v-if="CommentList.length == 0 && !load" info="还没有评论,来打个招呼吧!"></null>
						<load class="load" :style="{opacity:load ? '1' : '0'}"></load>
                        <view style="height: 500rpx;"></view>
                    </view>
                </view>
            </view>
        </view>
        <!--评论-->
		<view >
		    <nk-popup-input title="发送弹幕"
		      background="#111111"
		      titleColor="#707688"
		      cancelColor="#707688"
		      confirmColor="#FC5A8B"
		      v-model="Danmu" 
		      @confirm="confirm" 
		      :maxlength="100" 
		      @cancel="cancel">
		      </nk-popup-input>
		</view>
		<view>
			<nk-popup-input title="发布评论"
			  titleColor 
			  background="#111111"
			  titleColor="#707688"
			  cancelColor="#707688"
			  confirmColor="#FC5A8B"
			  v-model="Comment" 
			  @confirm="confirm" 
			  :maxlength="100" 
			  @cancel="cancel">
			</nk-popup-input>
		</view>
    </view>
    </view>

    </view>
    </view>

</template>

<script>
	var wv; 
	import appShare, {closeShare} from '../../js_sdk/appShare.js';
	//#ifdef H5
	import SycPlay from '../../js_sdk/player/SycPlay.js';
	import Hls from '../../js_sdk/player/hls.js';
	//#endif
    let subNVue, subNVue2;
    export default {
        data() {
            return {
				data:null,
                rateShow: false, // 倍速浮层
				isurl:false,
                currentRate: 1.0, // 默认倍速
                data: '',
				play_type:'0',
				m3u8_url:'',
                vurl: '',
                imgurl: '',
                adstate: '',
				info:'',
                adtype: '',
                adtime: '',
                adimg: '',
                advideo: '',
                djs:0,
                ad: [],
				jx_list:[],
                playurls: '',
                tabbar: 1,
                load: true,
                isfollow: false,
				isplay:false,
                height: 180,
                lists: [],
				reteList:['0.5', '0.8', '1.0', '1.25', '1.5'],
                CommentList: [],
                info: '',
                Comment_num: 0,
                jlist: [],
                vodnum: '',
				vodnums:'',
				pname:'播放片源①',
                vodtype: '',
				vodtitle:'',
				videostate:false,
				data_type:'',
				aorb:true,
				playlist:[],
				playnum:1,
				videoContext:null,
				loop:false,
				dmlist: [],
				danmuValue: '',
				Danmu:false,
				Comment:false,
				Hctext:'',
				Is_ios:'',
				textTop:'',
				// #ifdef H5
				id:''
                  //#endif
            }
        },
        computed: {
          
        },
        onUnload() {
            
        },
		mounted() {
			
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
						this.$store.state.userinfo = res.userinfo;
						this.$store.state.vip = res.vip;
						if(res.code == 405 || res.userinfo == null || res.userinfo == ''){
							uni.removeStorage({key:'ulogin'})
							uni.reLaunch({url:'../login/login'})
						}
					})
				}
			})
			//#endif
			this.id = item.id;
            this.Get_vod_comment();
            this.GetJson(this.ip + 'App_api.php', 'POST', {
				type:'get_vod_ad'
			}, e => {
                if (this.isdata(e)) {
					this.adstate = e.adstate;
					this.adtype = e.adtype;
					this.adon = e.adon;
					this.adtime = e.adtime;
                    this.advideo = e.advideo;
                    this.adimg = e.adimg;
                    this.imgurl = e.imgurl;
                    this.vurl = e.vurl;
					this.share = {title:e.share.sharetitle,text:e.share.sharetext}
                    if (e.adstate == '1' && this.$store.state.vip.vip == 0) {
                        let end = (new Date()).getTime() + Number(e.adtime);
                        this.daojis(end, null)
                        let initimes = setInterval(() => {
                            this.daojis(end, initimes)
                        }, 500)
                    }
                }
				if(e.vip_on == 1){
				  if(this.$store.state.vip.vip==0){
					let _this = this;
					setTimeout(()=>{
						uni.showModal({
						    title: '提示',
						    content: '您还不是会员，暂无法为您播放，是否开通会员？',
							confirmText: "开通VIP",
							cancelText: "暂不开通",
						    success: function (res) {
						        if (res.confirm) {
									uni.redirectTo({
										url:'../pay/index'
									})
						        } else if (res.cancel) {
									uni.navigateBack()
						        }
						    }
						 });
				       },500) 
				    }else{
					   this.isplay = true;
					   //#ifdef H5
					   if(this.adstate==1){
						   setTimeout( () => {this.h5play();}, Number(this.adtime)+200);
					   }else{
						   setTimeout( () => {this.h5play();}, 200);
					   }
					 //#endif
				   }
				}else{
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
			  
			this.GetJson(this.ip + 'Index_api.php', 'POST', {
				type:'get_danmu',
				id:this.id
			}, e => { 
				this.dmlist = e.list;
			})
			this.geturl();
			setTimeout( () => {this.getdata();}, 1000)
            this.GetJson(this.ip + 'App_api.php', 'POST', {type:'get_ad'}, e => {this.ad = e.ad;})
			var currentWebview = this.$scope.$getAppWebview();
			setTimeout(function() {
				wv = currentWebview.children()[0];
				wv.setStyle({
					videoFullscreen: 'landscape'
				});
			}, 1000); 
		},

        onReady() {
            //#ifdef APP-PLUS
            this.videoContext = uni.createVideoContext('myVideo')
            subNVue = uni.getSubNVueById('gift');
            subNVue2 = uni.getSubNVueById('more');
			//#endif
            let json = this.$store.state.follow;
            for (let i in json) {
                if (json[i].ruserid == this.id) {
                    this.isfollow = true;
                    break;
                }
            }
        },
        methods: {
			geturl(){
				this.GetJson(this.ip + 'Get_vod_list.php', 'POST', {
				    //token: this.$store.state.userinfo.token, 
				    id: this.id
				}, e => {
					if(e.type==1){
						if (e.list[0].url.indexOf('m3u8') !== -1 || e.list[0].url.indexOf('mp4') !== -1) {
							this.playurls = e.list[0].url;
						}else{
							this.isurl = true
							this.$set(this, 'jxname', e.jxurl_list[0].name)
							this.playurls = e.jxurl_list[0].url + e.list[0].url;
						}
						this.data = e.data;
						this.play_type = e.play.play_type;
						this.m3u8_url = e.play.m3u8_url;
						this.jlist = e.list;
						this.jx_list = e.jxurl_list
						this.data_type = e.type;
						this.videostate = true;
						if(e.list.length != 1)this.vodtype = 2;
						this.vodnum = e.list[0].name;
						this.vodtitle = e.list[0].name;
						uni.setNavigationBarTitle({title:e.data.vod_name + '-' +e.list[0].name});
						this.record();
					}
					if(e.type==2){
						if (e.list.a[0].url.indexOf('m3u8') !== -1 || e.list.a[0].url.indexOf('mp4') !== -1) {
							this.playurls = e.list.a[0].url;
						}else{
							this.isurl = true
							this.$set(this, 'jxname', e.jxurl_list[0].name)
							this.playurls = e.jxurl_list[0].url + e.list.a[0].url;
						}
						this.jx_list = e.jxurl_list
						this.playlist = e.list.a;
						//console.log(e.list);
						this.data = e.data;
						this.play_type = e.play.play_type;
						this.m3u8_url = e.play.m3u8_url;
						this.jlist = e.list;
						this.videostate = true;
						if(e.list.a.length != 1)this.vodtype = 2;
						this.vodtype = 2;
						this.data_type = e.type;
						this.vodnum = e.list.a[0].name;
						this.vodtitle = e.list.a[0].name;
						uni.setNavigationBarTitle({title:e.data.vod_name + '-' + e.list.a[0].name});
						this.playnum = e.list.a[0].num;
						this.selecturla = e.list.a[0].url;
						this.selecturlb = e.list.b[0].url;
						this.atapa('播放片源①')
						this.record();
					}
				})
			},
			atapa(item){
				this.$set(this, 'pname', item)
					this.aorb = true
					this.videostate = true;
					this.playurls = this.selecturla;
					//#ifdef H5
					if(this.djs==0){
						this.h5play()
					};
					//#endif
				
			},
			atapb(item){
				this.$set(this, 'pname', item)
					this.aorb = false ;
					this.videostate = true;
					this.playurls = this.selecturlb;
					//#ifdef H5
					if(this.djs==0){
						this.h5play()
					};
					//#endif
				
			},
            playvod(item) {
				console.log(item)
                this.$set(this, 'vodnum', item.name)
				this.$set(this, 'vodnums', '')
				if (item.url.indexOf('m3u8') !== -1 || item.url.indexOf('mp4') !== -1) {
					 this.playurls = item.url;
				}else{
					this.isurl = true
					this.playurls = this.jx_list[0].url + item.url;
				}
				this.playnum = item.num;
				this.vodtitle = item.name;
				
				//#ifdef H5
				uni.setNavigationBarTitle({title:this.data.vod_name + '-' + item.name});
				if(this.djs==0){
					this.h5play()
				};
				//#endif
				 /*uni.navigateTo({
				 	url:'json_play?vod_url=' + item.url
				 })*/
				
            },
			playvods(item) {
				console.log(item.num)
				this.$set(this, 'vodnum', '')
				this.$set(this, 'vodnums', item.name)
			    if (item.url.indexOf('m3u8') !== -1 || item.url.indexOf('mp4') !== -1) {
			    	 this.playurls = item.url;
			    }else{
			    	this.isurl = true
			    	this.playurls = this.jx_list[0].url + item.url;
			    }
				this.playnum = item.num;
				this.vodtitle = item.name;
				//#ifdef H5
				uni.setNavigationBarTitle({title:this.data.vod_name + '-' + item.name});
				if(this.djs==0){
					this.h5play()
				};
				//#endif
			},
			select_jx(){
				let _this = this
				let names = this.jx_list.map(e => e.name);
				uni.showActionSheet({
				     itemList: names,
				     success: function (res) {
						_this.playurls = _this.jx_list[res.tapIndex].url + _this.playurls;
				     },
				     fail: function (res) {
				     }
				 });
			},
            touping(item) {
				if(uni.getSystemInfoSync().platform == 'ios' || uni.getSystemInfoSync().platform == 'android'){
					this.videoContext.pause();
					uni.navigateTo({
					    url: 'dlna?name=' + this.data.vod_name + '&url=' + this.playurls +'&vodtype=' + this.vodtype + '&vodtitle=' + this.vodtitle
					})
				}else{
					this.showToast('请至app端操作')
				}
                
            },
            showSwitchRate(rate) {
				if(uni.getSystemInfoSync().platform == 'ios' || uni.getSystemInfoSync().platform == 'android'){
					if(this.play_type == 0){
						this.rateShow = true;
					}else{
						this.showToast('该模式不支持')
					}
				}else{
					this.showToast('请至app端操作')
				}
                
            },
            // 切换倍速
            switchRate(e) {
                let rate = Number(e.currentTarget.dataset.rate);
                this.currentRate = rate;
                this.rateShow = false;
                this.videoContext.playbackRate(rate);
            },
            getdata(is) {
                this.GetJson(this.ip + 'Index_api.php', 'POST', {
					type:'vod_like',
                    types:this.data.vod_class,
					vodtype:2
                }, e => {
					//console.log(e)
                    this.lists = e.lists;
                })
            },
            imgurls() {
                let url = this.imgurl
                if (plus.os.name == 'Android' || plus.os.name == 'iOS') {
                    plus.runtime.openURL(url);
                    return
                }

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
            adtap(item) {
                plus.runtime.openWeb(item.url);
            },
            plays(item) {
                uni.redirectTo({url: '../play/vplay?id=' + item.vod_id})
            },
			videoerr(){
				this.showToast('该影片已失效，无法播放');
			},
			waiting(){
				this.Hctext= '视频缓冲中...'
			},
			controlstoggle(e){
				this.showToast('测试')
			},
			endvideo(num){
				//console.log('');
				if(this.jlist.length != 1 || this.playlist.length!=1){
					let listdata = this.data_type == 1 ? this.jlist : this.playlist;
					let _this = this;
				    let data = listdata.filter((item,index)=>{
				    	//console.log('索引:' +index);
				    	_this.playnum = num + 1;//下一集
				    	return index == num 
				    }).map(item=>{
				    	return {url:item.url,name:item.name,num:item.num}
				    })
				    this.vodtitle = data[0].name;
				    this.playurls = data[0].url;
				    this.$nextTick(()=>{
				    	this.videoContext.play()
				    })
				    this.$set(this, 'vodnum', data[0].name)
				    this.$set(this, 'vodnums', '')
				    //console.log(data[0]);
				    //this.showToast('即将播放下一集')
				    //console.log(data[0].name);
				    //console.log(data[0].num);
				    //console.log(data[0].url);
				}else{
					this.loop = true ;
					this.$nextTick(()=>{
						this.videoContext.play()
					})
				}
			},
            tabbartap(index) {
                this.tabbar = index;
            },
            liwu(item) {
                subNVue.show('slide-in-bottom');
            },
            shoucang() {
                let sign = this.md5(this.$store.state.userinfo.token + 'isfollow' + this.id);
                this.GetJson(this.ip + 'Index_api.php', 'POST', {
					type:'add_follow',
                    sign: sign,
                    token: this.$store.state.userinfo.token,
                    id: this.id,
                    is: this.isfollow ? 'remov' : 'add',
					types:2
                }, e => {
                    //console.log(e)
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
                  this.GetJson(this.ip + 'Index_api.php', 'POST', {
					  type:'add_rec',
                      sign: sign,
                      token: this.$store.state.userinfo.token,
                      id: this.id,
				  	  types:2
                  }, e => {
					  this.$store.state.record.unshift({vod_id:this.id});
                })
            },
			Danmutap(){
				if(uni.getSystemInfoSync().platform == 'ios' || uni.getSystemInfoSync().platform == 'android'){
					this.Danmu = true;
				}else{
					this.showToast('请至app端操作')
				}
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
				    this.GetJson(this.ip + 'Index_api.php', 'POST', {
				    	type:'add_danmu',
				    	sign:sign,
				    	token:this.$store.state.userinfo.token,
				    	id:this.id,
				        text: this.danmuValue,
				        color:this.danmucolor(),
				    	vod_time:this.dmtime
				    }, e => {
						console.log(e)
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
			    } else if (text == null) {
			        this.showToast('请输入具体内容')
			    } else {
			        let sign = this.md5(this.$store.state.userinfo.token);
			        this.GetJson(this.ip + 'Index_api.php', 'POST', {
			        	type:'add_comment',
			            sign: sign,
			            token: this.$store.state.userinfo.token,
			            info: text,
			            id: this.id
			        }, e => {
			            this.hideload();
			            if (this.isdata(e)) {
							this.CommentList.unshift({
								comment_content:text,
								addtime:parseInt(Date.now().toString().slice(0, -3)),
								user:{avatar:this.$store.state.userinfo.avatar,name: this.$store.state.userinfo.name},
							});
							this.info = '';
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
            Share() {
				if(uni.getSystemInfoSync().platform == 'ios' || uni.getSystemInfoSync().platform == 'android'){
					let share = this.share;
					console.log(this.share)
					let shareData = {
						shareUrl: getApp().url + '/api/Invitation.php?code=' + this.$store.state.userinfo.Invitation, //推广网址
						shareTitle: share.title, //分享的标题  没有微信appid 这里不显示
						shareContent: share.title + ' - ' + share.text, //分享的内容
						shareImg: '', //分享的图片 没有微信appid 这里不显示
						appId: "wx89559b6d8eXXXXXXX",
						appPath: "pages/wode/wode",
						appWebUrl: this.url,
					};
					// 调用
					let shareObj = appShare(shareData, res => {
						closeShare();
					});
				}else{
					this.showToast('请至app端操作')
				}
				
            	
            },
			h5play() {
				var that = this;
				var player = new SycPlay({
					container: document.getElementById("SycPlayer"),
					header: true, //全屏显示头部信息(返回图标+标题) 
					title: that.data.vod_name + that.vodtitle, //视频标题
					autoplay: true, //自动播放
					minHeader: true, //非全屏时是否显示 标题
					//playNext: true, //全屏时是否显示下一集图标   选集数组小于等于1时不显示
					screenshot: true,
					airplay: false,
					loop: true, //循环播放 默认false
					live: false, //是否是直播
					playbackSpeed: [1.0, 1.25, 1.5, 2.0, 2.5, 3.0],
					playbackSpeedTxt: "倍数",
					//speedIndex: 0, //playbackSpeed数组下标 初始的速度 默认0
					showMobilePlay: true, //手机中心播放暂停图标 
					//currentIndex: 0, //设置当前激活选集的下标索引  默认0
					height:220, //高度px
					//spisodes: [], //选集数组 空数组默认不显示
					//spisodes: that.playlist, //选集数组 空数组默认不显示
					//spisodesTxt: "选集",
					//showDanmaku: false, //弹幕开启  配置danmaku后才可生效  false关闭图标样式切换等
					//landscape: false, //手机端默认进入横屏全屏时设置true  默认false
					video: {
						url: that.playurls, //视频url
						pic:'',
						type: 'customHls',
						customType: {
						    customHls: function (video, player) {
						        const hls = new Hls();
						        hls.loadSource(video.src);
						        hls.attachMedia(video);
						    },
						},
					},
					//danmaku: {
					//	id: that.vod_id,
					//	api: ''   ,//这里填写弹幕地址
					//	user: 'dplayer',
					//	addition: []
					//}
				});

				player.on('changeSpisodes', function() {
					let currentIndex = player.options.currentIndex;
					let url = that.playlist.filter((item,index,url)=>{
						return index == currentIndex 
					}).map(item=>{
						return item.url
					})
					player.switchVideo({
						url: url
					});
					player.play();
				});
				player.on('playnext', function() {
				   
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
			}
        },
        onPullDownRefresh() {
            this.Get_vod_comment(true);
        }
    }
</script>

<style>
    page {
        background-color: #111111;
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
    .vodclass {
        background: #161616;
        margin-top: 15rpx;
        border-radius: 5rpx;
		padding:25rpx 20rpx;
		text-align: center;
        color: #707688;
        font-size: 23rpx;
        display: inline-block;
        margin-right: 15rpx;
    }
    .showleft{
		background: #161616;
		margin-top: 15rpx;
		border-radius: 5rpx;
		padding:25rpx 20rpx;
		text-align: center;
		color: #707688;
		font-size: 23rpx;
		display: inline-block;
		margin-right: 15rpx;
	}
    .show {
		background: #FC4166;
		margin-top: 15rpx;
		border-radius: 5rpx;
		border-radius: 5rpx;
		padding:25rpx 20rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 23rpx;
		display: inline-block;
		margin-right: 15rpx;
    }
	.jxbutton {
	    background: #161616;
	    margin-top: 15rpx;
	    border-radius: 100rpx;
		padding:25rpx 20rpx;
		text-align: center;
	    color: #707688;
	    font-size: 23rpx;
	    display: inline-block;
	    margin-right: 15rpx;
	}
	.jxshow {
		background: pink;
		margin-top: 15rpx;
		border-radius:100rpx;
		padding:25rpx 20rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 23rpx;
		display: inline-block;
		margin-right: 15rpx;
	}
    .vodselect{
		border: 1rpx solid #555555;
        margin-top: 15rpx;
        border-radius: 5rpx;
		padding:15rpx 20rpx;
		text-align: center;
        color: #555555;
        font-size: 23rpx;
        display: inline-block;
        margin-right: 10rpx;
    }
    
    .selectshow {
		border: 1rpx solid #FC4166;
		margin-top: 15rpx;
		border-radius: 5rpx;
		padding:15rpx 20rpx;
		text-align: center;
		color: #FC4166;;
		font-size: 23rpx;
		display: inline-block;
		margin-right: 10rpx;
    }
    .video {
        width:100%;
    }
	.vinfo{
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
    .scroll-view{
    	white-space: nowrap;
    	margin-top: 10rpx;
    }
    .font {
        background-image: linear-gradient(to right, #521fad, #7b42e0, #521fad);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .fonts {
        background-image: linear-gradient(to right, #f93bd7, #FE82E3, #FC5A8B);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .fontss {
        background-image: linear-gradient(to right, #6b45aa, #7649c0, #6b45aa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
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
    
    .fenge {
        text-align: center;
        border-radius: 1rpx 0rpx 0rpx 1rpx;
        width: 750rpx;
        color: #FFFFFF;
        background-color: #222640;
        height: 20rpx;
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
        top: 15rpx;
        left: 150rpx;
        z-index: 99;
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
        top: 15rpx;
        left: 150rpx;
        z-index: 99;
    }
    .comments{
		/* #ifdef H5 */
		margin-top:390rpx;
		/*#endif*/
		/* #ifdef APP-PLUS */
		margin-top: 450rpx;
		/*#endif*/
		
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

    .lista {
        margin: 8rpx 11rpx;
        padding: 20rpx 9rpx;
        border-bottom: 1rpx solid #111111;
    }

    .avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 100rpx;
        margin-right: 42rpx;
        background-color: #111111;

    }
    
    .taga {
		color: #a09e9e;
        border-radius: 1rpx;
        font-size: 25rpx;
        margin-left: -10rpx;
    }
    .commentinfo{
       color:#FFFFFF;
	   font-size: 30rpx;
     }
    .shijian {
        font-size: 25rpx;
        color: #a09e9e;
        margin-top: 1rpx;
        margin-left: 20rpx;
    }
    .tabtop{
		/* #ifdef H5 */
		/*top: 450rpx;*/
		top: 0;
		/*#endif*/
		/* #ifdef APP-PLUS */
		/*margin-top: 495rpx;*/
		top: 0;
		/*#endif*/
		height: 90rpx;
	}
	.datatop{
		margin: 20rpx;
		/* #ifdef H5 */
		margin-top: 500rpx;
		/*#endif*/
		/* #ifdef APP-PLUS */
		margin-top: 270px;
		/*#endif*/
		
	}
    .tabbar {
        width: 750rpx;
        background-color: #0e0e0e;
        margin-right: 0rpx;
    }

    .tabbar>text {
        color:#707688;;
        margin: 20rpx;
       /* display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;*/
        font-size: 35rpx;
        padding: 8rpx 15rpx;
    }
    .ico{
		padding: 20rpx 30rpx ;
		background-color: #1a1f25;
		border-radius: 10rpx;
	}
    .newtabbar {
        margin: 5rpx;
        color: #bc5d8a;
        font-size: 35rpx;
        font-weight: 700;
        border-bottom: 3px solid #475289;
    }

    .listv {
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 20rpx;
    }

    .list {
        border-radius: 5rpx;
        box-shadow: 10rpx 10rpx 8rpx 4rpx rgba(0, 0, 0, 0.05);
        position: relative;
        background-color: #000000;
        width: 230rpx;
        margin-bottom: 30rpx;
        animation: opacitys .1s;
    }

    .list>image {
        width: 230rpx;
        height: 300rpx;
        border-radius: 8rpx 8rpx 0 0;
        background-color: #111111;
        box-shadow: 5px 10px 10px rgba(0, 0, 0, .5);
    }

    .list>view>image {
        width: 60rpx;
        height: 60rpx;
        border-radius: 100px;
        margin-right: 10rpx;
        background-color: #111111;
        box-shadow: 5px 10px 10px rgba(0, 0, 0, .5);
    }

    .hottitle {
        color: #FCFCFC;
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
        background-color: #000000;
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
        width: 600rpx;
        height: 80rpx;
        border-radius: 20rpx;
        color: #525e98;
        background-color: #000000;
        font-size: 35rpx;
        padding: 18rpx;
    }

    .dark {
        min-height: 100vh;
        background-color: #111111 !important;
        overflow: hidden;
    }

    .dark input {
        color: #c7cddb;
    }

    .swiper {
        margin-top: -150rpx;
        height: 200rpx;
        margin: 20rpx;
    }

    .swiper-item>image {
        width: 98%;
        height: 200rpx;
        border-radius: 10rpx;
        margin-left: 8rpx;
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
        right:0;
        top: 0;
		margin-top: 48%;
        transform: translateY(-10%);
        z-index: 900;
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
	.load-video-text {
		font-size: 36rpx;
		color: #fff;
		position: absolute;
		background-image: -webkit-linear-gradient(left, #ff0, #dd524d 25%, #bdcd34 50%, #dd524d 75%, #ff0);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
		-webkit-background-size: 200% 100%;
		-webkit-animation: masked-animation 3s infinite linear;
		border: 0;
		font-size: 33rpx;

	}
	.flotage{
		position: absolute;
		top: 80%;
		left: 50%;
		transform: translate(-50%,-50%);
	}
	.flotageY{
		position: absolute; 
		right: 30rpx;
		top: 40%;
		transform: translateY(-50%);
	}
	
    /* 视频CSS结束 */
</style>