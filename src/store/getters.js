//对states做一些映射，从这里取数据到组件中

export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
	return state.playlist[state.currentIndex] || {}
}
export const songlist = state => state.songlist

export const rankList = state => state.rankList

export const searchHistory = state => state.searchHistory

export const playHistory = state => state.playHistory