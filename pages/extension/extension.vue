<template>
	<view >
		<view class="topbg"><text style="color: #555555;font-size: 45rpx;font-weight: 800;line-height: 250rpx;margin: 10rpx;margin-left: 100rpx;">{{user.name}}</text></view>
		<view >
			
			<view class="v2 row" style="margin-top: -300rpx;">
				<view @tap="quanbu">
					<text class="font">{{rdata == null ? '--' : rdata.zmoney}}</text>
					<text class="font" >总收益（元）</text>
				</view>
				<view @tap="yaoqing">
					<text class="font">{{rdata == null ? '--' : rdata.usernum}}</text>
					<text class="font" >邀请人数(一级用户)</text>
				</view>
			</view>
		</view>
		
		<view style="margin-top: -20rpx;">
			<uni-section  type="line">
				<view >
					<button  style="color: fonta;;margin: 30rpx;border: 1rpx solid #555555;"  @tap="shuoming" plain type="primary" size="mini">推广说明</button>
					<button  style="color: #555555;margin: 30rpx;border: 1rpx solid #555555;"  @tap="erweima" plain type="success" size="mini">推广海报</button>
					<button  style="color: #555555;margin: 30rpx;border: 1rpx solid #555555;"  @tap="Share" plain type="warning" size="mini">微信分享</button>
				</view>
			</uni-section>
		</view>
		

		
		<view class="view">
			<view class="listtop row">
				<text class="iconfont">&#xe604;</text>
				<text class="font">近期收益明细</text>
				<view class="row" @tap="quanbu">
					<text class="font">查看全部</text>
					<text class="iconfont">&#xe625;</text>
				</view>
			</view>
			
			<null v-if="rdata != null && rdata.list.length == 0" class="null" info="暂无数据"></null>
			<view v-if="rdata != null">
				<view class="list" v-for="item in rdata.list">
					<view>
						<text class="font">{{item.tgtype == '0' ? '一级用户' : '二级用户'}}</text>
						<text style="font-size: 22rpx;color:#B8B7B7 ;">{{gettime(item.time,'yyyy.MM.dd')}}</text>
					</view>
					<text class="font" style="margin-top: 20rpx;">{{item.user.name}} 下单{{item.order.type == '0' ? '开通会员' : '充值钻石'}}</text>
					<text style="color: #ff8870;">+{{item.money}}</text>
				</view>
			</view>
			
		</view>
		<erweima v-if="erweimshow" :close="erweimaclose"></erweima>
	</view>
</template>

<script>
	import appShare, { closeShare } from '../../js_sdk/appShare.js';
	export default {
		data() {
			return {
				rdata:null,
				
				erweimshow:false 
			}
		},
		computed:{
			user(){
				return this.$store.state.userinfo;
			}

		},

		onLoad() {
			plus.navigator.closeSplashscreen();
			setTimeout(()=>{
				let sign = this.md5(this.user.token + 'extension');
				this.GetJson(this.ip + 'getextension.php','POST',{sign:sign,token:this.user.token},e=>{
					if(this.isdata(e)){
						this.rdata = e.data;
				        this.Invitation = e.Invitation;						
						console.log(e.data)
						this.$store.state.integral = e.data.zmoney;
					}
				  })
				
				this.GetJson(this.ip + 'setapp.php','POST', {}, e => {
				this.sharetitle = e.app.sharetitle;
				this.sharetext = e.app.sharetext;
				this.shareimg = e.shareimg;
				this.share = e.app.share;
				})
				

			})
		this.tab[1].index = (new Date()).getMonth();
				let sign = this.md5(this.user.token + 'promotiondetails');//获取累计
				this.GetJson(this.ip + 'promotiondetails.php','POST',{sign:sign,token:this.user.token},e=>{
					if(this.isdata(e)){
						this.rdatas = e.data;
				
					}
				})

		this.getdata();	
		},
		methods: {
			Share(){
			      let shareData = {
			      shareUrl:this.url + '/api/Invitation.php?code='+this.Invitation,//网址
			      shareTitle:this.sharetitle,//分享的标题
			      shareContent:this.sharetext,//分享的内容
			      shareImg:this.shareimg, //分享的图片
			      appId : "wx89559b6d8eXXXXXXX", 
			      appPath : "pages/wode/wode",
			      appWebUrl : this.url,
				  };
			     // 调用
			     let shareObj = appShare(shareData,res => {
			     console.log("分享成功回调",res);
			     // 分享成功后关闭弹窗
			     // 第一种关闭弹窗的方式
			     closeShare();
			     });
			     //setTimeout(() => {
			     // 第二种关闭弹窗的方式
			     //shareObj.close();
			     //},20000);		  
			},
			erweima(){
				if(this.$store.state.erweima == null){
					this.showload();
					this.GetJson(this.ip + 'erwema.php','POST',{token:this.$store.state.userinfo.token,url:this.ip},e=>{
						this.$store.state.erweima = e.img;
						this.hideload()
						this.erweimshow = true
					})
				}else{
					this.erweimshow = true
				}
			},
			erweimaclose(){
				this.erweimshow = false;
			},
			yaoqing(){
				uni.navigateTo({
					url:'userdetails/userdetails'
				})
			},
			fuhzi(info){
				uni.setClipboardData({data: info,showToast:false});
				this.showToast('邀请码已经复制')
			},
			shuoming(){
				plus.runtime.openWeb(this.$store.state.config.guanyu);
			},
			quanbu(){
				uni.navigateTo({
					url:'profitdetails/profitdetails'
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #111111;
		
	}
	.font{
		color:#555555;
	}
	
	.topbg{
		background: #000000;
		height: 500rpx;
		width: 750rpx;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		
	}
	.v2{

		justify-content: space-around;
		
		padding-bottom: 40rpx;
	}
	.v2>view{
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.v2>view>:nth-child(1){
		font-size: 55rpx;
		color: #ff0042;
		text-shadow:0.5px 0.5px #FFF;
		margin-bottom: 22rpx;
		font-weight: bold;
	}
	.v2>view>:nth-child(2){
		font-size: 24rpx;
	}
	.view{
		margin: 30rpx 13rpx;		
		border-radius: 30rpx;
		padding: 0 35rpx;
		min-height: 700rpx;
	}
	.listtop{
		padding: 18rpx 0;
		border-bottom: 1rpx solid #20243e;
	}
	.listtop>:nth-child(1){
		color: #F6C621;
		font-size: 34px;
	}
	.listtop>:nth-child(2){
		font-size: 32rpx;
		font-weight: 500;
		display: flex;
		flex: 1;
		margin-left: 14rpx;
	}
	.listtop>:nth-child(3){
		font-size: 30rpx;
		color: #7C7B7B;
	}
	.listtop>:nth-child(4){
		font-size: 24rpx;
		color: #7C7B7B;
	}
	.null{
		margin-top: 140rpx;
	}
	.list{
		position: relative;
		display: flex;
		flex-direction: row;
		padding: 28rpx 0;
		border-bottom: 1rpx solid var(--fenge);
	}
	.list>view>:nth-child(1){
		font-size: 28rpx;
		display: block;
	}
	.list>view>:nth-child(2){
		font-size: 28rrpx;
		color: #8B8B8B;
	}
	.list>:nth-child(2){
		color: #8C8A8B;
		font-size:28rpx;
		display: block;
		margin-left: 31rpx;
	}
	.list>:nth-child(3){
		color: var(--maincolor);
		position: absolute;
		right: 26rpx;
		bottom: 41rpx;
		font-size: 28rpx;
	}
</style>
