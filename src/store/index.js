
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from "./actions.js"
import * as getters from "./getters.js"
import state from "./state.js"
import mutations from "./mutations.js"
import createLogger from 'vuex/dist/logger' // Vuex 自带一个日志插件用于一般的调试
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	actions,
	getters,
	state,
	mutations,
	plugins: debug ? [createLogger()] : []
})
