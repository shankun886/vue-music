/*歌手api*/
import jsonp from 'common/js/jsonp'
import {commonParams,opts} from './config.js'

export function getSingerList() {
  let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  let data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    g_tk: 1576475597,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, opts)
}

export function getSingerDetail(singermid) {
  /*https://u.y.qq.com/cgi-bin/musicu.fcg*/
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  let data = Object.assign({}, commonParams, {
    g_tk: 1576475597,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
    singermid: singermid
  })
  return jsonp(url, data, opts)
}