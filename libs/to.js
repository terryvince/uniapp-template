// 该函数已全局挂载，无需导入既可调用，nvue环境需手动导入
// await 错误捕获 返回 [err,data]
export default function to(promise) {
   return new Promise((resolve)=>{
	   promise.then(data => {
	      resolve([undefined, data]);
	   })
	   .catch(err => {
		   resolve([err])
	   })
   });
}