<template>
	<view>
	<web-view :src="jxurl+src"></web-view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				jxurl:'',
				src: ''
			}
		},
		onLoad(item) {
			this.GetJson(this.ip + 'setapp.php','GET',{},e=>{
			this.jxurl = e.jxurl;
			})
			this.src = item.url;
		},
		onReady() {
			
		},
		methods: {
		}
	}
	
</script>

<style>
</style>
