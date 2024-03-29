import jsonp from 'common/js/jsonp'
import {commonParams,opts} from './config.js'
/**
 * jsonp 抓取排行页数据 接口已换axios
 * 接口（pc端）：https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_opt.fcg
 * 接口（移动端）：https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg
 * 提供方：https://y.qq.com/n/yqq/toplist/4.html
 */
import axios from 'axios'
export function getRankList() {
  let url = '/api/getRankList'
  let data = Object.assign({}, commonParams, {
    uin: 0,
    format: 'json',
    needNewCode: 1,
    _: 1561537595849,
    platform: 'h5'
  })
  return axios.get(url,{
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
/**
 * jsonp 抓取排行详情页数据
 * 接口：https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg
 * 提供方：https://y.qq.com/w/toplist.html?ADTAG=myqq&from=myqq&channel=10007100&id=4&type=top
 */
export function getRankDetail(topid) {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  let data = Object.assign({}, commonParams, {
    hostUin: 0,
    platform: 'h5',
    needNewCode: 1,
    order: 'listen',
    begin: 0,
    uin: 0,
    num: 100,
    songstatus: 1,
    format: 'json',
    type: 'top',
    tpl: 3,
    page: 'detail',
    topid
  })
  return jsonp(url, data, opts)
}
