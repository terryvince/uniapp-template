// const transform = require('postcss-pxtransform')

module.exports = {
	// 自动导入全局,让后续所有vue文件不需要import就能使用
	css: {
	    loaderOptions: {
	      scss: {
			// 全局导入
	        prependData: `
						@import "~@/assets/css/variable.scss";
						@import "~@/assets/css/mixin.scss";
						`
	      }
	    }
	  },
	  configureWebpack: (config) => {
	      config.module.rules.push({
	        test: /(\.scss)|(\.css)$/,
	        use: [{
	          loader: 'css-x2x-loader',
	          options: {
				type: 'px2rpx',
				tagUnit: 75,
				tagPrecision: 8
			  }
	        }]
	      })
	    },
		// chainWebpack: config => {
		//         const oneOfsMap = config.module.rule('scss').oneOfs.store
		//         oneOfsMap.forEach(item => {
		//             item
		//                 .use('css-x2x-loader')
		//                 .loader('css-x2x-loader')
		//                 .options({
		//                     type: 'px2rpx',
		//                     tagUnit: 75,
		//                     tagPrecision: 8
		//                 })
		//                 .end()
		//         })
		//     }
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
