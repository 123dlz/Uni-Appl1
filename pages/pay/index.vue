<template>
	<view>
		<view>
			<view>
		<view class="vipbg">
			<view class="vips">
				<image class="img" src="../../static/vip.png"></image>
				VIP会员开通
			</view>
			<view class="text">
				无限制的播放所有收费视频
			</view>
			<view class="listv row">
				<view @tap="listtap(index)" v-for="(item,index) in list" :key="item.id" :class="newind == index ? 'newview' : ''">
					<view>
					<text style="padding-top:20rpx;">{{item.title}}</text>
					<text>¥{{item.money}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="opay">
		<view class="payv row" @tap="paytap('alipay')">
			<text class="iconfont" style="color: #FFFFFF;">&#xe60c;</text>
			<text style="color: #FFF;font-size: 28rpx;">支付宝支付</text>
			<image :src="'../../static/' +  (type == 'alipay' ? 'yixuan.png' : 'weixuan.png')" mode=""></image>
		</view>
		<view class="payv row" @tap="paytap('wxpay')">
			<text class="iconfont" style="color: #FFFFFF;">&#xe608;</text>
			<text style="color: #FFF;font-size: 28rpx;">微信支付</text>
			<image :src="'../../static/' +  (type == 'wxpay' ? 'yixuan.png' : 'weixuan.png')" mode=""></image>
		</view>
		</view>
		</view>
		</view>
		<text class="btns" @tap="btns">确认充值</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order_id:null,
				list:[],
				newind:0,
				type:'alipay'
			}
		},
		computed:{
			user(){
				return this.$store.state.userinfo;
			}
		},
		onShow() {
			if(this.order_id != null){
				this.ispay(this.order_id);
			}
		},
		onLoad() {
			this.GetJson(this.ip + 'App_api.php','POST',{
				type:'get_vip'
			},e=>{
				if(this.isdata(e)){
					this.list = e.list
				}
			})
		},
		methods: {
			listtap(index){
				this.newind = index;
			},
			paytap(type){
				this.type = type;
			},
			btns(){
				this.showload('提交中...');
				let sign = this.md5(this.$store.state.userinfo.token + this.list[this.newind].money  + 'Createorders' );
				this.GetJson(this.ip + 'App_api.php','POST',{
					token:this.$store.state.userinfo.token,
					title:this.list[this.newind].title,
					money:this.list[this.newind].money,
					days:this.list[this.newind].days,
					sign:sign,
					type:'Create_order',
					paytype:this.type,
					order_type:0
				},e=>{
					this.hideload();
					console.log(e)
					if(this.isdata(e)){
						this.order_id = e.order_id;
						uni.navigateTo({
							url:'pay?order_id=' + e.order_id
						}) 
					}
				})
			},
			ispay(order_id){
				let sign = this.md5(this.$store.state.userinfo.token + order_id + 'ispaynew');
				this.GetJson(this.ip + 'App_api.php','POST',{
					sign:sign,
					token:this.$store.state.userinfo.token,
					order_id:order_id,
					type:'ispay'
				},e=>{
					console.log(e);
					this.hideload();
					if(this.isdata(e)){
						this.showToast('交易成功');
						uni.reLaunch({
							url:'../wode/index'
						})
					}
					if(e.code == 201){
						this.showToast('支付失败...');
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
	
	.vipbg{
		margin:30rpx;
		background: linear-gradient(45deg,rgba(244,200,160,1),rgba(245,212,175,1),rgba(253,234,213,1));
		border-radius: 20rpx 20rpx 0rpx 0rpx;
		padding: 20rpx 15rpx;
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
	.opay{
		padding: 30rpx 10rpx;
		margin: 30rpx;
		background-color:#01cb65;
		border-radius: 0rpx 0rpx 20rpx 20rpx;
		margin-top: -30rpx;
	}
	.img{
		height: 40px;
		width:80rpx;
		top:20rpx;
	}
	.text{
		font-size: 23rpx;
		font-weight: 600;
		text-align: center;
		padding: 20rpx;
		margin-top: -40rpx;
	}
	.listv{
		margin-bottom: 80rpx;
		margin-left:18rpx;
		flex-wrap: wrap;
	}
	.listv>view{
		background-color: #000;
		border-radius: 15rpx;
		display: flex;
		text-align: center;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 35rpx;
		margin-left: 8rpx;
		transition: all;
	}
	
	.listv>view>view{
		width: 190rpx;
		height: 120rpx;
		border-radius: 15rpx;
		border: 1rpx solid #414141 ; 
	}
	.listv>view>view>text{
		font-size: 27rpx;
		display: block;
		color: #999999;
	}
	.newview>view{
		text-align: center;
		border: 3rpx solid #F7297B !important;
		background-color: #FA5A9A;
	}
	.newview>view>text{
		font-size: 30rpx;
		font-weight: 700;
		display: block;
		color: #ffffff!important;
		
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
		height: 140rpx;
		;background: linear-gradient(45deg,rgba(244,200,160,1),rgba(245,212,175,1),rgba(253,234,213,1));
		border-radius: 30px;
		font-size: 38rpx;
		color: #975b18;
		font-weight: 700;
		display: block;
		text-align: center;
		line-height: 140rpx;
	}
</style>
