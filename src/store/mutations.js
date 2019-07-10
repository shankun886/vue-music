//在这里对state做修改
import * as types from './mutation-types.js'

const mutations = {
	[types.SET_SINGER](state, singer) {
		state.singer = singer
	},
	[types.SET_PLAYING_STATE](state, flag) {//因为SET_PLAYING_STATE是布尔值，所以用flag
		state.playing = flag
	},
	[types.SET_FULL_SCREEN](state, flag) {
  		state.fullScreen = flag
	},
	[types.SET_PLAYLIST](state, list) {//数组
  		state.playlist = list
	},
	[types.SET_SEQUENCE_LIST](state, list) {
  		state.sequenceList = list
	},
	[types.SET_PLAY_MODE](state, mode) {
  		state.mode = mode
	},
	[types.SET_CURRENT_INDEX](state, index) {
  		state.currentIndex = index
	},
	[types.SET_SONGLIST](state, songlist) {
  		state.songlist = songlist
	},
	[types.SET_RANKLIST](state, rankList) {
  		state.rankList = rankList
	},
	[types.SET_SEARCHHISTORY](state, searchHistory) {
		
  		state.searchHistory = searchHistory
	},
	[types.SET_PLAYHISTORY](state, playHistory) {
  		state.playHistory = playHistory
	},
	[types.SET_FAVORITE_LIST](state, list) {
  		state.favoriteList = list
	},
	[types.SET_SEARCH_HISTORY](state, searchHistory) {
    	state.searchHistory = searchHistory
  	}
}

export default mutations