import http from '@/libs/http.js'

// 测试接口
const test = (data) => {
	return http.request('test',data,{
		method:'get',
		// headers:{
		// 		"content-type":"application/x-www-form-urlencoded",
		// },
		}
	)
}

export {
	test
}