import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import myPlugin from './vueOption/plugin.js'
import myRouter from './router/index.js'  // 不能叫router，h5端会和内置的vue-router命名冲突

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(myPlugin)

Vue.prototype.$store = store

const app = new Vue({
    ...App,
	myRouter,
	store
})
app.$mount()
