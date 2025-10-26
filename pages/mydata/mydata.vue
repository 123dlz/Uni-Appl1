<template>
	<view>
		<view class="avatarv">
			<image @tap="avatartap" :src="avatarv" mode="scaleToFill"></image>
			<text @tap="avatartap">更换头像</text>
		</view>
		<view class="view">
			<view>
				<text>昵称</text>
				<view @tap="nametap">
					<text>{{namev}}</text>
					<text class="iconfont">&#xe625;</text>
				</view>
			</view>
			<view>
				<text>性别</text>
				<view @tap="gendertap">
					<text>{{genderv}}</text>
					<text class="iconfont">&#xe625;</text>
				</view>
			</view>
			<view>
				<text>年龄</text>
				<view>
					<picker  mode="selector" :range="agedata" range-key="item" value="19" @change="agetap">
						<text>{{agev}}</text>
						<text class="iconfont">&#xe625;</text>
					</picker>
				</view>
			</view>
			<view>
				<text>微信号</text>
				<view @tap="vxtap">
					<text>{{vxv}}</text>
					<text class="iconfont">&#xe625;</text>
				</view>
			</view>
			<view>
				<text>账号</text>
				<view >
					<text>{{phonev}}</text>
				</view>
			</view>			
			
		</view>
	</view>
</template> 

<script>
	export default {
			data() {
				return {
					avatar:'',
					name:'',
					gender:'',
					phone:'',
					gendera:['未设置','男','女'],
					age:"",
					vx:'',
					agedata:[]
				}
			},
			computed:{
				user(){
					return this.$store.state.userinfo;
				},
				avatarv(){
					return this.avatar != '' ? this.avatar : this.url +  this.$store.state.userinfo.avatar;
				},
				namev(){
					return this.name != '' ? this.name :  this.$store.state.userinfo.name;
				},
				phonev(){
					return this.phone != '' ? this.phone :  this.$store.state.userinfo.phone;
				},
				genderv(){
					return this.gender != '' ? this.gendera[Number(this.gender)] : this.gendera[Number( this.$store.state.userinfo.gender)]
				},
				agev(){
					return this.age != '' ? this.age : ( this.$store.state.userinfo.age == null ? '未设置' :  this.$store.state.userinfo.age);
				},
				vxv(){
					return this.vx != '' ? this.vx : ( this.$store.state.userinfo.vx == null ||  this.$store.state.userinfo.vx == '' ? '未填写' :  this.$store.state.userinfo.vx);
				},
				vip(){
					return this.$store.state.vip.vip
				},
				starttime(){
					return this.$store.state.starttime
				},
				endtime(){
					return this.$store.state.endtime
				},
				
				baocunsi(){
					return this.avatar == '' && this.name == '' && this.gender == '' && this.age == '' && this.vx == '' ? false : true;
				}
			},
			onLoad() {
				for (let i = 1; i <= 99; i++) {
					this.agedata.push({item:i});
				}
			},
			onUnload() {
				uni.$emit('mydata',this.namev == '' ? null : this.namev);
			},
			methods: {
				avatartap(){
					uni.chooseImage({
						count:1,
						crop:{
							width:200,
							height:200
						},
						success: (e) => {
							console.log(e);
							this.avatar = e.tempFilePaths[0];
						}
					})
				},
				nametap(){
					
					uni.showModal({
						confirmColor:'#fd458a',
						content:'修改昵称',
						editable:true,
						placeholderText:this.namev,
						success: (e) => {
							console.log(e);
							if(e.confirm && e.content != ''){
								this.name = e.content;
							}
						}
					})
				},
				gendertap(){
					uni.showActionSheet({
						itemList:['男','女'],
						success: (e) => {
							this.gender = e.tapIndex + 1;
						}
					})
				},
				agetap(e){
					this.age = e.detail.value + 1;
				},
				vxtap(){
					uni.showModal({
						confirmColor:'#fd458a',
						content:'绑定微信号',
						placeholderText:this.vxv,
						editable:true,
						success: (e) => {
							console.log(e);
							if(e.confirm && e.content != ''){
								this.vx = e.content;
							}
						}
					})
				},
				
				btns(){
					if(this.avatar != ''){
						uni.uploadFile({
							url:this.ip + 'upload.php',
							filePath:this.avatar,
							formData:{sign: this.$store.state.userinfo.token,type:'avatar'},
							name:'data',
							success:(data)=>{
								console.log('上传成功')
								console.log(data);
								uni.showLoading({
									title: '正在提交...',
									mask: true,
								});
								this.tijiao(JSON.parse(data.data).name);
							},
							fail:()=>{
								uni.hideLoading()
								uni.showToast({icon:'none',title:'头像上传失败！'});
							}
						})
					}else{
						uni.showLoading({
							title: '正在提交...',
							mask: true,
						});
						this.tijiao('');
					}
				},
				tijiao(icon){
					
					let sign = this.md5( this.$store.state.userinfo.token + 'updata');
					this.GetJson(this.ip + 'upuserdata.php','POST',{
						token: this.$store.state.userinfo.token,
						sign:sign,
						avatar:icon,
						name:this.name,
						gender:this.gender,
						age:this.age,
						vx:this.vx
					},e=>{
						uni.hideLoading();
						if(this.isdata(e)){
							this.$store.commit("userup",{avatar:icon,name:this.name,gender:this.gender,age:this.age,vx:this.vx});
							uni.showToast({
								title: '保存成功',
							});
							uni.navigateBack();
						}
					})
				}
				
			},
			watch:{
				baocunsi(newitem,old){
					if(newitem != old){
						const currentWebview = this.$scope.$getAppWebview();
						if(newitem){
							currentWebview.setStyle({titleNView:{buttons:[{text:"保存",fontSize:"14px",color:'#fd458a',onclick:this.btns}]}})
						}else{
							currentWebview.setStyle({titleNView:{buttons:[]}})
						}
						
					}
				}
			}
		}
	</script>

<style>
	page{
		background-color: #111111;
	}
	.avatarv{
		margin: 20rpx;
		border-radius: 20rpx;
		height: 374rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #111111;
	}
	.avatarv>image{
		width: 197rpx;
		height: 197rpx;
		border-radius: 100px;
		margin-bottom: 24rpx;
	}
	.avatarv>text{
		width: 176rpx;
		height: 58rpx;
		border-radius: 20rpx;
		border: 1rpx solid var(--maincolor);
		color: var(--maincolor);
		display: block;
		line-height: 58rpx;
		text-align: center;
		font-size: 24rpx;
	}
	.view{
		background-color: #111111;
		margin: 20rpx;
		border-radius: 20rpx;
	}
	.view>view{
		padding: 37rpx 34rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 25rpx;
		color: #555555;
		border-bottom: 1rpx solid #181818;
	}
	.view>view>text:nth-child(1){
		color: #555555;
		display: flex;
		flex: 1;
	}
	
</style>
