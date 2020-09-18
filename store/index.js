import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// const files =  require.context('@/store',true,'/\.js$/')
// files.keys().forEach(key=>{
// 	console.log(key)
// })

const store = new Vuex.Store({
    state: {
		test:''
	},
	getters:{
		test(state){
			return state.test
		}
	},
    mutations: {
		test(state){
			state.test = 'test'
		}
	},
    actions: {
		test({commit}){
			commit('test')
		}
	},
	modules:{
		
	}
})

export default store