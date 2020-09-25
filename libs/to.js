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