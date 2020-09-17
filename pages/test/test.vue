<template>
	<view>
		this is  test page
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		created(){
			console.log(this.$$router,this.$$route)
		}
	}
</script>

<style lang="scss">

</style>
