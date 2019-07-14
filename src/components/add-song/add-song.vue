<template>
	<transition name="slide">
		<div class="add-song" v-show="showFlag" @click.stop>
			<div class="header">
				<h1 class="title">添加歌曲到列表</h1>
				<div class="close" @click="hide">
					<i class="icon-close" ></i>
				</div>
			</div>
			<div class="search-box-wrapper">
				<search-box placeholder="搜索歌曲" @query="search" ref="searchBoxRef"></search-box>
			</div>
			<div class="shortcut" v-show="!query">
				<switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
				<div class="list-wrapper">
					<scroll v-if="currentIndex===0" :data="playHistory" class="list-scroll" ref="songListRef">
						<div class="list-inner">
							<song-list :songs="playHistory" @select="selectSong"></song-list>
						</div>
					</scroll>
					<scroll class="list-scroll" v-if="currentIndex===1" :data="searchHistory" ref="searchListRef" :refreshDelay="refreshDelay">
						<div class="list-inner">
							<search-list  @delete="delHistory" @select="addQuery" :searches="searchHistory"></search-list>
						</div>
					</scroll>
				</div>
			</div>
			<div class="search-result"  v-show="query">
				<suggest :query="query" :showSinger="showSinger" @select="savaHis" @beforeScroll="blurInput"></suggest>
			</div>
			<top-tip ref="topTipRef">
				<div class="tip-title">
					<i class="icon-ok"></i>
					<span class="text">1首歌曲已经添加到播放队列</span>
				</div>
			</top-tip>
		</div>
	</transition>
</template>

<script>
	import SearchBox from '@/base/search-box'
	import Suggest from '@/components/suggest/suggest'
	import Switches from '@/base/switches'
	import Scroll from '@/base/scrollview'
	import SearchList from '@/base/search-list'
	import SongList from '@/base/song-list'
	import {Song} from '@/common/js/song.js'
	import TopTip from '@/base/top-tip'
	import { mapActions, mapGetters } from 'vuex'
	export default {
		data() {
			return {
				showFlag: false,
				query: '',
				showSinger:false,
				// 切换开关文案
			    switches: [
			    	{name: '最近播放'},
			    	{name: '搜索历史'}
			    ],
			      // 当前切换开关
			    currentIndex: 0,
			    refreshDelay: 100
			}
		},
		methods: {
			...mapActions(['saveHistory', 'delHistory', 'insertSong']),
		    // 保存搜索结果历史到 vuex 和 localstorage 中
		    switchItem(index) {
		      	this.currentIndex = index
		    },
		    savaHis() {
		      	this.saveHistory(this.query)
		      	this.$refs.topTipRef.show()
		    },
		    deleteHis(item) {
		      	this.delHistory(item)
		    },
		    addQuery(k) {
		      	this.$refs.searchBoxRef.setQuery(k)
		    },
		    // 当检索值改变时
		    onQueryChange(query) {
		      	this.query = query
		    },
			show() {
				this.showFlag = true
				setTimeout(() => {
			        if (this.currentIndex === 0) {
			          	this.$refs.songListRef.refresh()
			        } else {
			          	this.$refs.searchListRef.refresh()
			        }
			    }, 20)
			},
			hide() {
				this.showFlag = false
			},
			search(query) {
				this.query = query
			},
			// 滚动前触发事件
		    blurInput() {
		      	this.$refs.searchBoxRef.blur()
		    },
		    switchItem(index) {
		      	this.currentIndex = index
		    },
			selectSong(song, index) {
		      	if (index !== 0) {
		        	this.insertSong(new Song(song))
		      	}
		      	this.$refs.topTipRef.show()
		    }
		},
		components: {
			SearchBox,
			Suggest,
			Switches,
			Scroll,
			SongList,
			SearchList,
			TopTip
		},
		computed: {
			...mapGetters(['searchHistory', 'playHistory'])
		},
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	@import "~common/stylus/mixin"
	
	.add-song
		position: fixed
		top: 0
		bottom: 0
		width:100%
		z-index: 200
		background: $color-background
		&.slide-enter-active, &.slide-leave-active
			transition: all 0.3s
		&.slide-enter, &.slide-leave-to
			transform: translate3d(100%, 0, 0)
		.header
			position: relative
			height: 44px
			text-align: center
			.title
				line-height: 44px
				font-size: $font-size-large
				color: $color-text
			.close
				position: absolute
				top: 0
				right: 8px
				.icon-close
					display: block
					padding: 12px
					font-size: 20px
					color: $color-theme
		.search-box-wrapper
			margin: 20px
		.shortcut
			.list-wrapper
				position: absolute
				top: 165px
				bottom: 0
				width: 100%
				.list-scroll
					height: 100%
					overflow: hidden
					.list-inner
						padding: 20px 30px
		.search-result
			position: fixed
			top: 124px
			bottom: 0
			width:100%
		.tip-title
			text-align: center
			padding: 18px 0
			font-size: 0
			.icon-ok
				font-size: $font-size-medium
				color: $color-theme
				margin-right: 44px
			.text
				font-size: $font-size-medium
				color: $color-text
</style>