const {setStorage, getStorage, getStorageInfo, removeStorage, clearStorage} = uni;
import {type} from '../utils/index.js'

function error(...rest){
	if(rest.length>0 && rest[0] != undefined){
		throw new Error(...rest)
	}
}

/**
 * @param {Object} option =>
 *					@param {date} expire 数据过期时间，会在get的时候检查，过期会被删除, 默认30天后过期
 * 					@param {string} scope 作用域，统一给存储的key增加私有前缀，防止h5同域名下，多站点存取冲突
 * 如果存储超出限制大小，会自动清除过期的数据或者最旧的数据，直到能够存储为止
 */
function Store(option){
	this._option = option || {expire: +new Date() + (30*24*60*60*1000),scope:'__store__'}
}

Store.prototype.get = async function({key,...rest}){
	const [err,data] = await to(getStorage({key,...rest}))
	error(err)
	if(!data){ // 没取到值，默认undefind
		return undefined
	}
	if(+new Date < data.expire){ // 未过期
		return data.data
	}
	// 数据过期就删除
	await this.remove({key})
	return undefined
}
Store.prototype.set = async function({key,data,expire,...rest}){
	let [infoErr,info] = await to(getStorageInfo())
	error(infoErr)
	const {keys,currentSize,limitSize} = info
	const size = getLength(data)*1024 // 要存储的长度，kb
	console.log(size + currentSize < limitSize);
	if( size + currentSize < limitSize ){ // 小于最大限制尺寸，就允许存储
		return setStorage({
			key: this._option.scope + key,
			data:{
				data: data,
				expire : +new Date(expire) || this._option.expire
			}
		})
	}
	await clearOldCache.call(this,size,info)
	return this.set({key,data,expire,...rest})
}
Store.prototype.remove = function(...rest){
	return removeStorage(...rest)
}
Store.prototype.clear = function(...rest){
	return clearStorage(...rest)
}

// 清除旧的缓存，直到能够存储当前长度为止
async function clearOldCache(size,data){
	const {keys,currentSize,limitSize} = data
	let stores = []
	for(let i=0,k=keys[i];i< keys.length;i++){ // 取出所有键值，可能会瞬间内存升高，io读取频繁
		const [err,v] = await this.get({k})
		if(v){ // 屏蔽掉无效数据
			stores.push({
				key: k,
				...v
			})
		}
	}
	// 根据时间排序
	stores.sort(function(a,b){
		return b.expire-a.expire
	})
	for(let i=0,v=stores[i];i< stores.length;i++){ // 从头删除
		if(v.key.includes(this._option.scope)){   // 只删除作用域下的key
			await this.remove({
				key: v.key
			})
		}
		if(size + currentSize < limitSize){ // 能够存储的时候跳出循环
			break;
		}
	}
}

// 计算字符串字节长度
export const getLength = function(str) {
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