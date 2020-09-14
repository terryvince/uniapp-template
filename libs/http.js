import qs from 'qs'
let Fly = null
// #ifdef H5
	Fly = require("flyio/dist/npm/fly")
// #endif

// #ifdef APP-NVUE
	Fly = require("flyio/dist/npm/weex")
// #endif

// #ifdef APP-VUE || MP
	Fly = require("flyio/dist/npm/wx")
// #endif

// #ifdef MP-ALIPAY
	Fly = require("flyio/dist/npm/ap") 
// #endif

const fly = new Fly

//定义公共headers
// fly.config.headers={xx:5,bb:6,dd:7}
//设置超时
fly.config.timeout=60*1000;
//设置请求基地址
fly.config.baseURL= process.my_env.STRAY_BASE_API
// 跨域时发送cookie
fly.config.withCredentials = true
//设置公共的Get参数
// fly.config.params={"token":"testtoken"};


//添加请求拦截器
// {
//   baseURL,  //请求的基地址
//   body, //请求的参数
//   headers, //自定义的请求头
//   method, // 请求方法
//   timeout, //本次请求的超时时间
//   url, // 本次请求的地址
//   params, //url get参数(post请求或默认的get参数)    
//   withCredentials, //跨域请求是否发送第三方cookie
//   ... //options中自定义的属性
// }
fly.interceptors.request.use((request)=>{
    //给所有请求添加自定义header
    request.headers["X-Tag"]="flyio";
	if(request.headers['Content-Type'].includes('x-www-form-urlencoded')){
		request.params = qs.stringify(request.params)
	}
	//终止请求
	//var err=new Error("xxx")
	//err.request=request
	//return Promise.reject(new Error(""))
  	//打印出请求体
  	console.log(request.body)
    return request;
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
// response{
//   data, //服务器返回的数据
//   engine, //请求使用的http engine(见下面文档),浏览器中为本次请求的XMLHttpRequest对象
//   headers, //响应头信息
//   request  //本次响应对应的请求信息，即上面的request结构
// }
fly.interceptors.response.use(
    (response) => {
		console.log('http engine:',response.engine)
        //只将请求结果的data字段返回
        return response.data
    },
    (err) => {
        //发生网络错误后会走到这里
		if(process.env.NODE_ENV=='development'){
			const msg = typeof err == 'string' ? err : err.message
			uni.showModal({
				showCancel:false,
				title:'错误',
				content: msg
			})
		}
		console.error(`请求接口${err.request.url}出错：`,err)
        return Promise.reject(err)
    }
)

export default fly