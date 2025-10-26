
<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			uni.getStorage({
				key:'ulogin',
				success: (e) => {
					//#ifdef APP-PLUS
					plus.navigator.closeSplashscreen();
					//#endif
					let sign = this.md5(e.data.phone + 'login');
					this.GetJson(this.ip + 'login.php','POST',{
						phone:e.data.phone,
						utoken:e.data.utoken,
						type:'login',
						sign:sign
						},es=>{
						if(es.code == 200){
							this.$store.commit('setuser',{userinfo:es.user});
							//#ifdef H5
							uni.setStorage({
								key:'userinfo',
								data:es.user
							})
							//#endif
						}else{
							uni.showToast({
								title:'请登录 ',
							});
							uni.removeStorage({key:'ulogin'})
							//if(uni.getSystemInfoSync().platform != 'ios'){
							uni.navigateTo({
								url:'../../pages/login/login',
								animationType:'fade-in',
								animationDuration:100
							  })	
							//}
						}
					})
				},
				fail() {
					console.log('没有信息')
					//if(uni.getSystemInfoSync().platform != 'ios'){
					uni.navigateTo({
						url:'../../pages/index/index',
						animationType:'fade-in',
						animationDuration:100
					})
				  //}
				}
			})
			
			setTimeout(()=>{
				this.GetJson(this.ip + 'gettag.php','GET',{},e=>{
					this.$store.state.tagarr = e.tag;
					uni.setStorage({key:'soulist',data:e.sou})
					uni.setStorage({key:'gift',data:e.gift})
					this.$store.state.config = e.config
					
				})
			})			
			uni.getSystemInfo({
				success(res) {
					Vue.prototype.winWidth=res.screenWidth
					Vue.prototype.winHeight=res.screenHeight
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		
	}
</script>

<style>
	
	/*每个页面公共css */
	
	/* #ifdef APP-PLUS */
	@font-face {
	  font-family: 'iconfont';  /* Project id 3213640 */
	  src: url('/static/font/iconfont.ttf') format('truetype');
	}
	/* #endif */
	
	/* #ifdef H5 */
	@import "/static/font/video-js.css";
	@font-face {
		font-family: 'iconfont';  /* Project id 3213640 */
		src: url('/h5/static/font/iconfont.ttf') format('truetype');
	}
	uni-page-head {
		display: none;
	}
	/* #endif */
	
	/* #ifndef APP-NVUE */ 
	body,html{
		color: #010101;
		font-weight: 400;
		background-color: #111111;
	}
	.iconfont{
		font-family: "iconfont";
	}
	.row{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.font{
		font-size: 30rpx;font-weight: 700;
	}
	:root{
		--maincolor:#fe4c93;
		--fenge:#F8F8F8;
	}
	*{
		box-sizing: border-box;
	}
	.center{
	    display: flex;
	    align-items: center; /* 垂直居中 */
	    justify-content: center; /* 水平居中 */
	    /* height: 200rpx; 容器的高度 */
	}
	.center-text {
	    text-align: center; /* 水平居中 */
	}
	.jiant{
		font-size: 16px;
		color: #A5A3A3;
	}
	@keyframes opacitys{
		0%{
			opacity: 0;
		}
		100%{
			opacity: 1;
		}
	}
	
	@keyframes show {
	   from {
	       transform: translateY(90%); /*设置为正数则底部弹出来，负数则相反*/
		   opacity: 0;
	     }
	   
	     to {
	       transform: translateZ(10%);
		   opacity: 1;
	     }
	}
/*隐藏滚动条*/
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
    .donghua{
	    animation: opacitys 0.5s;
	    -moz-animation-duration: 0.1s;
	    -webkit-animation-duration: 0.1s;
	    -moz-animation-name: slidein;
	    -webkit-animation-name: slidein;
	}    
	@-moz-keyframes slidein {
	    from {
	      	transform: translateX(100%);
	      	opacity: 0;
	        margin-left:0%;
	        width:100%
	    }      
	    to {
	      	transform: translateZ(100%);
	      	opacity: 1;
	        margin-left:0%;
	        width:100%;
	    }
	}
	@-webkit-keyframes slidein {
	    from {
			transform: translateX(100%); 
			opacity: 0;
	        margin-left:0%;
	        width:100%
	    }      
	    to {
			transform: translateZ(100%);
			opacity: 1;
	        margin-left:0%;
	        width:100%;
	    }
	}
	
	
	/* #endif */
</style>
