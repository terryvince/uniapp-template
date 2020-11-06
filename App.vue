<script>
	require('./envLoader.js');
	export default {
		globalData:{
			
		},
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS 
			const _self = this;
			
			plus.navigator.closeSplashscreen();  // 手动关闭启动页，mainfest中配置，这样可以自定义什么时候关闭启动页，屏蔽掉多次跳转的不良体验
			
			const _handlePush = function(message) {
				plus.nativeUI.toast('push sucess');  
				console.log(message)
				// 处理推送消息 message.payload 为传的参数，可是字符串，可以是对象
				if(typeof message.payload == 'string'){
					return
				}
				if(message.payload.pagePath){
					_self.$router.push(message.payload.pagePath)
				}
			};  
			plus.push.addEventListener('click', _handlePush);  
			plus.push.addEventListener('receive', _handlePush);
			// #endif
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
