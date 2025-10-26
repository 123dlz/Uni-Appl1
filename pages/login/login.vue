<template>
	<view class="indexbg" :style="'background-image:url('+ ip + bgimg + ')'">
		<view v-if="logintype==1">
			<view style="margin-top:400rpx;text-align: center;">
				<text style="font-size: 55rpx;font-weight: 800;margin: 50rpx;color: #FFFFFF;text-shadow: 0 0 5px #000000, 0 0 1px #000000">欢迎！Login in</text>
			</view>
			<view style="margin-top:90rpx;">
				<view>
					<view class="view row iconfont">
						<text>&#xe674;</text>
						<input type="text" v-model="phone" maxlength="11" placeholder="请输入账号"
							placeholder-style="font-weight: 700; color:#999999;font-size:30rpx" />
					</view>
				</view>
				<view>
					
					<view class="view row iconfont">
						<text>&#xe68a;</text> 
						<input class="input" :type="passworda" v-model="password" placeholder="输入密码 / 首次使用会自动注册"
							placeholder-style="font-weight: 700; color:#999999;font-size:30rpx" />
						<view @tap="pw" class="iconfont" style="color:#999999;font-size:40rpx;padding: 0 20rpx;">
							{{!pwa?'&#xe901;':'&#xe763;'}}
						</view>
					</view>
				</view>
				<view class="btns" @tap="login">注册/登录</view>
				<view class="duanxin" style="margin-top: 20rpx;color: #ffffff;text-shadow: 0 0 5px #000000, 0 0 1px #000000" @tap="duanxincode">短信验证码登录</view>
			</view>
		</view>

		<view v-if="logintype==2">
			<view style="margin-top:400rpx;text-align: center;">
				<text style="font-size: 55rpx;font-weight: 700;margin: 50rpx;color: #FFFFFF;text-shadow: 0 0 5px #000000, 0 0 1px #000000">欢迎! Sign in</text>
			</view>
			<view style="margin-top:90rpx;">
				<view>
					<view class="view row iconfont">
						<text>&#xe674;</text>
						<input type="number" v-model="phone" maxlength="11" placeholder="输入11位手机号"
							placeholder-style="font-weight: 800; color:#555555;font-size:25rpx" />
					</view>
				</view>
				<view>
					<view class="view row iconfont">
						<text>&#xe68a;</text>
						<input text-content-type="oneTimeCode" type="number" v-model="code" maxlength="4"
							placeholder="输入验证码" placeholder-style="font-weight: 800; color:#555555;font-size:25rpx" />
						<view style="padding: 0 20rpx;" @tap="sendcode" :class="codeinfo != '获取验证码' ? 'newcode' : ''">
							{{codeinfo}}</view>
					</view>
				</view>
				<view class="btns" @tap="btns">注册/登录</view>
				<view class="duanxin" style="margin-top: 20rpx;color: #ffffff;text-shadow: 0 0 5px #000000, 0 0 1px #000000"  @tap="mima">密码登录</view>
			</view>
				
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				bgimg: '',
				codeinfo: '获取验证码',
				code: '',
				phone: '',
				logintype: '',
				passworda: 'password',
				password: '',
				passwords: '',
				pwa: false,
				timer:null,
			}
		},
		onLoad() {
			let _this = this;
			uni.getNetworkType({
			    success: function (res) {
			        console.log(res.networkType);//网络类型 wifi、2g、3g、4g、ethernet、unknown、none
			        if(res.networkType === "none" || res.networkType ==='unknown'){
						_this.showToast('连接服务器失败，请检查手机网络设置！')
			        } 
			    }
			});
			this.GetJson(this.ip + 'setapp.php', 'GET', {}, e => {
				console.log(e)  
				this.logintype = e.app.logintype;
				this.bgimg = e.app.loginbg;
			})
		},
		onUnload() {
		   
		},
		methods: {
			
			duanxincode() {
				this.logintype = '2';
			},
			mima() {
				this.logintype = '1';
			},
			pw() {
				if (this.pwa == false) {
					this.pwa = true;
					this.passworda = 'text';
				} else {
					this.pwa = false;
					this.passworda = 'password';
				}

			},
			sendcode() {
				if (this.phone.length != 11) {
					this.showToast('请输入11位手机号');
				} else if (this.codeinfo == '获取验证码') {
					let sign = this.md5(this.phone + 'zc');
					this.GetJson(this.ip + 'code.php', 'POST', {
						phone: this.phone,
						type: 'zc',
						sign: sign
					}, e => {
						this.showToast(e.msg);
						if (e.code == 200) {
							this.codeinfo = 60;
							let intime = setInterval(() => {
								if (this.codeinfo == 0) {
									clearInterval(intime);
									this.codeinfo = '获取验证码';
								} else {
									this.codeinfo--;
								}
							}, 1000)
						}
					})
				}
			},
			login() {
				if (this.phone == '') {
					this.showToast('请输入账号')
				} else if (this.password == '') {
					this.showToast('请输入密码.')
				} else if (this.password.length <= 5) {
					this.showToast('密码必须大于六位数')
					//}else if(this.password != this.passwords){
					//	this.showToast('两次密码不一致')
				} else {
					let sign = this.md5(this.phone + 'user_register');
					uni.showLoading({
						title: '请稍后...'
					})
					uni.hideKeyboard();
					this.GetJson(this.ip + 'register.php', 'POST', {
						phone: this.phone,
						password: this.md5(this.password), 
						sign: sign,
						type: 'register'
					}, e => {
						uni.hideLoading()
						//console.log(e);
						switch (e.code) {
							case 403:
								uni.showToast({
									icon: 'none',
									title: e.info
								});
								break;
							case 404:
								uni.showToast({
									icon: 'none',
									title: '数据异常'
								});
								break;
							case 201:
								uni.showToast({
									icon: 'none',
									title: e.info
								});
								break;
							case 100:
								uni.showToast({
									icon: 'none',
									title: e.info
								});
								break;
							case 200:
								// #ifdef H5
								uni.setStorage({
									key: 'userinfo',
									data: e.user
								})
								
								// #endif
								this.$store.commit('setuser', {
									userinfo: e.user,
									login: {
										phone: this.phone,
										utoken: e.user.utoken
									}
								});
								uni.showToast({
									icon: 'none',
									title: '欢迎回来 ' + e.user.name
								});
								uni.switchTab({
									url: '/pages/index/index'
								})
								break;
							default:
								break;
						}


					})
				}
			},

			btns() {
				if (this.phone.length != 11) {
					this.showToast('请输入11位手机号')
				} else if (this.code.length != 4) {
					this.showToast('请输入4为验证码')
				} else {
					let sign = this.md5(this.phone + 'zc');
					uni.showLoading({
						title: '正在登录...'
					})
					uni.hideKeyboard();
					this.GetJson(this.ip + 'login.php', 'POST', {
						phone: this.phone,
						code: this.code,
						type: 'zc',
						sign: sign
					}, e => {
						uni.hideLoading()
						switch (e.code) {
							case 404:
								uni.showToast({
									icon: 'none',
									title: '数据异常'
								});
								break;
							case 403:
								uni.showToast({
									icon: 'none',
									title: '验证码无效或已过期'
								});
								break;
							case 200:
								// #ifdef H5
								uni.setStorage({
									key: 'userinfo',
									data: e.user
								})
								// #endif
								this.$store.commit('setuser', {
									userinfo: e.user,
									login: {
										phone: this.phone,
										utoken: e.user.utoken
									}
								});
								uni.showToast({
									icon: 'none',
									title: '欢迎回来 ' + e.user.name
								});
								uni.switchTab({
									url: '/pages/index/index'
								})
								break;
							default:
								break;
						}
					})
				}
			}
		},
		onReady() {
			//#ifdef APP-PLUS
			plus.navigator.closeSplashscreen()
			//#endif
		},
		onBackPress(e) {
			//console.log(e)
			if (e.from != 'navigateBack') {
				return true;
			}
		}
	}
