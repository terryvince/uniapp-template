// await 错误捕获 返回 [err,data]
export default function to(promise) {
   return promise.then(data => {
      return [undefined, data];
   })
   .catch(err => [err]);
}