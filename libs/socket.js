import Print from '../utils/log.js'
const {log,error,warn}  = Print({
	prepend:'SOCKET',
	style:'color:#CC00FF'
})
// const {log,error,warn} = console;  // 脱离print运行

// socket类
function Socket(option){
	this._option = Object.assign({
		url:'',
		delay: 3000, // 3秒重连一次
		maxNumber: 3, // 最大尝试重连次数
		debug:false,
		timeout: 30*1000, // 30秒请求没有响应，则判定为超时，会从消息队列中删除
	},option);
	this._count = 0			// 尝试重连次数
	this._requestMap = {}  // 请求消息队列
	this._eventMap = {} 	  // 事件队列，即服务器主动给客户端推送触发的事件队列, {event:[function1(){},function2(){}]}
	this._isOpen = false
	this._timer = null // 重连计时器
	this.onOpen = function(){}	// 链接打开时执行的回调
	this.onMessage = function(){} // 收消息时
	this.onClose = function(){} // 链接关闭时
	this.onError = function(){}	// 链接发生错误时
	bindListener.call(this)  // 绑定事件
	if(this._option.debug) log('正在连接中...')
}

// 发送请求
Socket.prototype.request = function(url,data,callback){
	if(this._option.debug){
		log('发送数据 =>',data)
	}
	const msg = {url,data,time:+new Date()}
	if(!this._isOpen){ // 缓存消息队列，如果链接没有打开
		if(!this._requestMap[url]){
			this._requestMap[url] = []
		}
		this._requestMap[url].push({callback,...msg})  // 目前demo是以url作为键，实际使用应该产生一个唯一的消息id区分不同的消息
		return
	}
	this._socket.send(JSON.stringify(msg))
}
// 监听服务端主动推送的事件
Socket.prototype.on = function(event,callback){
	if(!this._eventMap[event])
	{
		this._eventMap[event] = []
	}
	this._eventMap[event].push(callback) // 加入事件队列
}
// 关闭链接
Socket.prototype.close = function(){
	this._socket.close()
}
// 重连
Socket.prototype.restart = function(){
	if(this._option.debug){
		log('正在尝试重连中...')
	}
	this._socket.close()
	bindListener.call(this)
}

function bindListener(){
	const so = getWebSocket(this._option.url)
	const events = so.event
	const platform = so.platform
	this._socket = so.instance  // websocet 实例
	const onOpen = ()=>{
		if(this._option.debug){
			log('通道已建立!')
		}
		this._isOpen = true
		this._count = 0  // 连接成功后，下次重连重新计数
		const keys = Object.keys(this._requestMap)
		if(keys.length>0){ // 如果队列里有未发出的请求
			// 发请求
			keys.forEach(k=>{
				const msg = this._requestMap[k]
				this.request(msg.url,msg.data,msg.callback)
			})
		}
		this.onOpen()
	}
	const onMessage = (e) => {
		const data = JSON.parse(e.data)
		if(this._option.debug){
			log('接收到消息 =>',JSON.stringify(data,null,4))
		}
		this.onMessage(data)  // 原始消息
	}
	const onClose = () => {
		if(this._option.debug){
			log('通道已关闭!')
		}
		this._isOpen = false
		this.onClose()
	}
	const onError = (e) => {
		if(this._option.debug){
			error(`websocket链接发生错误,将在${this._option.delay/1000}秒后重连...`)
		}
		this.isOpen = false
		if(this._count == this._option.maxNumber){  // 重连尝试用尽
			log('达到最大重连次数!')
			clearTimeout(this._timer)
			return
		}
		this._timer = setTimeout(()=>{  // 发生错误的时候重连
			if(this._isOpen){  // 链接成功
				clearInterval(this._timer)
				return
			}
			this.restart()   // 重连
			this._count++
		},this._option.delay)
		
		this.onError(e)
	}
	// 内部使用
	const listeners = {onOpen,onMessage,onClose,onError}
	Object.keys(events).map(k=>{
		const key = events[k];
		if(platform == 'uni'){
			this._socket[key](listeners[key])
		}
		if(platform == 'web'){
			this._socket[key] = listeners[k]
		}
	})
}

const getGlobal = function () { 
  if (typeof self !== 'undefined') { return self; } 
  if (typeof window !== 'undefined') { return window; } 
  if (typeof global !== 'undefined') { return global; } 
  return {} 
};
// 判断某个全局对象是否存在
const isDef = (k)=>{
	return typeof getGlobal()[k] !== 'undefined'
}
// 获取websocket对象，兼容h5
function getWebSocket(url){
	const hasWebSocket = isDef('WebSocket');
	// uni 平台
	if(!hasWebSocket){
		return {
			event:{
				onOpen:'onOpen',
				onMessage:'onMessage',
				onClose:'onClose',
				onError:'onError'
				
			},
			platform: 'uni',
			instance: uni.connectSocket({
				url,
				complete: ()=> {}
			})
		}
	}
	// h5平台
	return {
			event:{
				onOpen:'onopen',
				onMessage:'onmessage',
				onClose:'onclose',
				onError:'onerror'
			},
			platform: 'web',
			instance: hasWebSocket && new WebSocket(url)
		};
}

export default Socket