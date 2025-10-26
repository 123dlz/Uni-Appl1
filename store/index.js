import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		// #ifdef APP-PLUS
		Login: false,
		userinfo: null,
		//#endif
		erweima: null,
		stapp:null,
		account:null,//提现账户
		config:null,//全局配置
		msgnum:0,//消息未读角标
		vod:[],//已购买的影片
		vods:[],//已购买的影片
		jdianzan:[],
		record:[],
		follows:[],
		followss:[],
		recordss:[],
		dianzan:[],
	},
	mutations: {
		removuser(state){
			state.Login = false;
			state.userinfo = null;
			state.technician = null;
			state.coupon = null;
			state.account = null;
			uni.removeStorage({
				key:'ulogin'
			})
		},
		setuser(state, value) {
			state.Login = true;
			state.userinfo = value.userinfo;
			if (value.login != null) {
				uni.setStorage({
					key: 'ulogin',
					data: value.login
				})
				//#ifdef H5
				uni.setStorage({key:'userinfo',data:state.userinfo})
				// #endif
			}
			let sign = getApp().md5(state.userinfo.token); //获取用户配置
			getApp().GetJson(getApp().ip + 'userinfo.php', 'POST', {
				sign: sign,
				token: state.userinfo.token
			}, e => {
				if (e.code == 200) {
					state.account = e.account;//提现账户
					state.follow = e.follow;
					state.record = e.record;
					state.vip= e.vip;
					state.vipstart= e.vipstart;
					state.follows = e.follows;
					state.vod = e.vod;
					state.vods = e.vods;
					state.jupay = e.jupay;
					state.jufollow = e.jufollow;
					state.judianzan = e.judianzan;
					state.followss = e.followss;
					state.recordss = e.recordss;
					state.dianzan = e.dianzan;
					state.integral = e.integral;
					state.duanju_buy = e.duanju_buy;
					state.duanju_follow = e.duanju_follow;
					state.duanju_likes = e.duanju_likes;
				}
			})
			
		},
		userup(state, value) {
			if (value.avatar != '') state.userinfo.avatar = value.avatar;
			if (value.name != '') state.userinfo.name = value.name;
			if (value.gender != '') state.userinfo.gender = value.gender;
			if (value.age != '') state.userinfo.age = value.age;
			if (value.vx != '') state.userinfo.vx = value.vx;
		}
	}
})
export default store
