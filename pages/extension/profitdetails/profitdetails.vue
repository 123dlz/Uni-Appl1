<template>
	<view>
		<view style="" class="tab_top row">
			<view v-for="(item,index) in tab" class="tab_list row" :id="'t' + index">
				<picker :value="item.index" mode="selector" :range="item.arr" @change="tabtap(index,$event)">
					<view class="row">
						<text class="tab_title">{{item.arr[item.index]}}</text>
						<text class="tab_icon iconfont">&#xe629;</text>
					</view>
				</picker>
			</view>
		</view>

		<view style="" class="v2 row">
			<view>
			 <text class="vname">{{rdata[0]}}元</text>
			<text class="fonts">一级返佣</text>
			</view>
			
			<view>
			 <text class="vname">{{rdata[1]}}元</text>
			<text class="fonts">二级返佣</text>
			</view>
			
			<view>
			 <text class="vname">{{rdata[2]}}元</text>
			<text class="fonts">总返佣</text>
			</view>
		</view>
		
		<view v-for="item in list" :key="item.id" class="list row">
			<view class="userv">
				<image :src="url + item.user.avatar" mode=""></image>
				<text class="fonts">{{item.user.name}}</text>
			</view>
			<view class="infov">
				
				
				<text class="vname" v-if="item.order.type == '1'">充值钻石</text>
				<text class="vname" >{{item.order.type == '1' ? '消费' : '开通VIP：'}}<font class="red">{{item.order.smoney}}</font>元</text>
				<text class="fonts" style="font-size: 25rpx;color: #bfbfbf;margin-top: 20rpx;">购买时间:{{gettime(item.order.addtime,'yyyy-MM-dd hh:ss')}}</text>
				
			</view>
			<text class="vname">+{{item.money}}</text>
		</view>
		
		<null class="null" v-if="!load && this.list.length == 0" info="暂无数据"></null>
		<load v-if="load"></load>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tab: [{
						index: 0,
						arr: ['全部','一级用户', '二级用户']
					},
					{
						index: 0,
						arr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
					}
				],
				load:false,
				list:[],
				rdata:['-','-','-']
			}
		},
		computed:{
			user(){
				return this.$store.state.userinfo;
			}
		},
		onLoad() {
			this.tab[1].index = (new Date()).getMonth();
			let sign = this.md5(this.user.token + 'profitleijis');//获取累计
			this.GetJson(this.ip + 'profitleiji.php','POST',{sign:sign,token:this.user.token},e=>{
				if(this.isdata(e)){
					this.rdata = e.data;
				}
			})
			this.getdata();
		},
		methods: {
			tabtap(index,e){
				this.tab[index].index = e.detail.value
				this.getdata(true);
			},
			getdata(is){
				if(is === true)this.list = [];
				this.load = true;
				let sign = this.md5(this.user.token + this.list.length.toString() + 'getnum');
				this.GetJson(this.ip + 'profitdetails.php','POST',{
					sign:sign,
					token:this.user.token,
					ind:this.tab[0].index,
					ind2:this.tab[1].index,
					num:this.list.length
				},e=>{
					this.load = false;
					if(this.isdata(e)){
						console.log(e.list)
						this.list = [...this.list,...e.list];
					}
				})
			}
		},
		onReachBottom() {
			this.getdata();
		}
	}
</script>

<style>
	page{
		padding-top: 110rpx;
		background-color: #111111;
	}
	.font{
			background-image: linear-gradient(to right ,#5a18d1,#9B63FF);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
	}
	.fonts{
			background-image: linear-gradient(to right ,#9650bb,#9650bb);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
	}
	.vname{
		background-image: linear-gradient(to right ,#ff8870,#dea5fc);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.tab_top{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding: 0 32rpx;
		height: 70rpx;
		z-index: 3;
		background-color: #181818;
		border-top: 0rpx solid #181818;
	}
	.tab_list{
		width: 200rpx;
	}
	.tab_title{
		font-weight: 500;
		font-size: 16px;
		color: #ffffff;
	}
	.tab_icon{
		font-size: 14rpx;
		display: inline-block;
		margin-left: 10rpx;
		color: #ffffff;
	}
	.top2{
		position: fixed;
		top: 70rpx;
		left: 0;
		right: 0;
		padding: 32rpx;
		height: 70rpx;
		background-color: #111111;
		font-size: 12px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		z-index: 1;
	}
	.red{
		color: #F80808;
	}
	.v2{
        background-color: #111111;
		justify-content: space-around;
		margin-top: -50rpx;
		padding-bottom: 40rpx;
	}
	.v2>view{
        margin-top: 35rpx;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.v2>view>:nth-child(1){
		font-weight: 500;
		font-size: 35rpx;
		color: #000000;
		margin-bottom: 22rpx;
		font-weight: bold;
	}
	.v2>view>:nth-child(2){
		font-size: 25rpx;
	}
	.maincolor{
		color: var(--maincolor);
	}
	.null{
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
		animation: opacitys .3s;
	}
	.list{
		margin: 0 30rpx;
		padding: 60rpx 0;
		border-bottom: 1rpx solid var(--fenge);
	}
	.userv{
		text-align: center;
		margin-right: 30rpx;
	}
	.userv>image{
		width: 80rpx;
		height: 80rpx;
		display: block;
		border-radius: 100rpx;
	}
	.userv>text{
		font-size: 12px;
	}
	.infov{
		display: flex;
		flex: 1;
		flex-direction: column;
	}
	.infov>:nth-child(1){
			font-weight: 500;
		font-size: 14px;
		display: block;
		margin-bottom: 20rpx;
	}
	.infov>:nth-child(2){
	
		font-size: 13px;
		color: #827E80;
	}
	.list>text{
		font-size: 17px;
		color: var(--maincolor);
	}
</style>
