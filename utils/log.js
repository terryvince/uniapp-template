const colors = {
	primary:'color:#409EFF',
	success:'color:#67C23A',
	warning:'color:#E6A23C',
	danger:'color:#F56C6C',
	info:'color:#909399'
}

const log = function(...rest){
	if(process.env.NODE_ENV=='development'){
		if(this.option.prepend) rest.unshift(`${this.option.prepend} DEBUG:`)
		const style = colors[this.option.style] || this.option.style
		let styles = []
		// #ifdef APP-PLUS
			let args = rest.map(v=>{
				return typeof v == 'object' ? JSON.stringify(v,null,2) : v
			})
			console.log(...args)
		// #endif
		// #ifndef APP-PLUS
			let args = rest.map(v=>{
				if(typeof v === 'string'){
					styles.push(style)
					return '%c'+v+' '
				 }
				 styles.push(v)
				 return '%o '
			})
			args = [args.join(''),...styles]
			console.log(...args)
		// #endif
		
	}
}

const warn = function(...rest){
	console.warn(`${this.option.prepend} WARN:`,...rest)
}

const error = function(...rest){
	if(rest.length>0 && rest[0]){ // 存在错误消息再输出
		console.error(`${this.option.prepend} ERROR:`,...rest)
	}
}

export default function (option){ // 前置参数
	option = option || {
		prepend:'',
		style:'info'
	}
	const ctx = {option}
	return {
		log:log.bind(ctx),
		warn:warn.bind(ctx),
		error:error.bind(ctx)
	}
}