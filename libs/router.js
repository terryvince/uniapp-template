import qs from 'qs'
/** Router
 * 属性：
 * _route 存当前路由，{path:'',fullPath:'',query:{}}
 * 方法：
 * push 跳转，类似vue-router的push，但只有两个参数push(path || {path:'',query:{}})
 * repalce 替换当前页面栈，参数同push
 * back(?number) 后退，可传后退几层，默认后退一层
 * reLaunch 重启应用，参数同push
 * switchTab 切换选项卡，参数同push
 * beforeEach 路由前置钩子
 * afterEach 路由后置钩子
 * */
function Router(option){
	this._option = option || {}  // 暂时没用到，先保留起选项
	this._route = {path:'',fullPath:'',query:{}}
	this._beforeHook = function(){}
	this._afterHook = function(){}
	
	Object.defineProperty(this,'_route',{
			get(){
				return getRoute()
			},
			set(newValue){
				this._route = newValue
			}
		})
}
export let _Vue
Router.install = function(Vue,option){
	 if (Router.install.installed && _Vue === Vue) return
	  Router.install.installed = true
	  _Vue = Vue
	  
	  Vue.mixin({
		  beforeCreate(){
			  if(this.$options.myRouter){
				  Vue.prototype.$$router = this.$options.myRouter
				  Vue.prototype.$$route = this.$options.myRouter._route
			  }	
		  }
	  })
}

Router.prototype.beforeEach = function(cb){
	this._beforeHook = (to,from) => {
		return new Promise((resolve)=>{
			cb(to,from,resolve)
		})
	}
}

Router.prototype.afterEach = function(cb){
	this._afterHook = cb
}

const apiMap = {
	push:'navigateTo',
	replace:'redirectTo',
	reLaunch:'reLaunch',
	switchTab:'switchTab',
	back:'navigateBack'
}

Object.keys(apiMap).map(key=>{
	const api = apiMap[key]
	if(key == 'back'){
		Router.prototype.back = async function(number=1){
			return new Promise((resolve,reject)=>{
				uni[api]({
					delta:number,
					success(){
						resolve('msg:ok')
					},
					fail(){
						reject('msg:fail')
					}
				})
			}).catch(err=>{
				console.error(`路由回退失败`)
			})
		}
		return
	}
	Router.prototype[key] = async function(location){
		const params = parseParams(location)
		const to = parseRoute(location)
		const from = this._route
		const that = this
		let path = await this._beforeHook(to,from)   // 等待前置钩子执行完成
		if(path){
			this.push(path)
			return
		}
		return new Promise((resolve,reject)=>{
			uni[api]({
				...params,
				success(){
					that._afterHook(to,from)  // 后置钩子执行
					resolve('msg:ok')
				},
				fail(){
					reject('msg:fail')
				}
			})
		}).catch(err=>{
			console.error(`路由${params.url}跳转失败`)
		})
	}
})

// 转换路由参数
function parseParams(params){
	if(typeof params == 'string'){
		return {
			url: params
		}
	}
	let { path, query } = params;
	if(query){
		path = `${ path }?${ qs.stringify(query) }`
	}
	return {
		url: path,
	}
}
// 解析路由参数
function parseRoute(location){
	let path = typeof location == 'string' ? location : location.path
	const params = path.split('?')
	let route = path.includes('?') ? {
		path : params[0],
		query: qs.parse(params[1])
	} : {
		path,
		query:{}
	}
	if(location.query) Object.assign(route.query,location.query)
	return route
}

// 获取当前路由
export function getRoute(){
	const pages = getCurrentPages();
	const page = pages[pages.length - 1];
	return page ? {       // 防止vue挂载初始化的时候报错
		path: page.route,
		query: page.options,
		fullPath: Object.keys(page.options).length ? `${page.route}?${qs.stringify(page.options)}` : page.route
	}: {}
}

export default Router