<template>
	<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
		<view class="mask-content"  @click.stop.prevent="stopPrevent">
			<view class="mask-content-topbar">
				<view class="left" @click="toggleMask">取消</view>
				<view class="right" @click="fabu">发布评论</view>
			</view>
			<view class="mask-content-input">
				<textarea class="textarea"
				    v-model="info"
					@confirm="tijiao"
					:placeholder="placeholder"
					:cursor-spacing = "100"
					:show-confirm-bar = "false"
					:focus="focus"
					confirm-type="send"
					maxlength="140"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ygcComment",
		//属性
		props: {
			placeholder: {
				type: String
			}
		},
		data() {
			return {
				jiaod:true,
				scale: 1,
				maskState: 0,
				content: '',
				info:'',
				length:0,
				id:'',
				focus: false
			};
		},
		created() {
		},
		computed: {
			user(){
				return this.$store.state.userinfos;
			},
		},		
		onLoad() {
			uni.$on('pid',e=>{
				console.log(e)
			})
		},
		onReady() {
			
		},
		methods: {
			jujiao(){
				this.jiaod = true;
			},
			stopPrevent(){
			},
			toggleMask(type,id){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				// this.maskState = 2;
				this.id = id;
				setTimeout(()=>{
					this.maskState = state;
					// #ifdef APP-PLUS
					// 安卓app软键盘自动弹出有点问题，暂时还没有很好的解决方案，所以就禁止安卓app软键盘自动弹出，如果哪位朋友有好的解决方案可以在评论里告诉大家参考一下
					if (uni.getSystemInfoSync().platform == "ios") {
						this.focus = this.maskState ? true : false;
					}
					// #endif
					// #ifndef APP-PLUS
					this.focus = this.maskState ? true : false;
					// #endif
				}, timer)
			},
		fabu(){
			if(this.info == ''){
				uni.showToast({icon:'none',title:'说点什么吧？'})
			}else{
				this.tijiao(''); 
			}
		},
		tijiao() {
		    let sign = this.md5(this.$store.state.userinfo.token);
		    this.GetJson(this.ip + 'fabupinglun.php', 'POST', {
		        sign: sign,
		        token: this.$store.state.userinfo.token,
		        info: this.info,
		        id: this.id
		    }, e => {
		        this.hideload();
		        if (this.isdata(e)) {
					this.info = '';
					this.id = '';
		            this.showToast('发布成功');
		            uni.startPullDownRefresh();
					this.toggleMask();
		            setTimeout(() => {
		                uni.stopPullDownRefresh()
		            }, 1000); //评论后刷新页面
					
		
		        }
		    })
		},		
			pubComment() {
				this.$emit('pubComment',this.content);
			}
		}
	}
</script>
<style lang="scss" scoped>
	$font-color-base: #FCFCFC;
	$base-color: #2D3358;
	.mask{
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 9995;
		transition: .3s;
		-webkit-transition: .3s; 
		
		.mask-content{
			width: 100%;
			background: #181b2e;
			transform: translateY(100%);
			transition: .3s;//底部弹出的持续时间
			-webkit-transition: .3s;//底部弹出的持续时间 
			// overflow-y:scroll;
			display: flex;
			flex-direction: column;
			.mask-content-topbar{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				border-top: 1rpx solid #262A48;
				padding: 20upx 30upx 10upx;
				font-size: 32upx;
				.left{
					padding: 10upx 0upx;
					color: $font-color-base;
				}
				.right{
					padding: 10upx 100upx;
					border-radius: 6upx;
					color: #6A79D3;
					font-weight: 500;
					background-color: $base-color;
				}
			}
			.mask-content-input{
				width: 725upx;//如果textarea的宽带有问题可以把width改为100%试试
				// width: 100%;
				padding: 10upx 16upx 20upx;
				/*#ifdef H5*/
				color:#FFF;
				
				/*#endif*/
				.textarea {
					height: 100px;
					width: 686upx;//如果textarea的宽带有问题可以把width改为100%试试
					// width: 100%;
					color:#FFF;
					padding: 16upx;
					background-color: $base-color;
					border:2upx solid #181b2e;
					border-radius: 8upx;
				}
			}
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			.mask-content{
				transform: translateY(0);
			}
		}
	}

</style>
