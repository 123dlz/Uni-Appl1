
<template>
	<view style="background-color: #111111;">
    <view style="background-color: #000000;position: fixed;left: 0;right: 0;top: 0;z-index: 1;height: 80rpx;"></view>
		<view style="position: fixed;left: 0;right: 0;top: 80rpx;z-index: 1;">
		<video v-if="djs==0 || adstate==2" 
		id="myVideo" 
		class="video" :src="urls"  
		:autoplay="true" 
		:loop="true" 
		:controls="true" 
		:auto-pause-if-open-native="true"
		:vslide-gesture-in-fullscreen="false"
		:vslide-gesture="true"
		:style="{height:height + 'px'}"> 
		<cover-view  class="beisu" @tap="showSwitchRate">倍速x{{ currentRate }}</cover-view>
		</video>
		<view v-if="adstate==1" style="position: fixed;left: 0;right: 0;top: 80rpx;z-index: 1;">
		<view  style="width: 750rpx;height: 418rpx;background-color: #000000;" v-if="djs!=0">
		
		<view v-if="adtype==1" @tap="imgurls">
			<image  style="width: 750rpx;height: 418rpx;" :src="adimg" mode="aspectFill"></image>
			<text  class="imgtext">{{djs}}秒后播放视频 <font style="color: #FFFF00;"> 开通VIP去广告</font></text>
		</view>
		<view v-if="adtype==2" @tap="imgurls">
		<video  v-if="adtype==2" class="video" :src="advideo"  :autoplay="true" :loop="true" :controls="false" :auto-pause-if-open-native="true" :style="{height:height + 'px'}"> </video>
		<cover-view  class="videotext">{{djs}}秒后播放视频  开通VIP去广告</cover-view>
		</view>
		</view>
		<view style="margin-top: 10rpx;"></view>
		</view>
		</view>

		<view >
              <view class="buttom row">
                  <view>
            <textarea class="textarea" v-model="addinfo" placeholder="输入您想要发表的内容。" />
            </view>
            <text class="btns" @tap="btns">发布</text>
                 </view>
               </view>	
					   
			<view class="main" style="margin-top: 490rpx;position: fixed;left: 0;right: 0;top: 0;z-index: 2;">
				<view class="tabbar row" style="height: 90rpx;">
					<text  @tap="tabbartap(1)" :class="tabbar == 1 ? 'newtabbar' : ''">详情</text>
					<text  @tap="tabbartap(2)" :class="tabbar == 2 ? 'newtabbar' : ''">评论(<font style="color:#fe4c93;">{{pnum}}</font>)</text>
					<text  @tap="tabbartap(3)" :class="tabbar == 3 ? 'newtabbar' : ''">收获礼物(<font style="color:#fe4c93;">{{liwus}}</font>)</text>
					<view class="multi rate" @tap="showSwitchRate"> </view>
					  </view>
					  <view class="multi-list rate" :class="{ active: rateShow }">
					   <view v-for="(item, index) in ['0.5', '0.8', '1.0', '1.25', '1.5']" :key="index" class="multi-item rate" :data-rate="item" @tap="switchRate" :class="{ active: item == currentRate }" >
					     {{ item }}</view>
					  </view>
			       
				</view>	
				<view class="top" v-if="tabbar == 1">
					<view  style="margin: 20rpx;margin-top: 560rpx;">
						<view style="padding-top: 40rpx;margin-top: 15rpx;">
							<image @tap="userpage" style="width: 100rpx;height: 100rpx;border-radius: 100rpx;top: 2rpx;" :src="url+toux"></image>
							
							<text style="float: right;top: 10rpx; ">
							<!--#ifdef APP-PLUS-->
							<text v-if="!isdown" @tap="down" style="margin:20rpx;color: #3d4384;font-size: 50rpx;top: -15rpx;" class="iconfont">&#xe63d;</text>
							<text v-if="isdown" style="margin:20rpx;color: #fc6e88;font-size:35rpx;top: -15rpx;" class="iconfont">{{jindu}}%</text>
							<text @tap="dashang" style="margin:20rpx;color: #3d4384;font-size:50rpx;top: -15rpx;" class="iconfont">&#xe66b;</text>
							<!--#endif -->
							<text @tap="shoucang" v-if="!isfollows" style="margin:20rpx;color: #3d4384;font-size: 50rpx;top: -15rpx;" class="iconfont">&#xe643;</text>
							<text @tap="shoucang" v-if="isfollows" style="margin:20rpx;color: #fc6e88;font-size: 50rpx;top: -15rpx;" class="iconfont">&#xe643;</text>
							<!--#ifdef APP-PLUS-->
							<text @tap="touping" style="margin:20rpx;color: #fc6e88;font-size: 50rpx;top: -15rpx;" class="iconfont">&#xe718;</text>
							<!--#endif -->
							</text>
						</view>
						
						<view style="margin-top: -100rpx;">
						<view style="margin-left: 100rpx;">
						<text style="font-size: 32rpx;padding-left: 15rpx;font-weight: 400;background-image: linear-gradient(to right ,#5a18d1,#9B63FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">{{username}}</text>
						<text @tap="guanzhu" v-if="!isfollowss" style="top: 20rpx; ">
						<font  style="border-radius: 5rpx;border: 1rpx solid #5a18d1;font-size: 27rpx;padding: 3rpx;color:#5a18d1;margin: 10rpx;">关注
						</font>
						</text>
						<text @tap="guanzhu" v-if="isfollowss" style="top: 20rpx; ">
						<font style="border-radius: 5rpx;background-image: linear-gradient(to right ,#5a18d1,#9B63FF);font-size: 27rpx;padding: 3rpx;color:#FFFFFF;margin: 10rpx;">已关注
						</font>
						</text>
						</view>
						<view style="padding-top: -40rpx;margin-left: 100rpx;">
						<text style="font-size: 32rpx;padding-left: 15rpx;font-weight: 400;line-height: 60rpx;color: #6e6e70;">{{gz}}个粉丝 | {{v}}个视频</text>
						</view>
                        <view style="padding-top: 20rpx;display: block;">
						<text  style="font-size: 40rpx;font-weight: 700;padding-top: 30rpx;background-image: linear-gradient(to right ,#5a18d1,#9B63FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">{{infos}}</text>
						</view>
						</view>
						
						<view class="tagva row" style="font-size: 30rpx;margin-top: 20rpx;color: #2d3464;">
							发布时间:{{gettime(addtime,'yyyy-MM-dd hh:mm')}}
						</view>
					</view>
						<!--获取点赞、评论开始-->
						<view class="row" style="margin: 20rpx;">
						    <view style="display: flex;">
						 <text @tap="dianzans" v-if="isfollows" style="font-size: 40rpx;margin-top: 24rpx;" class="iconfont fonts">&#xec7f;</text> 
						
						 <text  @tap="dianzans" class="fonts" style="font-size: 25rpx;padding-top: 25rpx;margin-right: 10rpx;">点赞数:<font style="color:#fe4c93">{{zan}}</font></text>
						<text style="font-size: 40rpx;margin-top: 17rpx;padding: 10rpx 10rpx;" class="iconfont fonts">&#xe64b;</text> 
						 <text  class="fonts"  style="font-size: 25rpx;padding-top: 25rpx;padding-right: -10rpx;">观看次数:<font style="color:#fe4c93">{{jilu}}</font></text>
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
					
					
					
              <view class="lista" style="margin-top:0rpx" v-for="(item,inde)  in list" :key="inde.id">
       
                <view class="user">
                    <image :src="url + item.user.avatar" mode="aspectFill"></image>
                </view>
                <view class="names">
                    <text class="taga">{{item.user.name}}</text>
                </view>
            <view>
                <text class="shijian">{{gettime(item.time,'yyyy-MM-dd hh:mm')}}</text>
                <view>
                    <view class="plinfo"style="margin-top:2rpx">
    			
    					<text class="info" style="font-size: 28rpx;">{{item.info}}</text>
                       
                    </view>
               </view>
    
            </view>
             </view>
           <view >
           <null   v-if="list.length == 0 && !load" info="还没有评论,来打个招呼吧!"></null>
		   <view style="height: 500rpx;"></view>
           </view> 
					<view class="fenge"></view>
					
                                 </view> 

					<!--评论-->
	<view class="jsjs" v-if="tabbar == 2" style="margin-top: 450rpx;">

	<view style="margin-top: 30rpx;">
	<view  style="margin: 40rpx;font-size: 35rpx;font-weight: 600;padding-top: 30rpx;">全部评论（{{pnum}}）</view>
	</view>
	
    <view >
		<view class="pl">
			
    <view class="lista" style="margin-top:0rpx" v-for="(item,index) in list" :key="index.id">
       
                <view class="user">
                    <image :src="url + item.user.avatar" mode="aspectFill"></image>
                </view>
                <view class="names">
                    <text class="taga fonts">{{item.user.name}}</text>
                </view>
            <view>
                <text class="shijian">{{gettime(item.time,'yyyy-MM-dd hh:mm')}}</text>
                <view>
                    <view class="plinfo"style="margin-top:8rpx">
    			
    					<text class="info" style="font-size: 28rpx;">{{item.info}}</text>
                       
                    </view>
               </view>
    
            </view>
             </view>
           <view >
           <null   v-if="list.length == 0 && !load" info="还没有评论,来打个招呼吧!"></null>
		   <view style="height: 650rpx;"></view>
           </view>
		   </view>
		</view>	
	  </view>
	  <!--评论-->
      <view class="jsjs" v-show="tabbar == 3" style="margin-top: 580rpx; background-color: #111111;">
      
      <view style="height: 10rpx;"></view>
       <view>
       	<view class="liwu" v-for="item in liwu" :key="item.id">
       		<view class="row v1">
       			<image :src="url+item.users.avatar"></image>
       			<view>
					<text class="fonts" style="font-size: 30rpx;font-weight: 600;padding-top:20rpx;">{{item.users.name}}</text>
       				<text class="fonts" style="font-size: 35rpx;">打赏礼物：<font class="res">{{item.gif.title}}</font></text>
					<text style="font-size: 28rpx;color: #515ca2;">{{gettime(item.time,'yyyy.MM.dd')}}</text>
       			</view>
       			<image :src="url + item.gif.img" mode=""></image>
       		</view>
       	</view>
       	<load :style="{opacity:load ? '1' : '0'}"></load>
       	<null class="null" v-if="!load && liwu.length == 0" info="该视频没有收到礼物"></null>
       </view>
            
      	   <view style="height: 650rpx;"></view>
       </view>
		
		
	  
	          </view>
			  
			</view>
		</view>
		
	</view>

