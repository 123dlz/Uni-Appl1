<template>
	<view>
		<view class="top">
			<view style="height:calc(var(--status-bar-height) + 40px)"></view>
			<text @tap="shezhi" style="float: right;margin-right: 28rpx;;color: #555555;font-size: 60rpx;" class="iconfont">&#xe649;</text>
			
			<!-- 登录状态判断 -->
			<view v-if="isLogin" class="user row" @tap="mydata">
				<image :src="url + user.avatar" mode="aspectFill"></image>
				<view style="margin-top: -30rpx;">
					<text style="font-size: 40rpx;color: #FFF;">{{user.name}}</text>
					<text style="color: #A2A1A1;font-size: 30rpx;">用户等级：{{user.vip.vip==1?'会员用户':'普通用户'}}</text>
					<text v-if="user.vip.vip==1 || user.vip.vip==2" style="color: #888686;font-size: 25rpx;">
						到期时间:{{gettime(user.vip.vipend,'yyyy-MM-dd')}} 
						<font style="color: red;margin-left: 10rpx;">{{user.vip.vip==2?'已到期':''}}</font>
					</text>
				</view>
			</view>
			
			<!-- 未登录状态 -->
			<view v-else class="user row" @tap="goLogin">
				<image src="../../static/login.png" mode="aspectFill"></image>
				<view style="margin-top: -30rpx;">
					<text style="font-size: 40rpx;color: #FFF;">点击登录</text>
					<text style="color: #A2A1A1;font-size: 30rpx;">登录后享受更多服务</text>
				</view>
			</view>
 
			<!-- 会员开通区域 -->
			<view v-if="isLogin" class="usertg row" @tap="ntourl('../pay/index')">
				<text style="padding: 0 40rpx;">
					<image style="height:30px;width:100rpx;" src="../../static/font/vipa.png"></image>
				</text>
                <text style="color: #FFF;">开通会员</text>
				<text>即刻尊享万部大片！</text>
			</view>
			<view v-else class="usertg row" @tap="goLogin">
				<text style="padding: 0 40rpx;">
					<image style="height:30px;width:100rpx;" src="../../static/font/vipa.png"></image>
				</text>
                <text style="color: #FFF;">开通会员</text>
				<text>登录后即可开通会员</text>
			</view>
		</view>

	<view >
		<!-- 数据统计区域 -->
		<view class="views row" >
			<view class="hengv" @tap="handleNav('wallet/wallet')"> 
				<text style="font-size: 32rpx;color:pink">{{isLogin ? parseFloat(user.money).toFixed(2) : '0.00'}}</text>
				<text>账户余额</text>
			</view>
			<view class="hengv" @tap="handleNav('../extension/profitdetails/profitdetails')">
				<!--#ifdef APP-PLUS -->
				<text style="font-size: 32rpx;color:pink">{{isLogin ? $store.state.integral : '0.00'}}</text>
				<!-- #endif -->
				<!--#ifdef H5 -->
				<text style="font-size: 32rpx;color:pink">{{isLogin ? integral : '0.00'}}</text>
				<!-- #endif -->
				<text>佣金收益</text>
			</view>
			<view class="hengv" @tap="handleNav('record/record')">
				<!--#ifdef APP-PLUS -->
				<text style="font-size: 32rpx;color:pink">{{isLogin ? $store.state.record.length : 0}}</text>
				<!-- #endif -->
				<!--#ifdef H5 -->
				<text style="font-size: 32rpx;color:pink">{{isLogin ? record.length : 0}}</text>
				<!-- #endif --> 
				<text>观看记录</text>
			</view>
			<view class="hengv" @tap="handleNav('myfollow/myfollow')">
				<!--#ifdef APP-PLUS -->
				<text style="font-size: 32rpx;color:pink">{{isLogin ? $store.state.follow.length : 0}}</text>
				<!-- #endif -->
				<!--#ifdef H5 -->
				<text style="font-size: 32rpx;color:pink">{{isLogin ? follow.length : 0}}</text>
				<!-- #endif -->
				<text>我的收藏</text>
			</view>
		</view>	
	</view>	

		<!-- 常用功能 -->
		<view class="tool">
			<text class="cygn">常用功能</text>
			<view class="view2 row row2">
				<view @tap="handleNav('../vip/card')" class="hengvs">
					<text class="iconfont">&#xe6a4;</text>
					<text>卡密激活</text>
				</view>
				<view @tap="handleNav('wallet/diamond/buydiamond')" class="hengvs">
					<text class="iconfont">&#xe648;</text>
					<text>卡密冲钻</text>
				</view>
				<view @tap="handleZuanshi" class="hengvs">
					<text class="iconfont">&#xe817;</text>
					<text>钻石充值</text>
				</view>
				<view @tap="handleNav('wallet/diamond/exchange')" class="hengvs">
					<text class="iconfont">&#xe647;</text>
					<text>钻石兑换</text>
				</view>
				<view @tap="handleNav('../add/index')" class="hengvs">
					<text class="iconfont">&#xe66c;</text>
					<text>发布视频</text>
				</view>
				<view @tap="handleNav('myvideo')" class="hengvs">
					<text class="iconfont">&#xe641;</text>
					<text>我的视频</text> 
				</view>
				<view @tap="handleNav('../extension/extension')" class="hengvs">
					<text class="iconfont">&#xe642;</text>
					<text>推广中心</text>
				</view>
				<view @tap="handleNav('wallet/withdraw/withdraw')" class="hengvs">
					<text class="iconfont">&#xe63f;</text>
					<text>申请提现</text>
				</view>
			</view>
		</view>	
		
		<!-- 其他设置 -->
		<view class="tool">
			<text class="cygn">其他设置</text>
			<view class="view2 row row2">
				<view @tap="handleNav('myfollow/myguanzhu')" class="hengvs">
					<text class="iconfont">&#xe703;</text>
					<text>我的关注</text>
				</view>
				<view @tap="handleNav('wallet/diamonddetails/diamonddetails')" class="hengvs">
					<text class="iconfont">&#xe648;</text>
					<text>钻石明细</text>
				</view>
				<view @tap="handleNav('wallet/baobiao')" class="hengvs">
					<text class="iconfont">&#xe64d;</text>
					<text>收益报表</text>
				</view>
				<view @tap="handleNav('wallet/giftrecord/giftrecord')" class="hengvs">
					<text class="iconfont">&#xe66b;</text>
					<text>打赏记录</text>
				</view>
			</view>
		</view>	
	</view>
