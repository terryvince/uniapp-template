export default {
	state: () => ({
		test: 0
	}),
	actions: {
		testAction ({ state, commit, rootState }) {
		  if ((state.test + rootState.test) % 2 === 1) {
			commit('changeTest')
		  }
		}
	  },
	mutations:{
		changeTest(state){
			state.test++
		}
	},
	getters:{
		getTest(state,getters,rootState){
			return state.test
		}
	}
}