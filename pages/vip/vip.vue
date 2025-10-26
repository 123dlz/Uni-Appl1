<template>
	<view>  <!--支付宝和微信的官方支付功能，需到支付宝和微信开通，具体开通方法百度-->
		<view class="topbg">
			<view style="padding-top: 242rpx;">
		<view class="vipbg">
			<view class="vips">
				<image class="img" src="../../static/font/vip.png"></image>
				会员尊享特权
			</view>
			<view class="text">
				解锁影片 |  提现优先处理 |  代理售卡
			</view>
			<view class="listv row">
				<view @tap="listtap(index)" v-for="(item,index) in list" :key="item.id" :class="newind == index ? 'newview' : ''">
					<text style="font-size: 45rpx;font-weight: 700;">¥{{item.money}}元开通永久会员</text>
				</view>
			</view>
			<view class="font">
				畅享无限大片
			</view>
		</view>
		</view>
		</view>
		<!--支付宝官方支付功能，需到支付宝开通，具体开通方法百度-->

		<view class="payv row" @tap="paytap('alipay')" style="margin-top: 50rpx;">
			<text class="iconfont" style="color: #04B4FD;">&#xe60c;</text>
			<text>支付宝支付</text>
			<image :src="'../../static/' +  (pay == 'alipay' ? 'yixuan.png' : 'weixuan.png')" mode=""></image>
		</view>
		<view class="payv row" @tap="paytap('wxpay')">
			<text class="iconfont" style="color: #26C446;">&#xe608;</text>
			<text>微信支付</text>
			<image :src="'../../static/' +  (pay == 'wxpay' ? 'yixuan.png' : 'weixuan.png')" mode=""></image>
		</view>
		<text class="btns" @tap="btns">付款开通</text>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				newind:0,
				pay:'alipay'
			}
		},
		computed:{
			user(){
				return this.$store.state.userinfo;
			}
		},
		onLoad() {
			uni.getStorage({
				key:'diamondsarr',
				success: (res) => {
					this.list = res.data
				}
			})
			this.GetJson(this.ip + 'vip.php','GET',{},e=>{
				uni.setStorage({key:'diamondsarr',data:e.data});
				this.list = e.data;
			})
		},
		methods: {
			listtap(index){
				this.newind = index;
			},
			paytap(type){
				this.pay = type;
			},
			btns(){
				//this.showload();
				let sign = this.md5(this.$store.state.userinfo.token + 'placeorderx' + this.list[this.newind].money);
				this.GetJson(this.ip + 'pay/placeorder.php','POST',{
					token:this.$store.state.userinfo.token,
					num:this.list[this.newind].num,
					total:this.list[this.newind].money,
					sign:sign,
					type:0
				},e=>{
					if(this.isdata(e)){
						this.pays(e.order_id);
					}else{
						this.hideload();
					}
					//console.log(e)
				})
			},
			pays(order_id){
				let sign = this.md5(order_id + this.$store.state.userinfo.token);
				this.GetJson(this.ip + 'pay/vippay.php','POST',{sign:sign,token:this.$store.state.userinfo.token,order:order_id,paytype:this.pay},e=>{
					//console.log(e);
					this.hideload();
					if(this.isdata(e)){
						uni.requestPayment({
							orderInfo:e.data,
							provider:this.pay,
							fail: (err) => {
								//console.log(err);
								this.showToast('支付失败！');
							},
							success: (es) =>{
								//console.log(es);
								this.showload();
								this.ispay(order_id);
							}
						})
					}
				})
			},
			ispay(order_id){
				let sign = this.md5(this.$store.state.userinfo.token + order_id + 'ispaynew');
				//console.log({
				//	sign:sign,
				//	token:this.$store.state.userinfo.token,
				//	orderid:order_id
				//})
				this.GetJson(this.ip + 'pay/ispay.php','POST',{
					sign:sign,
					token:this.$store.state.userinfo.token,
					orderid:order_id
				},e=>{
					//console.log(e);
					this.hideload();
					if(this.isdata(e)){
						this.$store.state.userinfo.vip = 1;
						this.showToast('您已成功开通会员！');
						uni.navigateBack();
					}
				})
			}
		}
	}
</script>

<style>
	page{
	background-color: #111111;
	}
	.topbg{
		background-color: #373639;
		margin-top: -60rpx;
		height: 800rpx;
	}
	.vipbg{
		margin: 60rpx;
		
		background: linear-gradient(45deg,rgba(244,200,160,1),rgba(245,212,175,1),rgba(253,234,213,1));
		border-radius: 20rpx 20rpx 0rpx 0rpx;
		height: 500rpx;
	}
	.vips{
		font-size: 50rpx;
		font-weight: 800;
		margin: 20rpx;
		text-align: center;
		padding: 30rpx;
	}
	.font{
		font-size: 30rpx;
		font-weight: 600;
		margin:10rpx;
		text-align: center;
		padding: 20rpx;
	}
	.img{
		height: 40px;
		width:80rpx;
		top:20rpx;
	}
	.text{
		font-size: 23rpx;
		font-weight: 600;
		margin:10rpx;
		text-align: center;
		padding: 20rpx;
	}
	.listv{
		
		flex-wrap: wrap;
	}
	.listv>view{
		width: 700rpx;
		height: 126rpx;
		border-radius: 15rpx;
		
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		
		transition: all;
	}
	.listv>view>text{
		font-size: 29rpx;
		display: block;
	}
	.listv>view>:nth-child(2){
		color: #FA5A9A;
		margin-top: 10rpx;
	}
	/*.newview{
		border: 1rpx solid #F61870 !important;
		background-color: #FF609F;
	}*/
	.newview>text{
		font-size: 45rpx;
		font-weight: 700;
		color: #975b18 !important;
	}
	.ttit1{
		display: block;
		font-size: 50rpx;
		text-align: center;
		margin-top: 81rpx;
		
	}
	.titl2{
		display: block;
		margin-top: 80rpx;
		text-align: center;
		font-size: 35rpx;
		color: #5A5A5A;
		border-bottom: 1rpx solid var(--fenge);
		padding-bottom: 30rpx;
		
	}
	.red{
		color: #FC0000;
	}
	.payv{
		padding: 30rpx 44rpx 0;
	}
	.payv>:nth-child(1){
		font-size: 42px;
	}
	.payv>:nth-child(2){
		font-size: 35rpx;
		margin-left: 30rpx;
		display: flex;
		flex: 1;
	}
	.payv>image{
		width: 42rpx;
		height: 41rpx;
	}
	.btns{
		margin: 72rpx auto 48rpx;
		width: 704rpx;
		height: 87rpx;
		;background: linear-gradient(45deg,rgba(244,200,160,1),rgba(245,212,175,1),rgba(253,234,213,1));
		border-radius: 30px;
		font-size: 34rpx;
		color: #975b18;
		display: block;
		text-align: center;
		line-height: 87rpx;
	}
</style>
