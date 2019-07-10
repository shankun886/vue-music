//异步修改或者对mutations做封装
import * as types from './mutation-types.js'
import {shuffle} from '@/common/js/util.js'
import { localSave, localDel, localClear, savePlay, saveFavorite, delFavorite } from '@/common/js/cache.js'
//music-list里点击选择音乐提交修改多个mutations（ 顺序播放列表，播放歌曲列表，当前索引，是否播放，播放是否全屏）

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
// 选择歌曲播放
export const selectPlay = function ({commit, state}, {list, index}) {
	commit(types.SET_SEQUENCE_LIST, list)
	if (state.mode===2) {
		let randomList = shuffle(list)
		commit(types.SET_PLAYLIST, randomList)
		index = findIndex(randomList, list[index])
	}else{
		commit(types.SET_PLAYLIST, list)
	}
	
  	commit(types.SET_CURRENT_INDEX, index)
  	commit(types.SET_PLAYING_STATE, true)
  	commit(types.SET_FULL_SCREEN, true)
}
// 随机播放全部按钮
export const randomPlay = function ({commit}, {list}) {
	commit(types.SET_PLAY_MODE, 2)
	commit(types.SET_SEQUENCE_LIST, list)
	commit(types.SET_PLAYLIST, shuffle(list))
	commit(types.SET_CURRENT_INDEX, 0)
  	commit(types.SET_PLAYING_STATE, true)
  	commit(types.SET_FULL_SCREEN, true)	
}

// 新增歌曲到播放列表
export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  // 记录当前歌曲
  let currentSong = playlist[currentIndex]

  // 查询待添加的歌曲是否已在播放列表中
  let fpIndex = findIndex(playlist, song)

  // 插入到当前索引
  currentIndex++
  playlist.splice(
  	currentIndex, 0, song)

  // 如果待添加的歌曲已在播放列表中，删除原有歌曲
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  // 插入到 sequenceList 中的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  // 查询待添加的歌曲是否已在 sequenceList 列表中
  let fsIndex = findIndex(sequenceList, song)

  // 插入到当前索引
  sequenceList.splice(currentSIndex, 0, song)

  // 如果待添加的歌曲已在播放列表中，删除原有歌曲
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

/**
 * 保存搜索历史
 * @param  {[type]} query          搜索关键词
 */
export const saveHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, localSave(query))
}

/**
 * 删除单个搜索历史
 * @param  {[type]} query          搜索关键词
 */
export const delHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, localDel(query))
}

/**
 * 删除全部搜索历史
 * @param  {[type]} query          搜索关键词
 */
export const clearHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, localClear())
}