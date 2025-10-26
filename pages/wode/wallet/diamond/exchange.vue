<template>
	<view>
		<view class="view">
			<view class="v2">
				<text class="ketix fontb">可兑换钻石数：<font style="color: #FC3580;">{{$store.state.userinfo.diamonds}}</font></text>
				<text class="ketix fontb">当前账户余额：<font style="color: #FC3580;">{{$store.state.userinfo.money}}</font></text>
				<view class="row">
					
					<input style="border-bottom: 1rpx solid #6471c7;width: 200rpx;color: #F5C71F;" type="number" placeholder="请输入钻石数" v-model="diamonds" maxlength="5" />
					<text style="font-weight: 700;color: #6471c7;" @tap="quanbu">全部兑换</text>
				</view>
				
				<text class="btns" @tap="btns">确认兑换</text>
			</view>
		</view>
		<view class="fonta" style="margin: 20rpx;">兑换比例为：兑换的钻石数x{{config[3]*100}}%（兑换比例可能会因为业务需求随时调整）</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				diamonds:''
			}
		},
		computed:{
			config(){
				return this.$store.state.config == null ? [] : JSON.parse(this.$store.state.config.Servantpoints);
			}
		},
		onLoad() {
	
		},
		onUnload() {
		
		},
		methods: {
			quanbu(){
				this.diamonds = this.$store.state.userinfo.diamonds;
			},
			btns(){
				if(this.diamonds == ''||this.diamonds == '0'){
					this.showToast('请输入正确的钻石数');
				}else if(Number(this.diamonds) > Number(this.$store.state.userinfo.diamonds)){
					this.showToast('你没有这么多钻石');
				}else{
					this.showload();
					let sign = this.md5(this.$store.state.userinfo.token + this.diamonds);
					this.GetJson(this.ip + 'exchange.php','POST',{
						sign:sign,
						token:this.$store.state.userinfo.token,
						diamonds:this.diamonds
					},e=>{
						this.hideload();
						if(this.isdata(e)){
							this.$store.state.userinfo.money = e.money;
							uni.navigateBack();
						}
					})
				}
			}
		}
	}
</script>

<style>
	page{
	 background-color: #111111;
	}
	.fonta{
		background-image: linear-gradient(to right ,#521fad,#7b42e0,#521fad); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.fontb{
		background-image: linear-gradient(to right ,#f93bd7,#fcd22c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.view{
		background-color: #101010;
		margin-top: 15rpx;
		padding: 0 35rpx;
	}
	.v1{
		padding: 40rpx 0;
		
	}
	.title{
		font-size: 29rpx;
		display: flex;
		flex: 1;
	}
	.anul{
		font-size: 29rpx;
		color: #888686;
	}
	.payicon{
		font-size: 32px;
	}
	.v2{
		padding: 44rpx 0;
		
	}
	.v2>view{
		margin-top: 60rpx;
	}
	.v2>view>input{
		display: flex;
		flex: 1;
		font-size: 44rpx;
		font-weight: bold;
	}
	.v2>view>:nth-child(1){
		font-size: 34rpx;
		font-weight: bold;
		margin-right: 10rpx;
		display: block;
	}
	.v2>view>:nth-child(3){
		font-size: 29rpx;
	}
	.ketix{
		margin-top: 28rpx;
		display: block;
		font-size: 32rpx;
		font-weight: 700;
		color: #000000;
	}
	.btns{
		margin: 72rpx auto 48rpx;
		width: 700rpx;
		height: 87rpx;
		background-image: linear-gradient(to right ,#521fad,#7b42e0,#521fad);
		border-radius: 20rpx;
		font-size: 34rpx;
		color: #FFFFFF;
		display: block;
		text-align: center;
		line-height: 87rpx;
	}
	.info{
		font-size: 24rpx;
		color: #666565;
		display: block;
		margin: 0 36rpx;
	}
	.info1{
		font-size: 34rpx;
		margin-top: 38rpx;
		margin-bottom: 20rpx;
	}
</style>
