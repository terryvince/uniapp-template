/**
 * 类型检测
 * @param {any} value -检测值
 * @return {string} -返回小写的类型字符串
 */
export function type(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

/**
 * 深度过滤(递归过滤数组)
 * @param {object[]} list -原始数组
 * @param {string} childrenKey -子数组key
 * @param {function} filterFn -回调函数，filterFn(item),item为遍历的数组及其子数组的每一项，根据filterFn的返回值过滤数组，true 保留， false 移除
 * @param {boolean} isKeepParent -是否保留父项，如果子级符合筛选条件,true 保留，false 不保留
 * @requires list,childrenKey,filterFn
 * @return any[]
 * @tutorial deepFilter(arr,'children',v=>v.sex==1)
 */
export function deepFilter(list, childrenKey, filterFn, isKeepParent = false) {
  if (type(list) !== 'array') {
    throw new Error('utils.deepFilter: 参数错误，传入了一个非数组值')
  }
  if (!list || !childrenKey || !filterFn) {
    throw new Error('utils.deepFilter: 缺乏参数，请检查所传参数')
  }
  if (typeof filterFn !== 'function') {
    throw new Error('utils.deepFilter: 参数错误，未传入回调函数')
  }
  const filterItem = (item) => {
    if (item[childrenKey] && item[childrenKey].length > 0) {
      item[childrenKey] = item[childrenKey].filter(filterItem)
      if (isKeepParent && item[childrenKey].length > 0) { // 如果子级符合条件则保留父项
        return true
      }
    }
    return filterFn(item)
  }
  return list.filter(filterItem)
}

/**
 * 数组去重(适用数值数组，以及对象数组)
 * @param {array} list -原数组，必传
 * @param {string[]} keys -条件key,数值数组可不传，对象数组不传默认根据id去重，如['id'],根据id去重
 * @param {string[]} isAllEqual -true，满足keys的所有条件相等，则判定为重复项 false， 只要满足keys其中一个条件相等，则判定为重复项
 * @requires list
 * @tutorial removeRepeat([1,2,1,2]) or removeRepeat([{id:1},{id:2},{id:1}])
 */
export function removeRepeat(list = [], keys = ['id'], isAllEqual = true) {
  if (type(list) !== 'array') {
    throw new Error('utils.removeRepeat: 参数错误，传入了一个非数组值')
  }
  if (list.length < 2) {
    return list
  }
  if (typeof list[0] === 'object') { // 数组对象去重
    return list.reduce((pre, cur, i, arr) => {
      if (isAllEqual) {
        pre.every(v => keys.some(key => v[key] !== cur[key])) && pre.push(cur)
      } else {
        pre.every(v => keys.every(key => v[key] !== cur[key])) && pre.push(cur)
      }
      return pre
    }, [])
  }
  return [...new Set(list)] // 单值去重
}

/**
 * 深拷贝(不适用正则或函数以及es6新类型)
 * @param {object} ob -原对象
 */
export function deepClone(ob) {
  if (typeof ob !== 'object') {
    throw new Error('utils.deepClone: 参数错误，传入了一个非对象值')
  }
  return JSON.parse(JSON.stringify(ob))
}

/** 获取节点信息, uni专用
 * @param selector {string} -选择器
 * @example objectMap({a:1,b:2,c:3},{b:'映射b'}) => {a:1,b:2,映射b:2,c:3}
 * @return {object}
 */
export const querySelector = (selector) => new Promise((resolve, reject) => {
	const query = uni.createSelectorQuery();
	query.select(selector).boundingClientRect(data => {
		resolve(data)
	}).exec();
})

/** 转换对象的key
 * @param origin {object} -原始对象
 * @param map {object} -映射关系对象 {oldKey:newKey}
 * @param isKeepOldKey {boolean} -是否保留原有的key和值,默认保留原有的key
 * @example objectMap({a:1,b:2,c:3},{b:'映射b'}) => {a:1,b:2,映射b:2,c:3}
 * @return {object}
 */
export const objectMap = (origin, map, isKeepOldKey = true) => {
	if (type(origin) !== 'object' || type(map) !== 'object') {
	  throw new Error('utils.objectMap: 参数错误')
	}
	let target = JSON.parse(JSON.stringify(origin))
	let keys = Object.keys(target);
	keys.map(key => {
		let newKey = map[key]
		if (map[key]) {
			target[newKey] = target[key]
		}
		if (!isKeepOldKey) { // 没有指定关系映射key将默认保留
			delete target[key]
		}
	})
	return target
}

export default {
	type,
	deepFilter,
	removeRepeat,
	deepClone,
	querySelector,
	objectMap
}