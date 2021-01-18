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
  if (typeof ob !== 'object') { // 非对象直接返回
    return ob
  }
  // let target = {}
  // const clone = function(ob){
	 //  for(let key in ob){
		// if(typeof ob[key] === 'object' && ob!= null){
		// 	target[key] = clone(ob[key])
		// }else{
		// 	target[key] = ob[key]
		// }
	 //  }
  // }
  // clone(ob)
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
	  throw new Error('utils.objectMap: 参数错误, 预期接受一个对象值')
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

/**
 * 深度合并，可以合并多个对象，包括嵌套属性对象，返回新对象
 * 合并规则：
 * 1.都是对象，则合并对象
 * 2.都是数组，则连接数组，调用concat
 * 3.函数或其他类型，后面的覆盖前面的
 * @param {object} ob1,ob2,...,obn
 */
export function merge(...args) {
  let target = {}
  args.forEach(ob=>{
	if(type(ob)!=='object'){
		 throw new Error('utils.merge: 参数错误，传入了非对象值!')
	}
  })
  function mergeObject(target,...args){
	 args.forEach(ob=>{
	 	  const keys = Object.keys(ob)
	 	  keys.forEach(k=>{
	 		  if(type(ob[k]) == 'object' && type(target[k]) == 'object'){  // 对象进行合并
	 			  mergeObject(target[k], ob[k])
	 		  }else if(type(ob[k]) == 'array' && type(target[k]) == 'array'){ // 数组则进行连接，不会覆盖
	 			  target[k] = target[k].concat( JSON.parse(JSON.stringify(ob[k])) )
	 		  }else{  // functin 或值类型直接覆盖
	 			  target[k] = ob[k]
	 		  }
	 	  })
	 }) 
  }
  mergeObject(target,...args)
  return target
}

/**
 * 对象树转数组树
 * @param {object} obj 原始树
 * @param {object} map 键值映射关系
 * @param {string} childrenKey 子节点key
 */
export function toArray(obj,map,childrenKey='children'){
  let copyArr = JSON.parse(JSON.stringify([obj]))
  let keys = Object.keys(map) // 取得映射key
  const mapFn = item=>{
    if(item[childrenKey] && item[childrenKey].length>0){
        item[childrenKey] = item[childrenKey].map(mapFn)
    }
    let tempOb = keys.reduce((pre,k)=>{
      pre[map[k]] = item[k]
      return pre
    },{})
    tempOb[childrenKey] = item[childrenKey] || []
    return tempOb
  }
  return copyArr.map(mapFn)
}

// 获取宿主环境
export function getHostEnv(){
	return {
			  versions:function(){
			    var u = navigator.userAgent, 
			      app = navigator.appVersion;
			    return {
			      trident: u.indexOf('Trident') > -1, //IE内核
			      presto: u.indexOf('Presto') > -1, //opera内核
			      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
			      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
			      iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
			      iPad: u.indexOf('iPad') > -1, //是否iPad
			      webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
			      weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
			      qq: u.match(/\sQQ/i) == " qq" //是否QQ
			    };
			  }(),
			  language:(navigator.browserLanguage || navigator.language).toLowerCase()
			}
}

//函数节流，第一次点击直接生效，在间隔时间内只生效一次点击
export function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

//函数防抖，immediate 是否立即生效
export function debounce(fn, wait, immediate) {
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait)
      if (callNow) {
        fn.apply(this, arguments)
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments)
      }, wait);
    }
  }
}

export function countdown(endDate){
  let curDate = new Date();
  let scope = endDate - curDate;
  if(scope<=0){
    return {
      day: 0, hour: 0, minute: 0, second: 0
    };
  }
  let day = ~~(scope/1000/60/60/24);
  let hour = ~~(scope / 1000 / 60 / 60 % 24);
  let minute = ~~(scope / 1000 / 60 % 60);
  let second = ~~(scope / 1000 % 60);
  hour = hour < 10 ? '0' + hour : hour;
  minute = minute<10 ? '0'+minute : minute;
  second = second < 10 ? '0' + second : second;
  return {
    day,hour,minute,second
  };
}

export const formatTime = (date,option) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  if(option=='date'){
    return [year, month, day].map(formatNumber).join('-');
  }
  if (option == 'time') {
    return [hour, minute].map(formatNumber).join(':');
  }
  if (/[Y,M,D,h,m,s]{2,}/.test(option)) {
    return option.replace(/YYYY/, year).replace(/MM/, month).replace(/DD/, day).replace(/hh/, hour).replace(/mm/, minute).replace(/ss/, second);
  }
  
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// scope	对应接口	描述
// scope.userInfo	wx.getUserInfo	用户信息
// scope.userLocation	wx.getLocation, wx.chooseLocation	地理位置
// scope.address	wx.chooseAddress	通讯地址
// scope.invoiceTitle	wx.chooseInvoiceTitle	发票抬头
// scope.invoice	wx.chooseInvoice	获取发票
// scope.werun	wx.getWeRunData	微信运动步数
// scope.record	wx.startRecord	录音功能
// scope.writePhotosAlbum	wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum	保存到相册
// scope.camera	camera 组件	摄像头

//检查授权,没有授权则引导授权（小程序专用）
// scope 检查的授权  tip  没有授权的提示信息
export function checkIsAuth(scope, tip) {
  return new Promise((resolve, reject) => {
    uni.authorize({        //未授权弹出授权窗口
      scope,
      success: function () {
        resolve();      //已授权 
      },
      fail: function () {            //拒绝授权弹出授权引导提示
        uni.showModal({
          content: tip,
          confirmText: '确认',
          cancelText: '取消',
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              uni.openSetting({
                success: function (res) {
                  // res.authSetting = {     用户授权结果
                  //   "scope.userInfo": true,
                  //   "scope.userLocation": true
                  // }
                  if (!res.authSetting[scope]) {
                    reject(scope + ':未授权！');
                    uni.navigateBack();
                    return;
                  }
                  resolve();    //已授权
                }
              })
            } else if (res.cancel) {
              reject(scope + ':未授权！');
              uni.navigateBack();
            }
          }
        })
      }
    })

  })
}

export default {
	type,
	deepFilter, // 递归过滤树
	removeRepeat, // 去重
	deepClone, // 深拷贝
	querySelector, // 选择器
	objectMap, // 对象key转换
	merge, // 对象合并
	getHostEnv, // 获取宿主环境
	throttle, // 节流
	debounce, // 防抖
	countdown, // 倒计时
	formatTime, // 格式化时间
	checkIsAuth, // 检查授权
}