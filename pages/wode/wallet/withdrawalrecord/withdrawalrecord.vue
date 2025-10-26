<template>
	<view>
		<view class="list row" v-for="item in list" :key="item.id">
			<view class="v1">
				<image :src="url + $store.state.userinfo.avatar" mode=""></image>
				<text class="font">{{$store.state.userinfo.name}}</text>
			</view>
			<view class="v2">
				<text class="font">余额提现 
				<font class="time">{{gettime(item.addtime,'yyyy-MM-dd')}}</font>
				</text>
				<text class="font">{{item.state =='0'  ? '审核中...' : ''}}</text>
				<text class="font">{{item.state =='1'  ? '提现成功' : ''}}</text>
				<text class="font">{{item.state =='2'  ? '提现失败:' : ''}}{{item.info}}</text>
			</view>		
			<text class="font">-{{item.money}}元</text>
		</view>
		<picks ref="picks" :tab="tab" :set="set"></picks>
		<load v-if="load"></load>
		<null class="null" v-if="!load && list.length == 0" info="没有记录!"></null>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				load:false,
				list:[],
				tabindex:0,
				tab:['全部','1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
			}
		},
		computed:{
		},
		onLoad() {
			this.tabindex = (new Date()).getMonth() + 1;
		},
		methods: {
			getdata(){
				this.load = true;
				let sign = this.md5(this.$store.state.userinfo.token + 'withdrawalrecord');
				this.GetJson(this.ip + 'withdrawalrecord.php','POST',{
					sign:sign,
					token:this.$store.state.userinfo.token,
					num:this.list.length,
					type:this.tabindex
				},e=>{
					this.load = false;
					if(this.isdata(e)){
						this.list = [...this.list,...e.list];
					}
				})
			},
			set(index){
				this.tabindex = index;
			}
		},
		watch:{
			tabindex(newval,lod){
				if(newval != lod){
					this.$scope.$getAppWebview().setTitleNViewButtonStyle(1, {
						text: this.tab[newval]
					})
					this.list = [];
					this.getdata();
				}
			}
		},
		onReachBottom() {
			this.getdata();
		},
		onNavigationBarButtonTap() {
			this.$refs.picks.show(this.tabindex);
		}
	}
</script>

<style>
	page{
	 background-color: #111111;
	}
	.font{
		color: #555555;
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
		padding: 30rpx 0;
		margin: 0 22rpx;
		border-bottom: 1rpx solid #111111;
	}
	.v1>image{
		width: 80rpx;
		height: 80rpx;
		border-radius: 100rpx;
		display: block;
		margin-bottom: 17rpx;
	}
	.v1>text{
		font-size: 24rpx;
		display: block;
	}
	.v2{
		margin-left: 75rpx;
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.v2>:nth-child(1){
		font-size: 35rpx;
		color: #1B1A1A;
		display: block;
		margin-bottom: 20rpx;
	}
	.v2>:nth-child(2){
		font-size: 29rpx;
		color: #285ffe;
		display: block;
	}
	.v2>:nth-child(3){
		line-height: 60rpx;
		font-size: 29rpx;
		color: #10a705;
		display: block;
	}
	.v2>:nth-child(4){
		line-height: 60rpx;
		font-size: 29rpx;
		color: red;
		display: block;
	}

	.list>text{
		font-size: 35rpx;
		color: #FE3481;
	}
	.time{
		font-size: 26rpx;
		color:#c4c4c4;
		margin-left: 30rpx;
	}
	.shibai{
		font-size: 25rpx;
		color:red;
		margin-left: 10rpx;
	}
	
</style>
