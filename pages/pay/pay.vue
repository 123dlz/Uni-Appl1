<template>
	<view>
		<web-view :src="ip + 'pay_api/epayapi.php?order_id=' + order_id"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order_id:''
			}
		},
		computed:{
			
		},
		onLoad(e) {
			this.order_id = e.order_id
		},
		onShow(){
			
		},
		methods: {
			
		}
	}
</script>

<style>
	page{
		
	}
	
</style>
