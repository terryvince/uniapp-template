export default {
	namespaced: true,
	state: () => ({
		test: 0
	}),
	actions: {
		testAction ({ state, commit, rootState },payload) {
			// 异步方法模拟
			setTimeout(()=>{
				commit('changeTest') // 改变模块局部状态
				commit('changeTest','来自模块a的状态改变',{root:true}) // 改变根状态
			},1000)
		}
	  },
	mutations:{
		changeTest(state,payload){
			state.test++
		}
	},
	getters:{
		getTest(state,getters,rootState,rootGetters){
			return state.test
		}
	}
}