import originJSONP from 'jsonp'

//data是url后的参数，使用时希望url是个纯净的地址，所有的query都是通过data拼到url上，option对应引入jsonp接口中的option
export default function jsonp(url,data,option) {
	url += (url.indexOf('?') < 0 ? '?' : '&')+param(data)
	return new Promise((resolve, reject) => {
		//callback回调函数
		originJSONP(url,option, (err,data) =>{
			if (!err) {
				resolve(data)
			} else{
				reject(err)
			}
		})
	}) 
}

//data拼到url上
function param(data){
	let url = ''
	for (var k in data) {
		//有时候data[k]为undefined，我们不能传undefined给后端，直接传空
		let value = data[k] !== undefined ? data[k] : ''
		//拼接参数$k=value   ${}取值
		url += `&${k}=${encodeURIComponent(value)}`
	}
	//如果url有data的话，其本身自带&，就得把后面拼接的&去掉
	return url ? url.substring(1) : ''
}