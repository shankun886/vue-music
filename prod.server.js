// 测试 dist
// 利用 Express 起一个本地测试服务器

var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var app = express()

// axios 结合 node.js 代理后端请求
var apiRoutes = express.Router()
apiRoutes.get('/getDiscList',function(req, res){
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    //欺骗qq服务器，让其以为是其网站发出的请求
    //通过后端代理，定义一个路由，作用从真实的qq服务器地址通过axios发送一个http请求，把referer和host修改成qq相关的referer和host，
    //然后通过浏览器发送过来的请求参数req.query（即recommend.js中的params）透传给qq的服务端，qq服务端就可以正常的相应返回数据，响应的内容通
    //过res.json()输出到浏览器端
    //当不想让别人直接通过浏览器抓接口，可以简单设置referer和host，防止不了我们这种后端代理的方式。大公司通过参数验签
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/getSearch',function(req, res){
  var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/getRankList',function(req, res){
  var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    //欺骗qq服务器，让其以为是其网站发出的请求
    //通过后端代理，定义一个路由，作用从真实的qq服务器地址通过axios发送一个http请求，把referer和host修改成qq相关的referer和host，
    //然后通过浏览器发送过来的请求参数req.query（即recommend.js中的params）透传给qq的服务端，qq服务端就可以正常的相应返回数据，响应的内容通
    //过res.json()输出到浏览器端
    //当不想让别人直接通过浏览器抓接口，可以简单设置referer和host，防止不了我们这种后端代理的方式。大公司通过参数验签
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
apiRoutes.get('/getSonglist',function(req, res){
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    //欺骗qq服务器，让其以为是其网站发出的请求
    //通过后端代理，定义一个路由，作用从真实的qq服务器地址通过axios发送一个http请求，把referer和host修改成qq相关的referer和host，
    //然后通过浏览器发送过来的请求参数req.query（即recommend.js中的params）透传给qq的服务端，qq服务端就可以正常的相应返回数据，响应的内容通
    //过res.json()输出到浏览器端
    //当不想让别人直接通过浏览器抓接口，可以简单设置referer和host，防止不了我们这种后端代理的方式。大公司通过参数验签
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
apiRoutes.get('/getLyric',function(req, res){
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    //欺骗qq服务器，让其以为是其网站发出的请求
    //通过后端代理，定义一个路由，作用从真实的qq服务器地址通过axios发送一个http请求，把referer和host修改成qq相关的referer和host，
    //然后通过浏览器发送过来的请求参数req.query（即recommend.js中的params）透传给qq的服务端，qq服务端就可以正常的相应返回数据，响应的内容通
    //过res.json()输出到浏览器端
    //当不想让别人直接通过浏览器抓接口，可以简单设置referer和host，防止不了我们这种后端代理的方式。大公司通过参数验签
    params: req.query
  })
  .then((response) => {
    var result = response.data
    if (typeof result === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = result.match(reg)
      if (matches) {
        result = JSON.parse(matches[1])
      }
    }
    res.json(result)
  }).catch((e) => {
    console.log(e)
  })
})
app.use('/api', apiRoutes)

app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
