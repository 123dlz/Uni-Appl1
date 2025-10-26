<template>
	<view>
		<view class="top"></view>
           <view class="view">
			   <text >
			   <image class="user" :src="url + $store.state.userinfo.avatar" mode=""></image>
			   </text>
			   <view>
				
				 <view style="margin-top: -340rpx;">					
				   <text class="zong">
					<font style="font-size: 35rpx;">余额（元）</font>  
				   </text> 
			   </view>			   
               <view style="margin-top: 0rpx;">
                    <text class="money">
			   		<font style="font-size: 50rpx;color: red;">{{$store.state.userinfo.money}}</font>  
			   		</text>
	         </view>			   
			   </view>	

		</view>
		
		<view class="shuoming row">
           <text class="aimi fontb">收益报表的金额包含:礼物收益、推广佣金收益</text>
		</view>

		<view class="list1">
			<view>
				<image src="../../../static/wallet/ri.png" mode=""></image>
				<text class="fontc" style="color: #0C0B0B;font-weight: 600;">今日收益</text>
				<text style="margin-left: 320rpx; color:red;">{{jrsy}}元</text>
			</view>
			<view >
				<image  src="../../../static/wallet/zhou.png" mode=""></image>
				<text class="fontc" style="color: #0C0B0B;font-weight: 600;">本周收益</text>
				<text  style="margin-left: 320rpx;color:red;"  >{{zhousy}}元</text>
			</view>
			<view>
				<image src="../../../static/wallet/yue.png" mode=""></image>
				<text class="fontc" style="color: #0C0B0B;font-weight: 600;">本月收益</text>
				<text style="margin-left: 320rpx;color:red;"  >{{yuesy}}元</text>
			</view>
			<view>
			<image src="../../../static/wallet/nian.png" mode=""></image>
				<text class="fontc" style="color: #0C0B0B;font-weight: 600;">本年收益</text>
				<text style="margin-left: 320rpx;color:red;" >{{niansy}}元</text>
			</view> 
			<view >
				<image src="../../../static/wallet/zong.png" mode=""></image>
				<text class="fontc" style="color: #0C0B0B;font-weight: 600;">累计收益</text>
				<text style="margin-left: 320rpx;color:red;">{{ljsy}}元</text>
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
				zhousy:'-',
				yuesy:'-',
				niansy:'-'
			}
		},
		onLoad() {
			uni.getStorage({//读取缓存数据
				key:this.$store.state.userinfo.userid + 'userwallet',
				success: (res) => {
					this.jrsy = res.data.jr
					this.zhousy = res.data.zhou
					this.yuesy = res.data.yue;
					this.niansy = res.data.nian;
					this.ljsy = res.data.lj;					
				}
			})
			let sign = this.md5(this.$store.state.userinfo.token + 'userwallets');
			this.GetJson(this.ip + 'userwallet.php','POST',{sign:sign,token:this.$store.state.userinfo.token},e=>{
				if(this.isdata(e)){
					this.$store.state.userinfo.money = e.money;
					this.$store.state.userinfo.diamonds = e.diamonds;
					this.jrsy = e.data.jr;					
					this.zhousy = e.data.zhou;
					this.yuesy = e.data.yue;
					this.niansy = e.data.nian;										
					this.ljsy = e.data.lj;
					uni.setStorage({//写入缓存数据
						key:this.$store.state.userinfo.userid + 'userwallet',
						data:e.data
					})
				}
			})
			
		},
		computed:{
		},
		methods: {

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
	 background-color: #181b2e;
	}
	.fonta{
		background-image: linear-gradient(to right ,#521fad,#7b42e0,#521fad); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.fontb{
		background-image: linear-gradient(to right ,#f93bd7,#fcd22c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.fontc{
		background-image: linear-gradient(to right ,#6b45aa,#7649c0,#6b45aa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.top{
		background: linear-gradient(45deg,#7f25b1,#5c34ac,#303086);
		height: 500rpx;
	}
	.mainimg {
		width: 750rpx;
		height: 500rpx;
		background-color: #EBEAEA;
		position: fixed;
		top: 0;
		left: 0;
		transition: transform;
		z-index: -1;
	}
	.user{
		width: 176rpx;
		height: 176rpx;
		border-radius: 100rpx;
		position: absolute;
		top: 160rpx;
		border: 6rpx solid #FFFFFF;
		left: 500rpx;
	}
	.shuoming {
		width: 710rpx;
		height: 120rpx;
		margin-left: 20rpx;
		background-color: rgba(0,0,0,0.2);
		border-radius: 30rpx;
		justify-content: space-around;
		margin-top: 22rpx;
	}
	
	.shuoming>view {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.aimi{
		font-size: 26rpx;
		color: #e7e7e9;
		margin-top: 10rpx;
		text-align:center;
		display:inline-block;
		width:350px
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
	.botm>view>text{
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
		margin-top: -80rpx;
	}
	.list>view{

		width: 330rpx;
		height: 120rpx;

	}
	.list>:nth-child(1){
		background-color: #60faf2;
	}
	.list>:nth-child(2){
		background-color: #ffed7b;
	}
	.list>:nth-child(3){
		background-color: #57C0EF;
	}
	.list>:nth-child(4){
		background-color: #FF86EF;
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
		background-color: #1f233b;
		margin-top: 60rpx;
		border-radius: 20rpx;
	}
	.list1>view {
		margin-top: 10rpx;
		padding: 35rpx 42rpx;
		border-bottom: 1rpx solid #1f233b;
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
		font-size: 16px;
		font-weight: 600;
		color: #0C0B0B;
		display: flex;
		flex: 1;
	}
</style>