</script>


<style>
	page {
			width: 100%;
			height: 100%;
			background-size: cover;
			background-color: #111111;
		}
		.indexbg {
			/*background-size: 100% 100%;*/
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			z-index: 2;
			height: 100%;
		}
	
		.mainimg {
			margin-top: 200rpx;
			width: 750rpx;
			height: 300rpx;
			background-color: #8e54f9;
			position: fixed;
			top: 0;
			left: 0;
			transition: transform;
			z-index: -1;
		}
	
		.logo {
	
			margin: 100rpx auto;
			width: 215rpx;
			height: 215rpx;
			display: block;
	
		}
		.view { 
			background-color: #ffffff;
			border-radius: 10rpx;
			margin: 20rpx;
			padding: 6rpx 20rpx;
			position: relative;
		}
	
		.view>text {
			color: #fc91c4;
			font-size: 35rpx;
			font-weight: 500;
			display: block;
			margin-right: 26rpx;
		}
	
		.view>input {
			padding: 0 20rpx;
			height: 100rpx;
			border-radius: 7rpx;
			font-weight: 800;
			color: #000;
			flex: 1;
			font-size: 30rpx;
		}
	
		.input {
			border: none;
			outline: none;
			padding: 0 20rpx;
			height: 100rpx;
			border-radius: 7rpx;
			font-weight: 800;
			flex: 1;
	
		}
	
		.view>view {
			margin: 20RPX;
			height: 53rpx;
			position: absolute;
			right: 0;
			color: #ff2b71;
			border-radius: 20rpx;
			/*border: 1rpx solid #ff2b71;*/
			font-size: 14px;
	
			line-height: 53rpx;
			text-align: center;
			border-radius: 100rpx;
		}
	
		.newcode {
			/*background-color: #fc91c4;*/
			color: #ff2b71;
	
		}
	
		.btns {
			background-color: #01cb65;
			color: #FFFFFF;
			width: 600rpx;
			height: 100rpx;
			border-radius: 100rpx;
			margin: 100rpx auto 0;
			display: block;
			font-size: 26rpx;
			line-height: 100rpx;
			text-align: center;
		}
	
		.duanxin {
			margin-top: 20rpx;
			text-shadow: 0 0 5px #000000, 0 0 1px #000000;
			width: 600rpx;
			height: 100rpx;
			padding-top: -40rpx;
			border-radius: 100rpx;
			margin: 100rpx auto 0;
			display: block;
			font-size: 26rpx;
			line-height: 100rpx;
			text-align: center;
		}
	
		.bgimg {
			position: absolute;
			bottom: 100rpx;
	
			left: 0;
			right: 0;
			justify-content: center;
		}
	
		.xiyi {
			position: absolute;
			/*bottom: 100rpx;*/
			margin-top: 250rpx;
			left: 0;
			right: 0;
			justify-content: center;
		}
	
		.xiyi>image {
			width: 30rpx;
			height: 30rpx;
			margin-right: 5rpx;
		}
	
		.xiyi>text {
			color: #fdadc9;
			font-size: 22rpx;
		}
	
		.xieyi {
			color: var(--maincolor) !important;
		}
	</style>