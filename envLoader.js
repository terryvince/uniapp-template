/* 注入环境变量
 * 有特定环境需求改NODE_ENV，默认不需要改，运行加载.env.dev.js的环境变量，发行加载.env.prod.js的环境变量
 * */
(function() {
    const NODE_ENV = ''; // test:测试环境 | pre:预发布环境 
	
	let GLOBAL_ENV = require('./.env.js')
    let ENV_VAR = {
		development: {
			// test:require('./.env.test.js') // 需要拓展环境就在这里加
		}[NODE_ENV] || require('./.env.dev.js'),
		production: {
			// pre:require('./.env.pre.js')
		}[NODE_ENV] || require('./.env.prod.js')
	}[process.env.NODE_ENV] || {}
	// 导入环境变量
	process.my_env = Object.assign(ENV_VAR,GLOBAL_ENV)
})()