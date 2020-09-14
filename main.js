import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import myPlugin from './vueOption/plugin.js'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(myPlugin)
Vue.prototype.$store = store
const app = new Vue({
    ...App,
	store
})
app.$mount()
