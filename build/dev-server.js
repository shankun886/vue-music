require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var axios = require('axios')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
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
app.use('/api',apiRoutes)
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
