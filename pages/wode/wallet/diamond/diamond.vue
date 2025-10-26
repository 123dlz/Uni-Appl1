<template>
	<view>
		<view class="listv row">
			<view @tap="listtap(index)" v-for="(item,index) in list" :key="item.id" :class="newind == index ? 'newview' : ''">
				<text>{{item.num}}个钻石</text>
				<text>¥{{item.money}}</text>
			</view>
		</view>
		<!--<text class="ttit1">选择支付方式</text>-->
		<text class="titl2" v-if="list.length > 0">付款<font class="red">{{list[newind].money}}</font>元，充值<font class="red">{{list[newind].num}}</font>钻石</text>
		
		<view class="payv row" @tap="paytap('alipay')">
			<text class="iconfont" style="color: #04B4FD;">&#xe60c;</text>
			<text>支付宝支付</text>
			<image :src="'../../../../static/' +  (pay == 'alipay' ? 'yixuan.png' : 'weixuan.png')" mode=""></image>
		</view>
		<view class="payv row" @tap="paytap('wxpay')">
			<text class="iconfont" style="color: #26C446;">&#xe608;</text>
			<text>微信支付</text>
			<image :src="'../../../../static/' +  (pay == 'wxpay' ? 'yixuan.png' : 'weixuan.png')" mode=""></image>
		</view>
		<text class="btns" @tap="btns">确认充值</text>
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
			this.GetJson(this.ip + 'diamondsarr.php','GET',{},e=>{
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
					type:1,
					adder:'',
					technician:'',
					servid:''
				},e=>{
					if(this.isdata(e)){
						this.pays(e.order_id);
					}else{
						this.hideload();
					}
					console.log(e)
				})
			},
			pays(order_id){
				let sign = this.md5(order_id + this.$store.state.userinfo.token);
				this.GetJson(this.ip + 'pay/pay.php','POST',{sign:sign,token:this.$store.state.userinfo.token,order:order_id,paytype:this.pay},e=>{
					console.log(e);
					this.hideload();
					if(this.isdata(e)){
						uni.requestPayment({
							orderInfo:e.data,
							provider:this.pay,
							fail: (err) => {
								console.log(err);
								this.showToast('支付失败！');
							},
							success: (es) =>{
								console.log(es);
								this.showload();
								this.ispay(order_id);
							}
						})
					}
				})
			},
			ispay(order_id){
				let sign = this.md5(this.$store.state.userinfo.token + order_id + 'ispaynew');
				console.log({
					sign:sign,
					token:this.$store.state.userinfo.token,
					orderid:order_id
				})
				this.GetJson(this.ip + 'pay/ispay.php','POST',{
					sign:sign,
					token:this.$store.state.userinfo.token,
					orderid:order_id
				},e=>{
					console.log(e);
					this.hideload();
					if(this.isdata(e)){
						this.$store.state.userinfo.diamonds = Number(this.$store.state.userinfo.diamonds) + Number(this.list[this.newind].num);
						this.showToast('充值成功！');
						uni.navigateBack();
					}
				})
			}
		}
	}
</script>

<style>
	
	.listv{
		flex-wrap: wrap;
	}
	.listv>view{
		width: 211rpx;
		height: 126rpx;
		border-radius: 15rpx;
		border: 1rpx solid #414141;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 35rpx;
		margin-left: 29.25rpx;
		transition: all;
	}
	.listv>view>text{
		font-size: 29rpx;
		display: block;
	}
	.listv>view>:nth-child(2){
		color: #000000;
		margin-top: 10rpx;
	}
	.newview{
		border: 1rpx solid #fdc5e0 !important;
		background-color: #fdc5e0;
	}
	.newview>text{
		color: #FFFFFF !important;
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
		background: #fdc5e0;
		border-radius: 30px;
		font-size: 34rpx;
		color: #FFFFFF;
		display: block;
		text-align: center;
		line-height: 87rpx;
	}
</style>
