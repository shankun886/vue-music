//状态管理
//1.首先定义state，2.对getters做映射，可以根据state不同值计算一个新值
//3.要修改数据，定义mutations，先写mutation-types
//4.actions  异步修改或者对mutations做封装，通过调用1个actions来修改多个mutations的目的
const playMode = {
  sequence: 0, // 顺序播放
  loop: 1, // 单曲循环
  random: 2 // 随机播放
}

const state = {
	//歌手信息
	singer: {},
	// 播放器播放状态
	playing: false,
	// 播放器展开状态是否为全屏
	fullScreen: false,
	// 播放歌曲列表
	playlist: [],
	// 顺序播放列表
  	sequenceList: [],
	// 播放模式
	mode: playMode.sequence,
	// 当前播放歌曲索引
	currentIndex: -1,
	// 推荐页歌单
	songlist: {},
	// 歌曲排行数据
	rankList: {},
  	// 搜索结果
  	//searchHistory: getStorage(),
  	// 播放历史（最近播放）
  	//playHistory: getPlayStorage(),
  	// 我的收藏
  	//favoriteList: getFavorite()
}
export default state