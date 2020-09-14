/* 公共的api */

/**
 * 文件上传
 * @param {string} url - 接口地址
 * @param {object} formData - 上传的数据
 * @param {string} fileName - 自定义上传文件的name，要和formData里的临时文件path的key相对应，默认取file
 */
const uploadFile = (url,formData,fileName) => {
	const fileKey=fileName||'file'
	const filePath = formData[fileKey]
	delete formData[fileKey]
	return uni.uploadFile({
            url,
            filePath,
            name: fileKey, // 默认file，如果不指定fileName
            formData
        });
}

export {
	uploadFile //文件上传
}