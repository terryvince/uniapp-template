/** 
 * 注意事项：
 * 1.nvue环境下，vue原型上挂载的自定义模块都会失效，除了内置的vuex不用重新导入，其他自定义的模块，都需要重新导入
 * 2.libs/storage.js、to.js 已全局导入，无需手动import
 * 3.assets/css/variable.scss、mixin.scss 已全局导入，无需手动import
 */
import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import myPlugin from './vueOption/plugin.js'
import myRouter from './router/index.js'  // 不能叫router，h5端会和内置的vue-router命名冲突

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(myPlugin)

Vue.prototype.$store = store

const showToast = uni.showToast
uni.showToast = function(...rest){  // 解决loadding 和 Toast 同时使用时，hideLoading bug
	setTimeout(()=>{
		showToast(...rest)
	})
}

const app = new Vue({
    ...App,
	myRouter,
	store
})
app.$mount()
