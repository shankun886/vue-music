<template>
	<transition name="slide">
		<div class="user-center">
			<div class="back" @click="back">
				<i class="icon-back"></i>
			</div>
			<div class="switches-wrapper">
				<switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
			</div>
			<div ref="playBtn" class="play-btn"@click="random">
				<i class="icon-play"></i>
				<span class="text">随机播放全部</span>
			</div>
			<div class="list-wrapper" ref="listWrapper">
				<scroll v-if="currentIndex===0" :data="favoriteList" class="list-scroll" ref="favoriteRef">
					<div class="list-inner">
						<song-list :songs="favoriteList" @select="selectSong"></song-list>
					</div>
				</scroll>
				<scroll class="list-scroll" v-if="currentIndex===1" :data="playHistory" ref="playListRef">
					<div class="list-inner">
						<song-list :songs="playHistory" @select="selectSong"></song-list>
					</div>
				</scroll>
			</div>
			<div class="no-result-wrapper" v-show="noResult">
				<no-result :title="noResultDesc"></no-result>
			</div>
		</div>
	</transition>
</template>

<script >
	import Switches from '@/base/switches'
	import Scroll from '@/base/scrollview'
	import SongList from '@/base/song-list'
	import {Song} from '@/common/js/Song.js'
	import { playlistMixin } from '@/common/js/mixin.js'
	import NoResult from '@/base/no-result'
	import { mapActions, mapGetters } from 'vuex'
	export default {
		mixins: [playlistMixin],
		data() {
			return {
				currentIndex: 0,
				switches: [
					{name: '我喜欢的'},
					{name: '最近听的'}
				]
			}
		},
		components: {
			Switches,
			Scroll,
			SongList,
			NoResult
		},
		methods: {
			...mapActions(['savefavoriteList', 'delfavoriteList', 'insertSong', 'randomPlay']),
			switchItem(index) {
		      	this.currentIndex = index
		    },
		    selectSong(song) {
		    	this.insertSong(new Song(song))
		    },
		    back() {
		    	this.$router.back()
		    },
		    random() {
		      	let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
		      	if (list.length === 0) {
		      		return
		      	}
		      	list = list.map((song) => {
		        	return new Song(song)
		      	})

		      	this.randomPlay({list})
		    },
		    // 当有迷你播放器时，调整滚动底部距离
		    handlePlaylist(playlist) {
		      	let bottom = playlist.length > 0 ? '60px' : ''
		      	this.$refs.listWrapper.style.bottom = bottom
		      	this.$refs.favoriteRef && this.$refs.favoriteRef.refresh()
		      	this.$refs.playListRef && this.$refs.playListRef.refresh()
		    }
		},
		computed: {
		    ...mapGetters(['playHistory', 'favoriteList']),
		    noResult() {
		      	if (this.currentIndex === 0) {
		        	return !this.favoriteList.length
		      	}
		      	if (this.currentIndex === 1) {
		        	return !this.playHistory.length
		      	}
		    },
		    noResultDesc() {
		    	if (this.currentIndex === 0) {
		        	return '暂无收藏歌曲'
		      	}
		      	if (this.currentIndex === 1) {
		        	return '你还没有听过歌曲'
		      	}
		    }
		 },
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	@import "~common/stylus/mixin"
	.user-center
		position: fixed
		top: 0
		bottom: 0
		z-index: 100
		width: 100%
		background: $color-background
		&.slide-enter-active, &.slide-leave-active
			transition: all .3s
		&.slide-enter, &.slide-leave-to
			transform: translate3d(100%, 0, 0)
		.back
			position: absolute
			top: 0
			left: 6px
			z-index: 50
			.icon-back
				display: block
				padding: 10px
				font-size: $font-size-large-x
				color: $color-theme
		.switches-wrapper
			margin: 10px 0 30px 0
		.play-btn
			box-sizing: border-box
			width: 135px
			padding: 7px 0
			margin:0 auto
			text-align: center
			border: 1px solid $color-text-l
			color: $color-text-l
			border-radius: 100px
			font-size: 0
			.icon-play
				display: inline-block
				vertical-align: middle
				margin-right: 6px
				font-size: $font-size-medium-x
			.text
				display: inline-block
				vertical-align: middle
				font-size: $font-size-small
		.list-wrapper
			position: absolute
			top: 110px
			bottom: 0
			width: 100%
			.list-scroll
				height: 100%
				overflow: hidden
				.list-inner
					padding: 20px 30px
		.no-result-wrapper
			position: absolute
			width: 100%
			top: 50%
			transform: translateY(-50%)
</style>