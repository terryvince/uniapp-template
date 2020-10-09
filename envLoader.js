/* 注入环境变量
 * 有特定环境需求改NODE_ENV，默认不需要改，运行加载.env.dev.js的环境变量，发行加载.env.prod.js的环境变量
 * */

const NODE_ENV = ''; // test:测试环境 | pre:预发布环境 
const processNvue = {env:{},my_env:{}}

let GLOBAL_ENV = require('./.env.js')
let ENV_VAR = {
	development: {
		// test:require('./.env.test.js') // 需要拓展环境就在这里加
	}[NODE_ENV] || require('./.env.dev.js'),
	production: {
		// pre:require('./.env.pre.js')
	}[NODE_ENV] || require('./.env.prod.js')
}[process.env.NODE_ENV] || {}

// 导入环境变量  nvue 环境无法直接访问process, 但是可以访问process.env 和 process.env.NODE_ENV
// #ifndef APP-NVUE
process.my_env = Object.assign(process.env,ENV_VAR,GLOBAL_ENV)
// #endif

// 构造一个process对象出来，防止http模块报错
// #ifdef APP-NVUE
	processNvue.my_env = Object.assign(processNvue.env,{NODE_ENV:process.env.NODE_ENV},ENV_VAR,GLOBAL_ENV)
// #endif

// console.log('-------环境变量测试-------',process,process.env,process.env.NODE_ENV)

export default processNvue