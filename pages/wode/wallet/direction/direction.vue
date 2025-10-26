<template>
	<view>
		
		<view class="list row" v-for="item in list" :key="item.id">
			<view>
				<text class="title fonta">{{state[item.type]}}</text>
				<text class="time  fonta">{{gettime(item.time,'yyyy-MM-dd')}}</text>
			</view> 
			<text class="money fonta">{{item.direction == '0' ? '-' : '+'}}{{item.type == '3' ||item.type == '5' ||item.type == '8' ||item.type == '9'||item.type == '11' || item.type == '12'? item.num : item.money}}</text>
			<text style="color:#555555">{{item.type =='3' ||item.type =='5' || item.type =='8' ||item.type =='9' ||item.type == '11' ||item.type == '12'? '钻石' : '元'}}</text>
			
		</view>
		
		<load v-if="load == 'up'"></load>
		<null class="null" v-if="load == null && list.length == 0" info=暂无相关数据></null>
		<picks ref="picks" :tab="tab" :set="set"></picks>
	</view>
</template>

<script>
	export default {
		data() {
			return { 
				tabindex:0,
				tab:['全部','1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				load:null,
				list:[],
				state:['开通会员','退款','推广收益','充值钻石','提现','送礼物','收到礼物','礼物佣金','钻石消费','钻石收入','兑换余额','钻石兑换','注册送钻石']
			}
		},
		computed:{
		},
		methods: {
			getdata(is){
				this.load = is;
				let sign = this.md5(this.$store.state.userinfo.token + this.list.length.toString());
				this.GetJson(this.ip + 'direction.php','POST',{type:this.tabindex,num:this.list.length,token:this.$store.state.userinfo.token,sign:sign},e=>{
					if(this.isdata(e)){
						console.log(e);
						this.list = [...this.list,...e.list];
					}
					
					this.load = null;
					if(is)uni.stopPullDownRefresh();
				})
			},
			set(index){
				this.tabindex = index;
			}
		},
		onLoad() {
			this.tabindex = (new Date()).getMonth() + 1;
		},
		watch:{
			tabindex(newval,lod){
				if(newval != lod){
					this.$scope.$getAppWebview().setTitleNViewButtonStyle(1, {
						text: this.tab[newval]
					})
					this.list = [];
					this.getdata('up');
				}
			}
		},
		onNavigationBarButtonTap() {
			this.$refs.picks.show(this.tabindex);
		},
		onReachBottom() {
			if(this.load == null)this.getdata('up');
		}
	}
</script>

<style>
	page{
	 background-color: #111111;
	}
	.fonta{
		color: #555555;
	}
	
	.null{
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
	}
	.list{
		padding: 30rpx;
		border-bottom: 1rpx solid #000000;
	}
	.list>view{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.title{
		display: block;
		font-size: 32rpx;
		font-weight: 700;
		margin-bottom: 14rpx;
	}
	.time{
		font-size: 28rpx;
		color: #827E80;
	}
	.money{
		font-size: 30rpx;
		color: #FE3481;
	}
</style>
