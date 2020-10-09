import qs from 'qs'
import Print from '../utils/log.js'
const {log,error,warn}  = Print({
	prepend:'ROUTER',
	style:'success'
})
/** Router
 * 属性：
 * _route 存当前路由，{path:'',fullPath:'',query:{}}
 * _pages 存储历史记录页面栈
 * 方法：
 * push 跳转，类似vue-router的push，但只有两个选项push(path || {path:'',query:{}})
 * repalce 替换当前页面栈，参数同push
 * back(?number) 后退，可传后退几层，默认后退一层
 * reLaunch 重启应用，参数同push
 * switchTab 切换选项卡，参数同push
 * beforeEach 路由前置钩子，目前无法拦截第一次进来的页面，由于第一次跳转并不是通过本类的方法跳转，无法监测
 * afterEach 路由后置钩子
 * */
function Router(option){
	log('路由初始化...')
	this._option = option || {}  // 目前只有tabs选项，用于判断是否是选项卡
	this._route = {path:'',fullPath:'',query:{}}
	this._pages = [];
	this._beforeHook = function(){}
	this._afterHook = function(){}
	
	if(!this._option.tabs){ // nvue环境下，不能读取pages.json的配置，构造函数必须设置tabs选项
		try{
			const pages = JSON.parse(PAGES_JSON.replace(/\/\*[\s\S]*\*\/|\/\/.*/g,'')) // 读取pages.json
			this._option.tabs = pages.tabBar ? pages.tabBar.list.map(page => ({path:page.pagePath})) : []
		} catch(err){
			warn('你没有在pages.json中设置tabs选项，也没有在构造函数中传递tabs选项，将无法智能识别选项卡push跳转')
		}
	}
	
	Object.defineProperty(this,'_route',{
			get(){
				return getRoute()
			},
			set(newValue){
				this._route = newValue
			}
		})
	Object.defineProperty(this,'_pages',{
			get(){
				return getPages()
			},
			set(newValue){
				this._pages = newValue
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
				  log('路由系统安装成功...')
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
	this._afterHook = ()=>{
		cb()
	}
}

const apiMap = {
	push:'navigateTo',
	replace:'redirectTo',
	back:'navigateBack',
	reLaunch:'reLaunch',
	switchTab:'switchTab'
}

Object.keys(apiMap).map(key=>{
	let api = apiMap[key]
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
				error(`路由回退失败`)
			})
		}
		return
	}
	Router.prototype[key] = async function jump(location){
		const params = parseParams(location)
		const to = parseRoute(location)
		const from = this._route
		const that = this
		let path = await this._beforeHook(to,from)   // 等待前置钩子执行完成
		let isTab = this._option.tabs.some(page=>page.path.includes(to.path))
		if( isTab && (key == 'push' || key == 'replace')){ // 如果是选项卡直接切换switchTab来跳转
			api = 'switchTab'
		}
		if(this._pages.length > 10){ // 小程序最大历史记录栈限制10
			warn('小程序的最大页面栈限制是10层，请注意清空页面栈。')
			return
		}
		if(!this._funCount)  // 指定时间重置一次调用频次记录
		{
			this._funCount = 0
			setTimeout(()=>{
				this._funCount = 0
			},500)
		}
		this._funCount++
		if(this._funCount>255){  // 如果500毫秒内跳转了255次以上，则判定为无限跳转
			throw new Error('\n ROUTER ERROR: 存在无限调用路由跳转，这可能是由于拦截器使用不当造成的。')
			return
		}
		if(path){ // next中含有路径跳转时
			jump.call(this,path)
			return
		}
		log(`即将导航到${to.path}，携带参数`,to.query)
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
			error(`路由${params.url}跳转失败`)
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

// 获取页面记录栈
export function getPages(){
	const pages = getCurrentPages().map(page=>({
		path: page.route,
		query: page.options,
		fullPath: Object.keys(page.options).length ? `${page.route}?${qs.stringify(page.options)}` : page.route
	}));
	return pages
}

export default Router