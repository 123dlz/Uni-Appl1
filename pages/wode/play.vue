<template>
	<view style="background-color:#181b2e">
    <view style="background-color: #000000;position: fixed;left: 0;right: 0;top: 0;z-index: 1;height: 80rpx;"></view>
 	<view style="position: fixed;left: 0;right: 0;top: 80rpx;z-index: 1;">
 	<video v-if="djs==0 || adstate==2" 
 	id="myVideo" 
 	class="video" :src="playurls"  
 	:autoplay="true" 
 	:loop="true" 
 	:controls="true" 
 	:auto-pause-if-open-native="true"
 	:vslide-gesture-in-fullscreen="false"
 	:vslide-gesture="true"
 	:style="{height:height + 'px'}"> 
 	</video>
		<view v-if="adstate==1">
		<view  style="width: 750rpx;height: 418rpx;background-color: #000000;" v-if="djs!=0">
		
		<view v-if="adtype==1" @tap="imgurls">
			<image  style="width: 750rpx;height: 418rpx;" :src="adimg" mode="aspectFill"></image>
			<text  class="imgtext">{{djs}}秒后播放视频 <font style="color: #FFFF00;"> 开通VIP去广告</font></text>
		</view>
		<view v-if="adtype==2" @tap="imgurls">
		<video  v-if="adtype==2" class="video" :src="advideo"  :autoplay="true" :loop="true" :controls="false" :auto-pause-if-open-native="true" :style="{height:height + 'px'}"> </video>
		<cover-view  class="beisu" </cover-view>
		<cover-view  class="videotext">{{djs}}秒后播放视频  开通VIP去广告</cover-view>
		</view>
		</view>
		<view style="margin-top: 10rpx;"></view>
		</view>
		
		</view>

		<view >
              <view class="buttom row">
                  <view>
            <textarea class="textarea" v-model="info" placeholder="输入您想要发表的内容。" />
            </view>
            <text class="btns" @tap="btns">发布</text>
                 </view>
               </view>			
			<view class="main">
				<view class="tabbar row" style="margin-top: 495rpx;height: 90rpx;position: fixed;left: 0;right: 0;top: 0;z-index: 1;">
					<text  @tap="tabbartap(1)" :class="tabbar == 1 ? 'newtabbar' : ''">影片介绍</text>
					<text style="margin: 10rpx;" @tap="tabbartap(2)" :class="tabbar == 2 ? 'newtabbar' : ''">评论(<font style="color:#895bd6;">{{pnum}}</font>)</text>
					<text style="margin: 10rpx;" @tap="showSwitchRate" >倍速x<font style="color:#895bd6;">{{ currentRate }}</font></text>
					<image @tap="touping" style="width: 50rpx;height: 50rpx;margin: 20rpx;" src="../../static/font/tp.png"></image>
					
					<view class="multi-list rate" :class="{ active: rateShow }">
					  <view v-for="(item, index) in ['0.5', '0.8', '1.0', '1.25', '1.5']" :key="index" class="multi-item rate" :data-rate="item" @tap="switchRate" :class="{ active: item == currentRate }" >
					{{ item }}</view>
					</view>
				</view>	
				
				
				<view class="top" v-if="tabbar == 1" >
					<view  style="margin: 20rpx;margin-top: 600rpx;">
						<view >
							<text class="fonts" style="font-size: 40rpx;font-weight: 700;">{{playname}}</text>
						</view>
						
						
						
						<view class="tagva row" style="font-size: 30rpx;margin-top: 20rpx;color: #4b5389;">
						分类: {{playclass}}  | 地区: {{diqu}} | 年份: {{nianfen}}
						</view>

					    <view class="tagva font row" style="font-size: 30rpx;margin-top: 20rpx;color: #8C8989;">
						{{text}}
					   </view>
						<!--<view class="tagva row" style="font-size: 30rpx;margin-top: 20rpx;color: #8C8989;">
												导演：{{daoyan}}
						</view>					   
											   
					    <view class="tagva row" style="font-size: 30rpx;margin-top: 20rpx;color: #8C8989;">
						演员：{{yanyuan}}
					   </view>-->
					   
                     </view> 
	               	<!--<view style="font-size: 35rpx;margin: 20rpx;font-weight: 700;">
	               		影片介绍
	               	</view>
	               	
					<view style="color: #909090;font-size: 30rpx;margin: 20rpx;line-height: 40rpx;">
						{{text}}
					</view>-->
	              	               
				<swiper class="swiper" :circular="true" :indicator-dots="true" :autoplay="true" :interval="3000"
					:duration="300">
					<swiper-item v-for="item in ad" class="swiper-item" @tap="adtap(item)">
						<image :src="url+item.img" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
						<view style="height: 30rpx;"></view>	
					
					<view class="fenge"></view>	 
					 <view class="fonts" style="font-size: 35rpx;margin: 20rpx;font-weight: 700;">
					 猜您喜欢
					 </view>
	               <view class="listv row" >
	               	<view class="list" v-for="item in lists" :key="item.id" @tap="plays(item)">
	               		<image :src="item.vod_pic" mode="aspectFill"></image>
	               			<view style="margin: 10rpx;"> 
	               			<text class="hottitle fonts">{{item.vod_name}}</text>
	               			<view style="margin-top: 20rpx;"></view>
	               			</view>
	               			<view style="margin-top: 5rpx;">
	               				<text class="yanyuan  fontss">{{item.vod_actor==''?'暂无演员信息':item.vod_actor}}</text>
	               			</view>
	               			<view style="height: 10rpx;"></view>
	               			</view>
	               		
	               			</view>	
					</view>
						<view style="height: 130rpx;"></view>
					</view>
					

	<!--评论-->
	<view  v-if="tabbar == 2" style="margin-top: 470rpx;background-color:#181b2e">

	
	<view class="font" style="margin: 40rpx;font-size: 35rpx;font-weight: 600;">全部评论（{{pnum}}）</view>
    <view >
		<view class="pl" style="background-color:#181b2e ;">
			
    <view class="lista" style="margin-top:0rpx" v-for="(item,index) in list" :key="index.id">
       
                <view class="user" >
                    <image :src="url + item.avatar" mode="aspectFill"></image>
                </view>
                <view class="names font">
                    <text class="taga">{{item.name}}</text>
                </view>
           
            <view>
                <text class="shijian font">{{gettime(item.addtime,'yyyy-MM-dd hh:mm')}}</text>
                <view>
                    <view class="plinfo"style="margin-top:40rpx">
    			
    					<text class="info fonts">{{item.comment_content}}</text>
                       
                    </view>
               </view>
    
            </view>
             </view>
           <view >
           <null   v-if="list.length == 0 && !load" info="还没有评论,来打个招呼吧!"></null>
		   <view style="height: 500rpx;"></view>
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
	import appShare, { closeShare } from '../../js_sdk/appShare.js';
	const innerAudioContext = uni.createInnerAudioContext();
	let subNVue,subNVue2;
	export default {
		data() {
			return {
				rateShow: false, // 倍速浮层
				currentRate: 1.0, // 默认倍速
				data:'',
				vurl:'',
				imgurl:'',
				adstate:'',
				adtype:'',
				adtime:'',
				adimg:'',
				advideo:'',
				djs:'',
				ad:[],
				isDark:false,
				commentContent: '',
				id:'',
				playurls:'',
				playurlss:'',
				playname:'',
				playtime:'',
				playclass:'',
				tabbar: 1,
				load: true,
				audiopay:false,
				isfollow:false,
				height:200,
				lists:[],
				list:[],
				info:'',
				pnum:'',
				text:'',
				daoyan:'',
				yanyuan:'',
				diqu:'',
				nianfen:'',
				pingfen:''
				
		
			}
		},
		computed: {
			user(){
				return this.$store.state.userinfo;
			}
		},
		onUnload() {
			innerAudioContext.stop();
		},
		onLoad(item) {
		 this.data = item
		 this.id = item.id
		 this.text = item.text
		 this.daoyan =item.daoyan
		 this.yanyuan =item.yanyuan
		 this.diqu = item.diqu
		 this.nianfen = item.nianfen
		 this.pingfen = item.pingfen
		 this.playurl = item.play
		 this.playname = item.playname
		 this.playtime = item.playtime
		 this.playclass = item.playclass
		 this.playimg = item.playimg
         this.playurls = this.playurl.slice(3,this.playurl.length-0) 
        this.getdata();
		this.getpinglun();
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
			this.videoContext = uni.createVideoContext('myVideo')
			uni.$emit('sendNum', {
			    title:this.playname,
				vodid:this.id
			});
			uni.$emit('sendNum', {
			    text:this.text,
			    daoyan:this.daoyan,
			    yanyuan:this.yanyuan,
			    diqu:this.diqu,
			    nianfen:this.nianfen,
			    pingfen:this.pingfen,
			    playurl:this.playurl,
			    playname:this.playname,
			    playtime:this.playtime,
			    playclass:this.playclass
			});
			subNVue = uni.getSubNVueById('gift');
			subNVue2 = uni.getSubNVueById('more');
			let json = this.$store.state.follow;
			for (let i in json) {
				if(json[i].ruserid == this.id){
					this.isfollow = true;
					break;
				}
			}
			let jsons = this.$store.state.record;
			for (let i in json) {
				if(json[i].ruserid == this.id){
					this.isrecord = true;
					break;
				}
			}			
		},
		methods: {
			touping(){
				this.videoContext.pause();
				uni.navigateTo({
					url:'../play/dlna?name=' +this.playname + '&url=' + this.playurls
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
			getad(is) {
				this.load = true;
				this.GetJson(this.ip+'ad.php', 'POST', {}, e => {
					this.ad = e.ad;
					this.load = false;
					uni.stopPullDownRefresh();
					if(!plus.navigator.hasSplashscreen())plus.navigator.closeSplashscreen();
					uni.setStorage({
						key:'maindata',
						data:e
					})
				})
			},
		     getdata(is) {
				this.GetJson(this.ip+'vtuijian.php', 'POST', {type:this.playclass}, e => {
					this.lists = e.lists;
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
			plays(item){
				uni.redirectTo({
					url: '../play/vplay?data='+ item
						+ '&play='+ item.vod_play_url 
						+'&playname=' + item.vod_name 
						+ '&playimg=' + item.vod_pic 
						+ '&playtime=' + item.vod_remarks 
						+ '&playclass=' + item.vod_class 
						+ '&id=' + item.vod_id
						+'&text='+item.vod_blurb
						+'&yanyuan='+item.vod_actor
						+'&daoyan='+item.vod_director
						+'&diqu='+item.vod_area
						+'&nianfen='+item.vod_year
						+'&pingfen='+item.vod_score
					})
			
		},
			tabbartap(index) {
				this.tabbar = index;
			},
			tabbartaps(index) {
				this.tabbars = index;
			},			
            more(item){
				subNVue2.show('slide-in-bottom');
			},
			liwu(item){
				subNVue.show('slide-in-bottom');
			},
			shoucang(){
				let sign = this.md5(this.user.token + 'isfollow' + this.id);
				this.GetJson(this.ip + 'setfollow.php','POST',{
					sign:sign,
					token:this.user.token,
					id:this.id,
					is:this.isfollow ? 'remov' : 'add'
				},e=>{
					console.log(e)
					if(this.isdata(e)){
						if(this.isfollow){
							let json = this.$store.state.follow;
							for (let i in json) {
								if(json[i].ruserid == this.id){
									this.$store.state.follow.splice(i,1);
									this.isfollow = false;
									this.showToast('已取消收藏')
									break;
								}
							}
						}else{
							let datas = JSON.parse(JSON.stringify(this.data));
							
							this.$store.state.follow.push({
								ruserid:datas.id
								
							});
							
							this.isfollow = true;
							this.showToast('已加入收藏')
						}
					}
				})
			},

			getpinglun(is){
				if(is === true)this.list = [];
				this.load = true;
				let sign = this.md5(this.$store.state.userinfo.token + this.list.length.toString() + 'getpinglun');
				this.GetJson(this.ip + 'getpinglun.php','POST',{
					sign:sign,
					num:this.list.length,
					token:this.$store.state.userinfo.token,
					type:this.id,
				},e=>{
					this.load = false;
					uni.stopPullDownRefresh();
					if(this.isdata(e)){ 
						this.list = [...this.list,...e.list];
						this.Invitation = e.Invitation;
						this.pnum = e.pnum;
					}
				})
			},			
		btns(){
			if(this.info == ''){
				this.showToast('请输入具体内容')
			}else if(this.info == ''){
				this.showToast('请输入具体内容')
			
				}else{
					this.tijiao('');
				
				
			}
		},
		tijiao(){
			let sign = this.md5(this.$store.state.userinfo.token);
			this.GetJson(this.ip + 'fabupinglun.php','POST',{
				sign:sign,
				token:this.$store.state.userinfo.token,
				info:this.info,
				id:this.id
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
	}
}
</script>

<style>
	page{
		background-color: #181b2e;
	}
    .video{
		width: 750rpx;
	}
	.font{
		background-image: linear-gradient(to right ,#521fad,#7b42e0,#521fad); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.fonts{
		background-image: linear-gradient(to right ,#f93bd7,#fcea22,#f93bd7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.fontss{
		background-image: linear-gradient(to right ,#6b45aa,#7649c0,#6b45aa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.top{
		margin-top: 100rpx;
		background-color: #181b2e;
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

    .fenge{
		text-align: center;
		border-radius: 1rpx 0rpx 0rpx 1rpx;
		width: 750rpx; 
		color:#FFFFFF;
		background-color: #222640;
		height: 20rpx;
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
		top: 15rpx;
		left:150rpx;
		z-index: 99;
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
		top: 15rpx;
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
	.yanyuan{
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
	.lista{
		background-color: #181b2e;
		margin: 8rpx 11rpx;
		padding: 20rpx 9rpx;
		border-bottom: 1rpx solid #21253e;
	}
	.user{
		margin-top: 15rpx;
		background-color: #181b2e;
	}
	
	.user>image{
		width: 90rpx;
		height: 90rpx;
		border-radius: 100rpx;
		margin-right: 42rpx;
		background-color: #181b2e;
	
	}
	.user>view{
		color: #FFFFFF;
	}
	.names{
		margin-top:-97rpx;
		margin-left: 115rpx;
		
	}
	.taga {
		
		border-radius: 1rpx;
		font-size:32rpx;
		font-weight: 600;
		color: #000000;
		margin-left: 15rpx;
	}
	.shijian{
		font-size: 25rpx;
		color:#a09e9e;
		margin-top: 5rpx;
		margin-left: 135rpx;
	}
	.plinfo{
	margin-left: 130rpx;
	}
	.tabbar {
	    width: 750rpx;
        background-color: #222640;
		margin-top: 0rpx;
		margin-right: 0rpx;
	}

	.tabbar>text {
		color: #475289;
		margin: 20rpx;
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		font-size: 35rpx;
		padding: 8rpx 0;
	}

	.newtabbar {
		margin: 5rpx;
		color: #bc5d8a;
		font-size: 35rpx;
		font-weight: 700;
		border-bottom:3px solid #475289;
	}
	.listv {
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 20rpx;
		background-color: #181b2e;
	}

	.list {
		border-radius: 20rpx;
		/*box-shadow: 8rpx 4rpx 8rpx 4rpx rgba(0, 0, 0, 0.05);*/
		background-color: #181b2e;
		width: 347rpx;
		margin-bottom: 30rpx;
		animation: opacitys .1s;
	}

	.list>image {
		width: 350rpx;
		height: 400rpx;
		border-radius: 8rpx;
		background-color: #2b3151;
		box-shadow: 5px 10px 10px rgba(0, 0, 0, .5);
	}

	.list>view>image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 100px;
		margin-right: 10rpx;
		background-color: #2b3151;
		box-shadow: 5px 10px 10px rgba(0, 0, 0, .5);
	}
	.hottitle{
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
	.buttom{
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
	.btns{
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
	.textarea{
		margin: 10rpx;
		width: 600rpx; 
		height: 80rpx;
		border-radius: 20rpx;
		color: #525e98;
		background-color: #22263f;
		font-size: 35rpx;
		padding: 18rpx;
	}
	.dark{
	    min-height: 100vh;
	    background-color: #0b0e17 !important;
	    overflow: hidden;
	}
	.dark input{
	    color: #c7cddb;
	}
	.swiper {
		margin-top: -150rpx;
		height: 300rpx;
		margin: 20rpx;
	}
	
	.swiper-item>image {
		width: 700rpx;
		height: 300rpx;
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
