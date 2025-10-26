<template>
	<view>
		<view v-for="item in list" :key="item.id" class="list row">
			<view>
				<text class="fontb" v-if="item.type == '3'">充值钻石</text>
				<text class="fontb" v-if="item.type == '5'">视频打赏</text>
				<text class="fontb" v-if="item.type == '7'">收到礼物</text>
				<text class="fontb" v-if="item.type == '8'">观看视频</text>
				<text class="fontb" v-if="item.type == '9'">钻石收入</text>
				<text class="fontb" v-if="item.type == '10'">兑换余额</text>
				<text class="fontb" v-if="item.type == '11'">钻石兑换</text>
				<text>{{gettime(item.time,'yyyy-MM-dd hh:mm')}}</text>
			</view>
			<text  class="fontb">{{item.direction == '0' ? '-' : '+'}}{{item.num}}钻石</text>
		</view>
		<load v-if="load"></load>
		<null class="null" v-if="!load && list.length == 0" info="没有记录!"></null>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				load:false,
				list:[]
			}
		},
		computed:{
			user(){
				return this.$store.state.userinfo;
			}
		},
		onLoad() {
			this.getdata();
		},
		methods: {
			getdata(){
				this.load = true;
				let sign = this.md5(this.$store.state.userinfo.token + this.list.length.toString() + 'diamondde');
				this.GetJson(this.ip + 'diamonddetails.php','POST',{
					sign:sign,
					token:this.$store.state.userinfo.token,
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
	 background-color: #111111;
	}
	.fonta{
		background-image: linear-gradient(to right ,#521fad,#7b42e0,#521fad); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.fontb{
		background-image: linear-gradient(to right ,#f93bd7,#fe6dc6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	.fontc{
		background-image: linear-gradient(to right ,#ff52bc,#fe6dc6,#fd49b7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
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
		margin: 30rpx 15rpx;
		border-radius: 20rpx;
		background-color: #151515;
		box-shadow: 0px 0px 16rpx 0px rgba(0, 0, 0, 0.1);
		padding: 30rpx 50rpx;
	}
	.list>view{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.list>view>:nth-child(1){
		font-size: 15px;
		display: block;
		margin-bottom: 20rpx;
		font-weight: 500;
	}
	.list>view>:nth-child(2){
		font-size: 23rpx;
		color: #626262;
	}
	.list>text{
		font-size: 24rpx;
		color: #FF3C85;
		font-weight: 500;
	}
</style>
