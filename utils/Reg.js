export const regExp = {
	phone: /^1[345789]\d{9}$/, // 手机号验证
	idNumber: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, // 身份证验证
	phoneCode: /^\d{4}$/, // 4位数字验证码
	email:/^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/, // 邮箱
	chinese:/^[\u4e00-\u9fa5]$/, //中文
	chineseName: /^[\u4e00-\u9fa5]{2,}$/, //姓名，至少2位中文
	validString:/^[A-Za-z0-9_]+$/, // 只允许英文数字和下划线
	htmlTag:/<(\S*?)[^>]*>.*?<\/\1>|<.*? \/>/g, // 匹配所有html标签，
	qqNumber: /[1-9][0-9]{4,}/, // 匹配qq号
	wechatNumber: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/, // 微信号
	number:/^-?\d*\.?\d+$/, // 是不是数字
	carNumber: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/, // 车牌号
	ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, // 匹配ip v4地址
	notNull: /\S/, // 非空
	url: /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i // http http的域名匹配
}

/**
 * 正则验证
 * input 输入字符串
 */
export {
	// 手机号
	isPhone(input) {
		return regExp.phone.test(input)
	},
	// 身份证
	isIdNumer(input) {
		return regExp.idNumber.test(input)
	},
	// 4位验证码
	isPhoneCode(input) {
		return regExp.phoneCode.test(input)
	},
	// 微信号
	isWechatNumber(input) {
		return regExp.wechatNumber.test(input)
	},
	// 是不是数字
	isNumber(input){
		return regExp.number.test(input)
	},
	// 车牌号
	isCarNumber(input){
		return regExp.carNumber.test(input)
	}
	// 邮箱
	isEmail(input){
		return regExp.email.test(input)
	},
	// 中文
	isChinese(input){
		return regExp.chinese.test(input)
	},
	// 真实姓名
	isChineseName(input){
		return regExp.isChineseName.test(input)
	}
	// 合法字符，英文，数字和下划线
	isValidString(input){
		return regExp.validString.test(input)
	},
	// qq号
	isQQ(input){
		return regExp.qqNumber.test(input)
	},
	// ip地址
	isIp(input){
		return regExp.ip.test(input)
	},
	// 非空
	isNotNull(input){
		return regExp.notNull.test(input)
	},
	// 域名
	isUrl(input){
		return regExp.url.test(input)
	}
}