</template>

<script> 
	export default {
		data() {
			return {
				data:'',
				rdata:null,
				//#ifdef H5
				user: null,
				follow:[],
				record:[],
				integral:0.00,
				//#endif
				url: '' // 确保url有默认值
			}
		},
		computed: {
			// 登录状态判断
			isLogin() {
				//#ifdef APP-PLUS
				return this.$store.state.userinfo && this.$store.state.userinfo.userid;
				//#endif
				//#ifdef H5
				return this.user && this.user.userid;
				//#endif
			},
			//#ifdef APP-PLUS
			user() {
				return this.$store.state.userinfo || {};
			}
			//#endif
		},
		onShow() {
			this.checkLoginStatus();
		},
		onLoad() {
			this.url = this.ip; // 确保ip在data或computed中定义
		},
		methods: {
			// 检查登录状态
			checkLoginStatus() {
				//#ifdef H5
				let _this = this;
				uni.getStorage({
					key: 'userinfo',
					success: (e) => {
						_this.user = e.data;
						let sign = _this.md5(e.data.token);
						_this.GetJson(_this.ip + 'userinfo.php', 'POST', {
							token: e.data.token,
							sign: sign
						}, res => {
							if (res.code == 200) {
								_this.follow = res.follow || [];
								_this.record = res.record || [];
								_this.integral = res.integral || 0.00;
							}
							if (res.code == 405 || res.userinfo == null || res.userinfo == '') {
								_this.user = null;
								uni.removeStorage({
									key: 'ulogin'
								});
							}
						});
					},
					fail: () => {
						_this.user = null;
					}
				});
				//#endif
			},
			
			// 跳转到登录页面
			goLogin() {
				uni.navigateTo({
					url: '../login/login'
				});
			},
			
			// 处理导航跳转（带登录检查）
			handleNav(url) {
				if (!this.isLogin) {
					this.goLogin();
					return;
				}
				this.ntourl(url);
			},
			
			// 原有的方法保持不变
			vips() {
				if (!this.isLogin) {
					this.goLogin();
					return;
				}
				uni.navigateTo({
					url: '../pay/index'
				});
			},
			
			handleZuanshi() {
				if (!this.isLogin) {
					this.goLogin();
					return;
				}
				this.zuanshi();
			},
			
			zuanshi() {
				uni.navigateTo({
					url: '../vip/view?url=' + this.ip + 'zuanshi/index.php?userid=' + this.user.userid
				});
			},
			
			mydata() {
				if (!this.isLogin) {
					this.goLogin();
					return;
				}
				uni.navigateTo({
					url: '../mydata/mydata'
				});
			},
			
			shezhi() {
				uni.navigateTo({
					url: '../shezhi/shezhi'
				});
			},
			
			ntourl(url) {
				uni.navigateTo({
					url: url
				});
			},
			
			gettime(time, format) {
				// 时间格式化方法，确保存在
				if (!time) return '';
				const date = new Date(time);
				const formatObj = {
					'yyyy': date.getFullYear(),
					'MM': ('0' + (date.getMonth() + 1)).slice(-2),
					'dd': ('0' + date.getDate()).slice(-2),
					'HH': ('0' + date.getHours()).slice(-2),
					'mm': ('0' + date.getMinutes()).slice(-2),
					'ss': ('0' + date.getSeconds()).slice(-2)
				};
				return format.replace(/(yyyy|MM|dd|HH|mm|ss)/g, match => formatObj[match]);
			}
		}
	}
