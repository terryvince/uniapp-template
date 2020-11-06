const {setStorage,setStorageSync, getStorage, getStorageSync, getStorageInfo,getStorageInfoSync, removeStorage, clearStorage} = uni;
import {type} from '../utils/index.js'
import Print from '../utils/log.js'
const {log,error,warn}  = Print({
	prepend:'STORE',
	style:'warning'
})
/**
 * @param {Object} option  构造函数选项 =>
 *					@param {date} expireDefault 插入数据时如果未设置过期时间，则会读取(当前时间+expireDefault)的时间作为过期时间，默认是30天后过期
 * 					@param {string} scope 作用域，统一给存储的key增加私有前缀，防止h5同域名下，多站点存取冲突
 * 如果存储超出限制大小，会自动清除最旧的数据，直到能够存储为止
 * 
 * 属性：
 * _info {Object} 存储信息 => 
 * 					@param {string[]} keys -所有的存储key集合
 * 					@param {number} currentSize -当前存储的大小，单位kb
 * 					@param {number} limitSize -当前存储限制大小，单位kb
 * 方法：
 * get({key:'example'})					获取
 * set({key:'example',data:'example'})  设置
 * remove({key:'example'})				移除
 * clear()								清空
 */
function Store(option){
	log('存储初始化...')
	this._option = Object.assign({expireDefault: 30*24*60*60*1000, scope:'__store__'},option)
	this._info = {}
	if(this._option.expireDefault && typeof this._option.expireDefault != 'number'){
		throw new Error('STORE ERROR: 请传入正确的时间戳！')
	}
	Object.defineProperty(this,'_info',{
		get(){
			return getStorageInfoSync()
		}
	})
	// 设置一个动态默认过期时间属性，获取当前时间之后的30天
	Object.defineProperty(this._option,'expire',{
		get(){
			return +new Date() + this.option.expireDefault
		}
	})
	log('存储系统初始化成功！')
}

Store.prototype.get = async function({key,...rest}){
	if(!key){
		return ['store:请传入正确的key']
	}
	let [infoErr,info] = await getStorageInfo()
	error(infoErr)
	if(!info.keys.includes(key)){
		log(`数据【${key}】不存在`)
		return [`store:数据【${key}】不存在`]
	}
	if(!key.includes(this._option.scope)){
		key = this._option.scope + key
	}
	const [err,data] = await getStorage({
		key,
		...rest
		})
	if(err){
		error(err.errMsg)
		return [err.errMsg]
	}
	if(+new Date < data.expire){ // 未过期
		log(`正常获取数据【${key}】`)
		return [undefined,data.data]
	}
	// 数据过期就删除
	const [rmErr,rmMsg] = await this.remove({key})
	error(rmErr)
	log(`检测到数据【${key}】已过期，已自动删除`)
	return ['store:数据已过期']
}
Store.prototype.set = async function({key,data,expire,...rest}){
	const size = getLength(data)/1024 // 要存储的长度，kb
	const realData = {type:typeof data,data:{
		data,
		expire : +new Date(expire) || this._option.expire
	}}
	// 计算的实际存储的大小，包含了数据类型，过期时间，键名等在内的尺寸，更贴近真实存储尺寸
	const realSize = getLength(`${this._option.scope + key}=${JSON.stringify(realData)}`)/1024
	const [setErr, setInfo] = await setStorage({
			key: this._option.scope + key,
			data:{
				data,
				expire : +new Date(expire) || this._option.expire
			}
		})
	if(!setErr){ // 如果没有错误，即正常存储
		log(`正常存储数据:\n\t存储key：${key}\n\t数据大小：${size}kb\n\t存储大小：${realSize}kb(包含数据类型，过期时间，key在内的尺寸)\n\t存储值：`,data)
		return [undefined,setInfo]
	}
	log('检测到本地存储不足以存储数据【' + key +'】')
	// 如果有错误，代表达到限制尺寸了，需要清除缓存，再重试
	await clearOldCache.call(this,realSize)
	return this.set({key,data,expire,...rest})
}
Store.prototype.remove = async function({key,...rest}){
	if(!key.includes(this._option.scope)){
		key = this._option.scope + key
	}
	let [err,data] = await removeStorage({key,...rest})
	return [err,data]
}
Store.prototype.clear = function(...rest){
	return clearStorage(...rest)
}

// 清除旧的缓存，直到能够存储当前长度为止
async function clearOldCache(size){
	let [infoErr,data] = await getStorageInfo()
	error(infoErr)
	const {keys,currentSize,limitSize} = data
	let stores = []
	log('正在提取所有存储key...')
	for(let i=0;i< keys.length;i++){ // 取出所有键值，可能会瞬间内存升高，io读取频繁
		const k=keys[i]
		if(!k.includes(this._option.scope)){ // 如果不是本作用域的，跳过
			continue
		}
		const [err,v] = await getStorage({key:k})
		if(v ){ // 屏蔽掉无效数据
			stores.push({
				key: k,
				...v
			})
		}
	}
	log('提取完成，正在查找过旧数据...')
	// 根据时间排序
	stores.sort(function(a,b){
		return a.expire - b.expire   // 顺序，更快过期的排前面
	})
	log('过旧数据查找完毕，正在执行删除操作...')
	for(let i=0,v=stores[i];i< stores.length;i++){ // 从头删除
		await this.remove({key: v.key})
		log('已删除数据【' + v.key + '】')
		if(size + this._info.currentSize < limitSize){ // 能够存储的时候跳出循环，如果是h5，由于limitSize不准判断会失效，相当于删一条就set一次，其他端会有优化效果
			break;
		}
	}
}

// 计算字符串字节长度
export const getLength = function(str) {
		str = {
			object: JSON.stringify(str),
			null: 'null',
			undefined:'undefined',
			boolean: str&&str.toString(),
			number: str&&str.toString(),
			array: JSON.stringify(str)
		}[type(str)] || str.toString()
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128)
                realLength += 1;
            else
                realLength += 2;
        }
        return realLength;
}

const store = new Store()

export default store