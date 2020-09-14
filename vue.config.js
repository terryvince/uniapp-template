// const transform = require('postcss-pxtransform')

module.exports = {
	// 自动导入全局,让后续所有vue文件不需要import就能使用
	css: {
	    loaderOptions: {
	      scss: {
	        prependData: `@import "~@/assets/css/variable.scss";`  // 改为自己路径
	      }
	    }
	  }
	// css: {
	// 	loaderOptions: {
	// 		postcss: {
	// 			plugins: [
	// 				transform({
	// 					platform: 'weapp', // px转rpx
	// 					designWidth: 375, // 设计稿基准750px
	// 				})
	// 			]
	// 		}
	// 	},
	// }
}
