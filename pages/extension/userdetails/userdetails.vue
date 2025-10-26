<template>
	<view>
		<view class="tab_top row">
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
			 <text class="vname">{{rdata[0]}}人</text>
			<text class="fonts">一级用户</text>
			</view>
			
			<view>
			 <text class="vname">{{rdata[1]}}人</text>
			<text class="fonts">二级用户</text>
			</view>
			
			<view>
			 <text class="vname">{{rdata[2]}}人</text>
			<text class="fonts">累计用户</text>
			</view>
		</view>
		
		
		<view v-for="item in list" :key="item.userid" class="list row">
			<image :src="url + item.avatar" mode=""></image>
			<text>{{item.name}}</text>
			<view>
				<text class="vname">{{item.agent == user.Invitation ? '一级用户' : '二级用户'}}</text>
				<text class="fonts">{{gettime(item.addtime,'yyyy-MM-dd')}}</text>
			</view>
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
			let sign = this.md5(this.user.token + 'promotiondetails');//获取累计
			this.GetJson(this.ip + 'promotiondetails.php','POST',{sign:sign,token:this.user.token},e=>{
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
				this.GetJson(this.ip + 'userdetails.php','POST',{
					sign:sign,
					token:this.user.token,
					ind:this.tab[0].index,
					ind2:this.tab[1].index,
					num:this.list.length
				},e=>{
					this.load = false;
					if(this.isdata(e)){
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
		background-color: #1e2138;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding: 0 32rpx;
		height: 70rpx;
		z-index: 3;
		border-top: 0rpx solid #E9E8E9;
	}
	.tab_list{
	
		width: 200rpx;
	}
	.tab_title{
		font-weight: 500;
		font-size:26rpx;
		color: #ffffff;
	}
	.tab_icon{
		font-size: 14rpx;
		display: inline-block;
		margin-left: 10rpx;
		color: #FFFFFF;
	}
	.top2{
		position: fixed;
		top: 70rpx;
		left: 0;
		right: 0;
		padding: 32rpx;
		height: 70rpx;
		background-color: #1e2138;
		font-size: 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		z-index: 1;
	}
	.red{
		color: #F80808;
	}
	.null{
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
		animation: opacitys .3s;
	}
	.v2{
	   background-color: #191c33;
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
	.list{
		margin: 0 30rpx;
		padding: 30rpx 0;
		border-bottom: 1rpx solid var(--fenge);
	}
	.list>image{
		margin-right: 33rpx;
		width: 117rpx;
		height: 117rpx;
		border-radius: 100rpx;
	}
	.list>text{
		font-size: 30rpx;
		display: flex;
		flex: 1;
	}
	.list>view>text{
		display: block;
		font-size: 28rpx;
		color: #8B8B8B;
	}
</style>
