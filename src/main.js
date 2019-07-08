import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import store from './store'

import fastclick from 'fastclick'
import 'common/stylus/index.styl'
// 消除 click 移动浏览器300ms延迟

fastclick.attach(document.body)
Vue.config.productionTip = false
Vue.use(VueLazyLoad, {
	loading: require('common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
