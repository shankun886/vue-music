//抓了多个qq接口的数据，发现有些相同的参数是固定不变，为了简便，在这里配置这些参数
export const commonParams = {
	g_tk: 1479892412,
	inCharset: 'utf-8',
	outCharset: 'utf-8',
	notice: 0,
	format: 'json'
}
export const opts = {
	  param: 'jsonpCallback'
	}


//Response中的code，一般大公司都会设置正确的值为0
export const ERR_OK = 0