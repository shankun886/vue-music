//利用jsonp抓取推荐页相关数据
import jsonp from 'common/js/jsonp'
import {commonParams,opts} from './config.js'
import axios from 'axios'
//获取轮播图相关数据
export function getRecommend(){
	//推荐相关
	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
	//es6语法把值赋给这个对象
	const data = Object.assign({},commonParams,{
		platform: 'h5',
		uin: 0,
		needNewCode: 1
	}) 
	
	return jsonp(url,data,opts)
}
//获取歌单列表数据
export function getDiscList() {
	const url = '/api/getDiscList' 
	const data = Object.assign({},commonParams,{
		platform: 'yqq',
		hostUin: 0,
		sin: 0,
		ein: 29,
		sortId: 5,
		needNewCode: 0,
		categoryId: 10000000,
		rnd: Math.random(),
		format: 'json'
		//默认返回jsonp，这里要返回json
	})
	return axios.get(url,{
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
/**
 * jsonp 抓取推荐页歌单数据
 * 接口：https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg
 * 提供方：https://y.qq.com/n/yqq/playlist/1471714611.html#
 */
export function getSongList(disstid) {
  	let url = '/api/getSonglist'
  	let data = Object.assign({}, commonParams, {
    	disstid,
    	type: 1,
    	json: 1,
    	utf8: 1,
    	onlysong: 0,
    	platform: 'yqq',
    	hostUin: 0,
    	needNewCode: 0
  	})
  	return axios.get(url,{
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
