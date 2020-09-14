<script>
	require('./envLoader.js')
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		onError(err){
			console.error('app发生错误：', err)
		}
	}
</script>

<style lang="scss">
	@import './assets/css/style';
	/*每个页面公共css */
</style>
