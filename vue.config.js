const webpack = require('webpack')

function readPages() {
    const path = require('path');
    const fs = require('fs');
    const pagesPath = path.join(__dirname, './pages.json')
    if (!fs.existsSync(pagesPath)) {
        throw new Error(pagesPath + ' 不存在!')
    }
    return fs.readFileSync(pagesPath, 'utf8')
}

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
	  configureWebpack: {
	          plugins: [
	              // new BundleAnalyzerPlugin(),
	              new webpack.DefinePlugin({  // 设置webpack全局变量，读取pages.json
	                  PAGES_JSON: JSON.stringify(readPages())
	              })
	          ]
	      }
	  // configureWebpack: (config) => {
	  //     config.module.rules.push({
	  //       test: /(\.scss)|(\.css)$/,
	  //       use: [{
	  //         loader: 'css-x2x-loader',
	  //         options: {
			// 	type: 'px2rpx',
			// 	tagUnit: 1, // 1px=1rpx
			// 	tagPrecision: 8 //精度,小数点
			//   }
	  //       }]
	  //     })
	  //   },
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
