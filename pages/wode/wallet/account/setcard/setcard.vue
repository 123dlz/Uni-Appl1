<template>
	<view>
		<view class="view">
			<text>{{type == 'alipay' ? '支付宝' : '微信'}}账户</text>
			<input v-model="card" type="text" :placeholder="'输入正确的' + (type == 'alipay' ? '支付宝' : '微信') + '账号'" />
			<input v-model="name" type="text" placeholder="输入您的真实姓名" />
		</view>
		<text class="btns" @tap="btns">保存</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:'',
				card:'',
				name:''
			}
		},
		onLoad(e) {
			this.type = e.type;
			uni.setNavigationBarTitle({
				title:(e.type == 'alipay' ? '支付宝' : '微信') + '账号设置'
			})
			uni.getStorage({
				key:'sercard',
				success:(res)=> {
					if(res.data != null){
						let json = JSON.parse(res.data);
						this.card = json.card;this.name = json.name;
					}
				}
			})
		},
		onUnload() {
			uni.removeStorage({
				key:'sercard'
			})
		},
		methods: {
			btns(){
				if(this.card == ''){
					this.showToast('请输入正确的账号')
				}else if(this.name == ''){
					this.showToast('请输入您的真实姓名')
				}else{
					this.showload();
					let data = JSON.stringify({card:this.card,name:this.name});
					let sign = this.md5(this.$store.state.userinfo.token + this.type + data + 'setcards');
					this.GetJson(this.ip + 'setaccount.php','POST',{
						sign:sign,
						token:this.$store.state.userinfo.token,
						type:this.type,
						data:data
					},e=>{
						this.hideload();
						if(this.isdata(e)){
							this.$set(this.$store.state.account,this.type,data);
							this.showToast('保存成功！');
							uni.navigateBack();
						}
					})
				}
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateBack();
		}
	}
</script>

<style>
	page {
		background-color: #111111;
	}
	.view{
		border-radius: 10rpx;
		margin: 20rpx;
		margin-top: 35rpx;
		padding: 42rpx 29rpx;
		background-color: #151515;
	}
	.view>text{
		color: #555555;
		display: block;
		margin-bottom: 20rpx;
	}
	.view>input{
		padding: 10rpx 20rpx;
		font-size: 30rpx;
		height: 90rpx;
		line-height: 70rpx;
		margin-top: 10rpx;
		display: block;
		border-radius: 5rpx;
		background-color: #191919;
	}
	.btns{
		margin: 30rpx auto 0;
		background-color: #050505;
		width:720rpx;
		height: 94rpx;
		border-radius: 10rpx;
		font-size: 30rpx;
		color: #555555;
		display: block;
		text-align: center;
		line-height: 94rpx;
	}
</style>
