<template>
	<view>
	
		<view class="top"></view>

           <view class="view">
			   <view>
				 <view style="margin-top: -400rpx;">					
				   <text class="zong">
					<font style="font-size: 30rpx;color: #eaedfe;">总资产（元）</font>  
				   </text> 
			   </view>			   
               <view>
                    <text class="money">
			   		<font class="fontb" style="font-size: 65rpx;color: red;">{{parseFloat($store.state.userinfo.money).toFixed(2)}}</font>  
			   		</text>
	         </view>			   
			   </view>	
			<view class="botm row" >
				<view :style="yincang">
					<text class="data">{{$store.state.userinfo.diamonds}}</text>
					<text style="color: #eaedfe;">钻石数量</text>

				</view>
				<view>
					<text class="dataa">{{jrsy}}</text>
					<text style="color: #eaedfe;">今日收益(元)</text>
					
				</view>
				<view >
					<text class="datab">{{ljsy}}</text>
					<text style="color: #eaedfe;">累计收益(元)</text>
					
				</view>
				
			</view>	
			<view class="moneyv row">

			</view>

		</view>
		
		<view class="list row" >
			<view  @tap="ntourl('diamond/exchange')">
				<image src="../../../static/wallet/a.png" mode=""></image>
				<text style="color: #777777;font-size: 30rpx;">钻石兑换</text>
			</view>
			<view @tap="ntourl('withdraw/withdraw')">
				<image src="../../../static/wallet/b.png" mode=""></image>
				<text style="color: #777777;font-size: 30rpx;">提现</text>
			</view>

		</view>

		<view class="list1">
			<view @tap="ntourl('direction/direction')">
				<image src="../../../static/wallet/c.png" mode=""></image>
				<text style="color: #777777;font-size: 30rpx;">交易明细</text>
				<text style="margin-left: 410rpx;"  class="iconfont">&#xe625;</text>
			</view>
			<view  @tap="ntourl('withdrawalrecord/withdrawalrecord')">
				<image  src="../../../static/wallet/d.png" mode=""></image>
				<text style="color: #777777;font-size: 30rpx;">提现记录</text>
				<text style="margin-left: 410rpx;"  class="iconfont">&#xe625;</text>
			</view>
		 </view>

	</view>
	
	
</template>

<script>
	export default {
		data() {
			return {
				jrsy:'-',
				ljsy:'-',

			}
		},
		onLoad() {
			uni.getStorage({//读取缓存数据
				key:this.$store.state.userinfo.userid + 'userwallet',
				success: (res) => {
					this.jrsy = res.data.jr
					this.ljsy = res.data.lj;
				}
			})
			let sign = this.md5(this.$store.state.userinfo.token + 'userwallets');
			this.GetJson(this.ip + 'userwallet.php','POST',{sign:sign,token:this.$store.state.userinfo.token},e=>{
				if(this.isdata(e)){
					this.$store.state.userinfo.money = e.money;
					this.$store.state.userinfo.diamonds = e.diamonds;
					this.jrsy = e.data.jr;
					this.ljsy = e.data.lj;
					uni.setStorage({//写入缓存数据
						key:this.$store.state.userinfo.userid + 'userwallet',
						data:e.data
					})
				}
			})

		},
		computed:{
			user(){
				return this.$store.state.userinfo;
			}
		},
		methods: {
			baobiao(){
				uni.navigateTo({
					url:'baobiao'
				})
			},
			ntourl(item) {
				uni.navigateTo({
					url: item
				})
			}
		}
	}
</script>

<style>
	page{
     background-color: #111111;
	}
	.fonta{
		color: #FFFFFF;
	}
	
	.top{
		background: linear-gradient(45deg,#111111,#101010,#151515);
		height: 550rpx;
	}
	.mainimg {
		width: 750rpx;
		height: 500rpx;
		background-color: #111111;
		position: fixed;
		top: 0;
		left: 0;
		transition: transform;
		z-index: -1;
	}
	.user{
		background-color: #111111;
		width: 176rpx;
		height: 176rpx;
		border-radius: 100rpx;
		position: absolute;
		top: 160rpx;
		border: 6rpx solid #FFFFFF;
		left: 500rpx;
	}
	.view{
		/*box-shadow: 0rpx 5rpx 12rpx 0rpx rgba(0, 0, 0, 0.35);*/
		margin-top: 1rpx;
	}
	.money{
		margin-left:50rpx;
		font-size: 65rpx;
		font-weight: 800;
		margin-top: 400rpx;
	}
	.zong{
		margin-left: 50rpx;
		font-size: 65rpx;
		font-weight: 800;
		margin-top: 20rpx;
	}
	.moneyv{
		margin-left: 27rpx;
	}
	.moneyv>view{
		flex: 1;
	}
	.moneyv>view>:nth-child(1){
		font-size: 33rpx;
		color: #474747;
		display: block;
	}
	.moneyv>view>:nth-child(2){
		font-size: 50rpx;
		color: var(--color);
		display: block;
		font-weight: bold;
	}
	.moneyv>text{
		width: 155rpx;
		height: 55rpx;
		border-radius: 15rpx;
		border: 1rpx solid #FFC5DD;
		color: var(--color);
		font-size: 28rpx;
		text-align: center;
		line-height: 55rpx;
		margin-left: 15rpx;
	}
	.fenge{
		
			display: inline-block;
			height: 10px;
			width: 1px;
			margin: 0 10px;
			vertical-align: middle;
			background-color: #e2e2e2;
		

	}
	.botm{
		margin-top: 100rpx;
		justify-content: space-around;
	}
	.data{
		font-size: 40rpx;
		display: block;
		color: #FD4787;
		text-align: center;
	}
	.dataa{
		font-size: 40rpx;
		display: block;
		color: #FD4787;
		text-align: center;
	}
	.datab{
		font-size: 40rpx;
		display: block;
		color: #FD4787;
		text-align: center;
	}
	.botm>view>:nth-child(2){
		color: #000000;
		font-size: 25rpx;
		margin-top: 15rpx;
	}
	.list{
       
		flex-wrap: wrap;
		justify-content: space-around;
		margin-top: 56rpx;
	}
	.list>view{
        float:left;
		width: 330rpx;
		height: 120rpx;
		border-radius: 15rpx;
	}
	.list>:nth-child(1){
		background-color: #191919;
	}
	.list>:nth-child(2){
		background-color: #191919;
	}
	.list>:nth-child(3){
		background-color: #191919;
	}
	.list>:nth-child(4){
		background-color: #191919;
	}
	.list>view{
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 67rpx;
		margin-bottom: 37rpx;
	}
	.list>view>image{
		width: 46rpx;
		height: 46rpx;
		margin-right: 17rpx;
	}
	.list>view>text{
		color: #000000;
		font-size: 35rpx;
		font-weight: 500;
	}
	
	
	.list1 {
		background-color: #191919;
		margin-top: 20rpx;
		margin: 20rpx;
		border-radius: 20rpx;
	}
	
	.list1>view {
		padding: 35rpx 32rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #7F7E7E;
	}
	.list1>view>image{
		width: 55rpx;
		height: 55rpx;
		margin-right: 17rpx;
	}
	
	.list1>view>text:nth-child(1) {
		font-size: 26rpx;
		font-weight: 600;
		color: #0C0B0B;
		display: flex;
		flex: 1;
	}
</style>