</template>

<script>
	import appShare, { closeShare } from '../../js_sdk/appShare.js';
	const innerAudioContext = uni.createInnerAudioContext();
	let subNVue,subNVue2; 
	var that
	export default {
		data() {
			return {
				rateShow: false, // 倍速浮层
				currentRate: 1.0, // 默认倍速
				vurl:'',
				imgurl:'',
				adstate:'',
				adtype:'',
				adtime:'',
				adimg:'',
				advideo:'',
				djs:'',
				urls:'',
				id:'',
				infos:'',
				toux:'',
				v:'',
				gz:'',
				liwus:'',
				username:'',
				addinfo:'',
				pnum:'',
				zan:'',
				jilu:'',
				money:'',
				tabbar: 1,
				isplay:false,
				load: false,
				isfollows:false,
				isfollowss:false,
				isdianzan:false,
				isrecordss:false,
				height:200,
				list:[],
				ad:[],
				liwu:[],
				isdown:false,
				jindu:0
				}
		},
		computed: {
			vip(){
				return this.$store.state.vip.vip;
			},
			user(){
				return this.$store.state.userinfo;
			}
		},
		onUnload() {
			innerAudioContext.stop();
		},
		onLoad(item) {
		this.data=item
	    this.id=item.id
		this.urls = item.url
		this.toux=item.toux
		this.v=item.v
		this.gz=item.gz
		this.liwus=item.liwu
		this.userid=item.userid
		this.username=item.username
		this.infos = item.infos
		this.money = item.money
		this.addtime=item.addtime
		this.jilus();
		this.dianzans();
		this.getpinglun();
		this.getliwu();
		this.getad();
		
		this.GetJson(this.ip + 'setapp.php','GET',{},e=>{
			if(this.isdata(e)){
			this.advideo = e.advideo;
			this.adimg = e.adimg;
			this.adon = e.adon;
			this.adtype = e.adtype;
			this.adtime = e.adtime;
			this.adstate = e.adstate;
			this.imgurl = e.imgurl;
			this.vurl = e.vurl;
			if(this.adstate == '1' && this.$store.state.vip.vip==0){
				let end = (new Date()).getTime() + Number(e.adtime);
				   this.daojis(end,null)
				let initimes = setInterval(()=>{
				   this.daojis(end,initimes)
				  },500)
				}
			}
		})
			uni.getStorage({
				key:'maindata',
				success: (e) => {
					this.ad = e.data.ad;
					this.$nextTick(function(){
						plus.navigator.closeSplashscreen();
					})
				}  
			})
		},
		 
		onReady() {
			//#ifdef H5
			this.videoContext = uni.createVideoContext('myVideo', this);
			if(this.urls){
				this.$nextTick(()=>{
					this.videoContext.play()
				})
			}
			//#endif
			//#ifdef APP-PLUS
			this.videoContext = uni.createVideoContext('myVideo')
			//#endif
			uni.$emit('sendNum', {
			   userid:this.userid,
			   username:this.username,
			   title:this.infos,
			   vodid:this.id
			});
			subNVue = uni.getSubNVueById('gift');
			
			let json = this.$store.state.follows;
			for (let i in json) {
				if(json[i].ruserid == this.id){
					this.isfollows = true;
					break;
				}
			}
			let jsons = this.$store.state.followss;
			for (let s in jsons) {
				if(jsons[s].ruserid == this.userid){
					this.isfollowss = true;
					break;
				}
			}			
		},
		methods: {
			touping(){
				this.videoContext.pause();
				uni.navigateTo({
					url:'../play/dlna?name=' +this.infos + '&url=' + this.urls
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
			tabbartaps(index) {
				this.tabbars = index;
			},
			dashang(item){
				subNVue.show('slide-in-bottom');
			},
			userpage(){
				uni.navigateTo({
					url:'userpage?userid='+this.userid +'&toux='+this.toux +'&username='+this.username
				})
			},
			getad(is) {
				this.load = true;
				this.GetJson(this.ip+'ad.php', 'POST', {}, e => {
					this.ad = e.ad;
				
				})
			},
			imgurls(){
				let url = this.imgurl
					if(plus.os.name == 'Android' || plus.os.name == 'iOS'){
						plus.runtime.openURL(url);
						return
				}
				uni.navigateTo({url: url}) 
				
			},
			vurls(){
				let url = this.vurl
					if(plus.os.name == 'Android' || plus.os.name == 'iOS'){
						plus.runtime.openURL(url);
						return
				}
				uni.navigateTo({url: url}) 
				
			},
			daojis(end,initimes){
					let times = this.showtime(end);
					if(times === false){
						if(initimes != null)clearInterval(initimes);
					}else{
						this.djs = times
					}
				},
			adtap(item){
				plus.runtime.openWeb(item.url);
			},
			shoucang(){
				let sign = this.md5(this.user.token + 'isfollows' + this.id +this.userid);
				this.GetJson(this.ip + 'setfollows.php','POST',{
					sign:sign,
					token:this.user.token,
					id:this.id,
					userid:this.userid,
					is:this.isfollows ? 'remov' : 'add'
				},e=>{
					console.log(e)
					if(this.isdata(e)){
						if(this.isfollows){
							let json = this.$store.state.follows;
							for (let i in json) {
								if(json[i].ruserid == this.id){
									this.$store.state.follows.splice(i,1);
									this.isfollows = false;
									this.showToast('已取消收藏')
									break;
								}
							}
						}else{
							let datas = JSON.parse(JSON.stringify(this.data));
							this.$store.state.follows.push({
								ruserid:datas.id
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
					title:'正在下载...',
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
			guanzhu(){
				let sign = this.md5(this.user.token + 'isfollowss' + this.userid);
				this.GetJson(this.ip + 'setfollowss.php','POST',{
					sign:sign,
					token:this.user.token,
					id:this.userid,
					is:this.isfollowss ? 'remov' : 'add'
				},e=>{
					console.log(e)
					if(this.isdata(e)){
						if(this.isfollowss){
							let jsons = this.$store.state.followss;
							for (let s in jsons) {
								if(jsons[s].ruserid == this.userid){
									this.$store.state.followss.splice(i,1);
									this.isfollowss = false;
									this.showToast('已取消关注')
									break;
								}
							}
						}else{
							this.$store.state.followss.push({
								ruserid:this.userid
							});
							this.isfollowss = true;
							this.showToast('已关注')
						}
					}
				})
			},
			dianzans(){
				this.load = true;
				let sign = this.md5(this.$store.state.userinfo.token + this.id);
				this.GetJson(this.ip + 'dianzan.php','POST',{
					sign:sign,
					token:this.$store.state.userinfo.token,
					id:this.id
				},e=>{
					this.load = false;
					if(this.isdata(e)){
						//this.showToast('已赞');
						this.zan=e.zan	
					}
				})
			},
			jilus(){
				this.load = true;
				let sign = this.md5(this.$store.state.userinfo.token + this.id);
				this.GetJson(this.ip + 'dtjilu.php','POST',{
					sign:sign,
					token:this.$store.state.userinfo.token,
					id:this.id
				},e=>{
					this.load = false;
					if(this.isdata(e)){
						this.jilu=e.jilus	
					}
				})
			},
			getpinglun(is){
				if(is === true)this.list = [];
				this.load = true;
				let sign = this.md5(this.$store.state.userinfo.token + this.list.length.toString() + 'getpinglun');
				this.GetJson(this.ip + 'getdtpinglun.php','POST',{
					sign:sign,
					num:this.list.length,
					token:this.$store.state.userinfo.token,
					type:this.id,
				},e=>{
					this.load = false;
					uni.stopPullDownRefresh();
					if(this.isdata(e)){ 
						this.list = [...this.list,...e.list];
						this.pnum = e.pnum;
						this.Invitation =e.Invitation;
					}
				})
			},
			getliwu(up){
			if(up === true)this.list = [];this.load = true;
			let sign = this.md5(this.user.token + 'giftc');
			this.GetJson(this.ip + 'vodliwu.php','POST',{
				token:this.user.token,
				sign:sign,
				id:this.id,
				num:this.list.length
			},e=>{
				console.log(e);
				this.load = false;
				uni.stopPullDownRefresh();
				if(this.isdata(e)){
					this.liwu = [...this.liwu,...e.liwu];
				}					
			})
			},
		   
		btns(){
			if(this.addinfo == ''){
				this.showToast('请输入具体内容')
			}else{
					this.tijiao('');
			}
		},
		tijiao(){
			let sign = this.md5(this.$store.state.userinfo.token);
			this.GetJson(this.ip + 'addpinglun.php','POST',{
				sign:sign,
				token:this.$store.state.userinfo.token,
				info:this.addinfo,
				vid:this.id,
				userid:this.userid
			},e=>{
				this.hideload();
				if(this.isdata(e)){
					this.showToast('发布成功');
					  uni.startPullDownRefresh();  
					   setTimeout(() => {  
					    uni.stopPullDownRefresh()  
					    }, 1000);  //评论后刷新页面
							
				}
			})
		},									
		onPageScroll(e) {
			if (e.scrollTop < 0) (this.scale = 1 + Math.abs(e.scrollTop) / 100).toFixed(1);
		}
	},
	onPullDownRefresh() {
		this.getpinglun(true);
		if(this.load=true)this.liwu = []; this.getliwu(true);
	}
}
</script>

<style>
	page{
		left: 0;right: 0;top: 0;
		margin: 0;
		background-color: #000000;
	}
	.fonts{
			background-image: linear-gradient(to right ,#5a18d1,#9B63FF);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
	}
	.imgtext{
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
		left:150rpx;
		z-index: 99;
	}
	.beisu{
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
		left:40%;
		z-index: 99;
	}
	.videotext{
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
		left:150rpx;
		z-index: 99;
	}
	.videoname>text{
		font-size:30rpx;
		font-weight :700;
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
	
    .video{
		width: 750rpx;
		z-index: 1;
	}
	.top{
		margin-top: 100rpx;
	}
	.playtime{
		background-color: #fdc8e1;
		padding: 3rpx 8rpx;
		
		border-radius: 10rpx;
		font-size: 20rpx;
		color: #FFFFFF;
		/*margin-left: 10rpx;*/
		margin-top: 10rpx;
	}
    .width{
        background-color: red;
        height:3px;
    }
    .back{
        flex: 1;
        background-color: #eee;
        height:3px;
        margin-right: 20rpx;
    }
    .load{
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
        border: 1px solid #EEE;
        padding: 20rpx 30rpx;
        width: 100%;
    }
    .fenge{

		border-radius: 1rpx 0rpx 0rpx 1rpx;
		width: 750rpx; 
		color:#FFFFFF;
		background-color: #1c1f35;
		height: 20rpx;
	}

	.videoname>text{
		font-size:30rpx;
		font-weight :700;
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

	.lista{
		
		margin: 8rpx 11rpx;
		padding: 20rpx 9rpx;
		border-bottom: 1rpx solid #1c2036;
	}
	.user{
		margin-top: 15rpx;
	}
	
	.user>image{
		width: 90rpx;
		height: 90rpx;
		border-radius: 100rpx;
		margin-right: 42rpx;
	
	}
	.user>view{
		color: #FFFFFF;
	}
	.names{
		margin-top:-97rpx;
		margin-left: 115rpx;
	}
	.taga {
		background-image: linear-gradient(to right ,#5a18d1,#9B63FF);
		 -webkit-background-clip: text; 
		 -webkit-text-fill-color: transparent;
		border-radius: 1rpx;
		font-size:32rpx;
		font-weight: 600;
		margin-left: 15rpx;
	}
	.shijian{
		font-size: 25rpx;
		color:#a09e9e;
		margin-top: 5rpx;
		margin-left: 135rpx;
	}
	.info{
		background-image: linear-gradient(to right ,#b53af5,#f53a89);
		 -webkit-background-clip: text; 
		 -webkit-text-fill-color: transparent;
	}
	.plinfo{
	margin-left: 130rpx;
	}
	.tabbar {
		color: #3a4373;
	    width: 750rpx;
        background-color: #121525;
		z-index: 2;
	}

	.tabbar>text {
		
		margin: 60rpx;
		font-size: 35rpx;
		padding: 20rpx 0;
	}

	.newtabbar {
		color: #68468b;
		font-size: 35rpx;
		font-weight: 700;
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
		width: 60rpx;
		height: 60rpx;
		border-radius: 100px;
		margin-right: 10rpx;
		background-color: #f3f1f1;
	}
	.hottitle{
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
	.buttom{
		position: relative;
		z-index: 1;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background-color: #222641;
		padding: 8rpx;
		box-shadow: -2rpx -3rpx 15rpx #1c1f35;
		
	}	
	.btns{
		margin: 60rpx auto 0;
		width: 150rpx;
		height: 80rpx;
		margin-top: -7rpx;
		border-radius: 21rpx;
		font-size: 40rpx;
		color: #5f6697;
		display: block;
		text-align: center;
		line-height: 85rpx;
	}	
	.textarea{
		width: 550rpx; 
		height: 80rpx;
		border-radius: 20rpx;
		color: #9B63FF;
		border: 1rpx solid #262a47;
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
	
	.liwu{
		margin: 15rpx 14rpx 0;
		padding: 20rpx 26rpx;
		background-color: #1c2036;
		border-radius: 20rpx;
	}
	.liwu>text{
		font-size: 19rpx;
		color: #292e4d;
		display: block;
		margin-bottom: 19rpx;
	}
	.v1>:nth-child(1){
		width: 120rpx;
		height: 120rpx;
		border-radius: 100rpx;
		margin-right: 26rpx;
	}
	.v1>view{
		display: flex;
		flex: 1;
		flex-direction: column;
	}
	.v1>view>:nth-child(1){
		font-size: 30rpx;
		font-weight: 700;
		display: block;
		margin-bottom: 10rpx;
	}
	.v1>view>:nth-child(2){
		font-size: 30rpx;
		
		font-weight: 700;
	}
	.v1>:nth-child(3){
		font-size: 28;
		color: #cccccc;
		width: 150rpx;
		height: 150rpx;
	}
	.res{
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
} /* 视频CSS结束 */
</style>