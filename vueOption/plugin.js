import filters from './filter.js'
import mixin from './mixin.js'
import http from '@/libs/http.js'
import hxNavbar from "@/components/hx-navbar/hx-navbar"
// 自定义插件注入全局属性或方法
export default {
	install(Vue,options){
		// 1. 添加全局方法或 property
		  // Vue.myGlobalMethod = function () {
		  //   // 逻辑...
		  // }
		
		  // 2. 添加全局资源
		  // Vue.directive('my-directive', {
		  //   bind (el, binding, vnode, oldVnode) {
		  //     // 逻辑...
		  //   }
		  //   ...
		  // })
		  // 注册自定义导航栏
		  Vue.component('hx-navbar',hxNavbar)
		  
		  // 批量注入过滤器
		  for(let key in filters){
			  Vue.filter(key,filters[key])
		  }
		
		  // 注入混合器
		  Vue.mixin(mixin)
		
		  // 全局添加的方法
		  Vue.prototype.$http = http //http实例
	}
}