</script>

<style>
	page{
		background-size: cover;
		background-color: #111111; 
		padding-bottom: 16rpx;
	}
	.top{
		width: 750rpx;
		position: relative;
		height: calc(400rpx + var(--status-bar-height));
		background-size: cover;
		padding: 0 46rpx; 
		animation: opacitys .3s;
	}
	.top>image{
		width: 40rpx;
		height: 38rpx;
		float: right;
		margin-right: 28rpx;
	}
	 .cdlist{
		 margin-left: 20rpx;
		 font-size: 28rpx;
		 font-weight: 600;
		 padding-top: 30rpx;
		 color: #555555
	 }
	 .dlist{
	 	color: #555555;
	 	padding-top: 35rpx;
	 	margin-left: 400rpx;
	 }
	 
	 .sbottom{
		 padding: 0 20rpx;
		 margin: 20rpx;
		 height: 100rpx;
		 box-shadow: 0rpx 1rpx 0rpx 0rpx rgba(225,225,225,0.1);
		 display: flex;
	 }
	 .abottom{
	 	margin: 20rpx;
	 	height: 100rpx;
	 	display: flex;
	 }
	 .imgs{
		 margin: 20rpx;
		 width: 50rpx;
		 height: 50rpx;
	 }
	 .click-hover{
	 background-image: linear-gradient(to right ,#FCFCFC,#FCFCFC);
	 }

	.view {
		margin: 20rpx;
		border-radius: 20rpx;
		background-color: #FFFFFF;
		
	}

	.view>view {
		padding: 35rpx 42rpx;
		border-bottom: 1rpx solid var(--fenge);
		display: flex;
		flex-direction: row;
		align-items: center;
		color: rgba(225,225,225,1);
	}


	.view>view>text:nth-child(1) {
		font-size: 30rpx;
		color: rgba(225,225,225,0.8);
		display: flex;
		flex: 1;
	}
	.tool{
		background-color: #111111;
		margin: 20rpx;
		border-radius: 20rpx;
	}
	.views{
		margin: 20rpx;
		background-color:#181818;
		border-radius: 20rpx;
		margin-top: 35rpx;
		padding: 30rpx 0;
		justify-content: space-around;
	}
	.bottombg{
		background-color: rgba(0,0,0,0.2);
		margin: 20rpx;
		border-radius: 20rpx;
	}
	.cygn{
		color: #555555;
		font-size: 35rpx;
		font-weight: 700;
		margin: 30rpx;
		margin-left: 2rpx;
		line-height: 100rpx;
	}
	.user{
		margin-top: 20rpx;
	}
	.user>image{
		width: 167rpx;
		height: 167rpx;
		margin-top: -40rpx;
		border-radius: 100rpx;
		margin-right: 55rpx;
		display: block;
	}
	.user>view{
		color: #FFFFFF;
	}
	.user>view>text:nth-child(1){
		font-size: 26rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 5rpx;
	}
	.user>view>text:nth-child(2){
		display: block;
		font-size: 22rpx;
	}
	.user>view>text:nth-child(3){
		display: block;
		font-size: 22rpx;
	}
	.usertg{
		margin: 30rpx 15rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background-color:hotpink;
		border-radius: 10rpx;
		
	}
	.usertg>text:nth-child(1){
		font-size: 28rpx;
		color: #000;		
	}
	.usertg>text:nth-child(2){
		font-size: 35rpx;
		color: #000;
		font-weight: bold;
		margin-left: 10rpx;
		margin-right: 15rpx;
		display: block;
	}
	.usertg>text:nth-child(3){
		font-size: 25rpx;
		color: #FFFFFF;
		display: flex;
		flex: 1;
	}
	.usertg>text:nth-child(4){
		width: 119rpx;
		height: 32rpx;
		background: linear-gradient(-81deg, #FE6767, #FDA6A6);
		display: block;
		font-size: 16rpx;
		border-radius: 10rpx;
		text-align: center;
		line-height: 32rpx;
		color: #FFFFFF;
	}
	
	
	.newren{
		position: absolute;
		bottom: 0;
		left: 19rpx;
		right: 19rpx;
		height: 100rpx;
		
		background-color: #000000;
		/*background-color: rgba(24, 24, 24,.8);*/
		border-radius: 20rpx 20rpx 0 0;
		padding: 0 40rpx;
	}
	.newren>text:nth-child(1){
		font-size: 28rpx;
		color: #F5C71F;		
	}
	.newren>text:nth-child(2){
		font-size: 35rpx;
		color: #F5C71F;
		font-weight: bold;
		margin-left: 10rpx;
		margin-right: 15rpx;
		display: block;
	}
	.newren>text:nth-child(3){
		font-size: 25rpx;
		color: #FFFFFF;
		display: flex;
		flex: 1;
	}
	.newren>text:nth-child(4){
		width: 119rpx;
		height: 32rpx;
		background: linear-gradient(-81deg, #FE6767, #FDA6A6);
		display: block;
		font-size: 16rpx;
		border-radius: 10rpx;
		text-align: center;
		line-height: 32rpx;
		color: #FFFFFF;
	}

	.hengv{
		text-align: center;
	}
	.hengv>text:nth-child(1){
		font-size: 24rpx;
		font-weight: bold;
		color: #000;
		display: block;
	}
	.hengv>text:nth-child(2){
		color: #555555;
		font-size: 24rpx;
	}
	
	.hengvs{
		text-align: center;
	}
	.hengvs>text:nth-child(1){
		font-size:40rpx;
		color: #fd4665;
		display: block;
	}
	.hengvs>text:nth-child(2){
		padding-top: 10rpx;
		color: #555555;
		font-size: 24rpx;
	}
	.view2{
		background-color: #181818; 
		margin-top: -2rpx;
		border-radius: 20rpx ;
		justify-content: space-around;
	}
	.view2>view{
		padding: 30rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.view2>view>image{
		width: 60rpx;
		height: 60rpx;
		display: block;
		margin-bottom: 13rpx;
	}
	.view2>view>text{
		font-weight: 500;
		font-size: 28rpx;
		color: #555555;
	}
	.view2>text{
		width: 0;
		display: block;
		border-right: 7rpx dashed #ddd;
	}	
	.view3{
		margin-top: -30rpx;
		background-size: 100% 100%;
		/*background-color: #FFFFFF;*/
		border-radius: 20rpx;
		justify-content: space-around;
	}	
	.view3>view{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.view3>view>image{
		width: 50rpx;
		height: 50rpx;
		display: block;
		margin-bottom: 13rpx;
	}
	.view3>view>text{
		font-size: 25rpx;
		color: #555555;
	}
	.view3>text{
		width: 0;
		height: 77rpx;
		display: block;
		border-right: 7rpx dashed #ddd;
	}
	
	
	.guangg{
		width: 717rpx;
		height: 169rpx;
		border-radius: 20rpx;
		display: block;
		margin: 14rpx 19rpx;
	}
	.row2{
		flex-wrap: wrap;
		padding: 20rpx 0;
	}
	.row2>view{
		width: 25%;
		margin-bottom: 20rpx;
	}
	.row2>view>image{
		width: 70rpx;
		height: 70rpx;
	}
	.row3{
		flex-wrap: wrap;
		padding: 20rpx 0;
	}
	.row3>view{
		width: 20%;
		margin-bottom: 20rpx; 
	}
	.row3>view>image{
		width: 50rpx;
		height: 50rpx;
	}	
	
</style>