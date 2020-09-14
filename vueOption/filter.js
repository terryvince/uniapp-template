import dayjs from 'dayjs'

// 保留几位小数
export const toFixed = (value, keepNumber=2) => {
	if(typeof value !== 'number'){
		return '非数字'
	}
	value = +value
	return value.toFixed(keepNumber)
}

/**
 * 时间格式化
 * @param {string||datetime} value - 时间戳或者字符串形式的日期
 * @param {string} option -格式化模式 ，默认YYYY-MM-DD HH:mm:ss
 */
export const timeFormat = (value, option) => {
	if(!dayjs(value).isValid()){
		return '非日期'
	}
	const mode = {
		'date':'YYYY-MM-DD',
		'time':'HH:mm:ss',
		'datetime':'YYYY-MM-DD HH:mm:ss'
	}[option] || 'YYYY-MM-DD HH:mm:ss'
	return dayjs(value).format(mode)
}

export default {
	timeFormat,
	toFixed
}