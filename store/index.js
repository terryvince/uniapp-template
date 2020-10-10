import Vue from 'vue'
import Vuex from 'vuex'
import testModule from './testModule.js'
Vue.use(Vuex)

// const files =  require.context('@/store',true,'/\.js$/')
// files.keys().forEach(key=>{
// 	console.log(key)
// })
const systemInfo  = uni.getSystemInfoSync()  // ios 还是 andriod
let host = ''  // 宿主环境，web 小程序 app

// #ifdef H5
 host = 'web'
// #endif

// #ifdef MP
 host = 'mp'
// #endif

// #ifdef APP-PLUS
 host = 'app'
// #endif

const store = new Vuex.Store({
    state: {   // 全局状态
		test:'root',
		systemInfo,
		host
	},
	getters:{
		getRootTest(state){
			return state.test
		},
		systemInfo(state){
			return state.systemInfo
		},
		platform(state){
			return state.systemInfo.platform
		},
		host(state){
			return state.host
		}
	},
    mutations: {
		changeTest(state,payload){
			if(payload){
				state.test = payload
				return
			}
			state.test = 'changeTest'
		}
	},
    actions: {
		test({commit}){
			commit('test')
		}
	},
	modules:{   // 模块状态
		a: testModule
	}
})

export default store