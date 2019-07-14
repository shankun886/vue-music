<template>
<!-- vue提供的js钩子函数实现动画效果，这里实现的是展开收起时音乐小图片飞入播放内核中	
					@enter="enter"
					@after-enter="afterEnter"
					@leave="leave"
					@after-leave="leaveEnter" -->
	<div class="player" v-show="playlist.length > 0">
		<transition name="normal"
					@enter="enter"
					@after-enter="afterEnter"
					@leave="leave"
					@after-leave="afterLeave"
		>
			<div class="normal-player" v-show="fullScreen">
				<div class="background">
					<img width="100%" height="100%" :src="currentSong.image">
				</div>
				<div class="top">
					<div class="back" @click="back">
						<i class="icon-back"></i>
					</div>
					<h1 class="title" v-html="currentSong.name"></h1>
					<h2 class="subtitle"  v-html="currentSong.singer"></h2>
				</div>
				<div class="middle"
					@touchstart.prevent="middleTouchstart"
					@touchmove.prevent="middleTouchmove"
					@touchend="middleTouchend">
					<div class="middle-l" ref="middleRef">
						<div class="cd-wrapper" ref="cdRef">
							<div class="cd" :class="playing ? 'play' : 'play pause'">
								<img class="image" :src="currentSong.image">
							</div>
						</div>
						<!-- cd页小段歌词 -->
			            <div class="playing-lyric-wrapper">
			              	<div class="playing-lyric">{{ playingLyric }}</div>
			            </div>
					</div>
					<scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
						<div class="lyric-wrapper">
							<div v-if="currentLyric">
								<p ref="lyricLine"
									class="text"
									:class="{'current': currentLyricLine ===index }"
									v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
							</div>
						</div>
					</scroll>
				</div>
				<div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class="{'active':currentDot==='cd'}"></span>
						<span class="dot" :class="{'active':currentDot==='lyric'}"></span>
					</div>
					<div class="progress-wrapper">
						<span class="time time-l">{{format(currentTime)}}</span>
						<div class="progress-bar-wrapper">
							<progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
						</div>
						<span class="time time-r">{{format(currentSong.duration)}}</span>
					</div>
					<div class="operators">
						<div class="icon i-left" @click="changeMode">
							<i :class="iconMode"></i>
						</div>
						<div class="icon i-left" @click="prev"  :class="songReady ? '' : 'disable'">
							<i class="icon-prev"></i>
						</div>
						<div class="icon i-center" :class="songReady ? '' : 'disable'">
							<i @click="togglePlaying" :class="playing ? 'icon-pause' : 'icon-play'"></i>
						</div>
						<div class="icon i-right" :class="songReady ? '' : 'disable'">
							<i class="icon-next" @click="next"></i>
						</div>
						<div class="icon i-right">
							<i class="icon" :class="getFavoriteCls(currentSong)" @click="toggleFavoriteCls(currentSong)"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		
		<transition name="mini">
			<div class="mini-player"  v-show="!fullScreen" @click="open">
				<div class="icon">
					<img width="40" height="40" :src="currentSong.image" :class="playing ? 'play' : 'play pause'">
				</div>
				<div class="text">
					<h2 class="name" v-html="currentSong.name"></h2>
					<p class="desc" v-html="currentSong.singer"></p>
				</div>
				<div class="control">
					<progress-circle :radius="32" :percent="percent">
						<i :class="playing ? 'icon-pause-mini' : 'icon-play-mini'" @click.stop="togglePlaying" class="icon-mini"></i>
					</progress-circle>
				</div>
				<div class="control" @click.stop="showPlaylist">
          			<i class="icon-playlist"></i>
        		</div>
			</div>
		</transition>
		<playlist ref="playlist"></playlist>
		<audio :src="currentSong.url" ref="audio" 
			@play="ready"
			@error="error"
			@ended="ended"
			@timeupdate="timeupdate">Your browser does not support the audio element.</audio>
	</div>
</template>

<script type="text/ecmascript-6">
	import {mapGetters, mapMutations,mapActions} from 'vuex'
	import createkeyframeAnimation from 'create-keyframe-animation'
	import ProgressBar from '@/base/progress-bar'
	import ProgressCircle from '@/base/progress-circle'
	import {shuffle} from '@/common/js/util'
	import Lyric from 'lyric-parser' // QQ音乐 歌词解析 https://github.com/ustbhuangyi/lyric-parser
	import Playlist from '@/components/playlist/playlist'
	import Scroll from '@/base/scrollview'
	export default {
		components: {
			ProgressBar,
			ProgressCircle,
			Scroll,
			Playlist
		},
		data() {
			return {
				// 标志位。歌曲已缓存好，可以播放了
				songReady: false,
				// 当前播放时间
				currentTime: 0,
				// 当前的歌词
				currentLyric: null,
				// 当前的歌词在第几行
				currentLyricLine: 0,
				// 当前在哪个分页
      			currentDot: 'cd',
      			// cd页小段歌词
		      	playingLyric: '无歌词数据',
		      	// 是否显示播放列表
		      	showList: false,

			}
		},
		created() {
			//之所以在created定义touch,因为touch并不需要添加getters和setter
			//touch用来关联touchstart和touchmove的一些数据
			this.touch = {}
		},
		computed: {
			...mapGetters([
				"fullScreen",
				"playlist",
				'currentSong',
				'playing',
				'currentIndex',
				'mode',
				'sequenceList',
				'favoriteList'
			]),
			percent() {
				return this.currentTime / this.currentSong.duration 
			},
			iconMode() {
				let cls = ''
		      	if (this.mode === 0) {
		        	cls = 'icon-sequence'
		      	} 
		      	else if (this.mode === 1) {
		        	cls = 'icon-loop'
		      	}
		      	else if (this.mode === 2) {
		        	cls = 'icon-random'
		      	} else {
		        	cls = ''
		      	}
      			return cls 
			}
		},
		watch: {
			currentSong(newSong, oldSong) {
				 // 播放列表没有歌曲就退出
		      	if (!newSong.id) {
		        	return
	      		}

				if (!newSong.id === oldSong) {
					return
				}
				// 切歌时，停止当前歌词
		      	if (this.currentLyric) {
	       	 		this.currentLyric.stop()
		      	}
		      	clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.$refs.audio.play()
					this.getLyric()
				},1000)
				
			},
			playing(newplaying) {
				const audio = this.$refs.audio
				this.$nextTick(() => {
		        	newplaying ? audio.play() : audio.pause()
		      	})
				
			}
		},
		methods: {
			...mapActions(['saveplayHistory', 'savefavoriteList', 'delfavoriteList']),
		    getFavoriteCls(song) {
		      	if (this._isFavorite(song)) {
		        	return 'icon-favorite'
		      	} else {
		        	return 'icon-not-favorite'
		      	}
		    },
		    toggleFavoriteCls(song) {
		      	if (this._isFavorite(song)) {
		        	this.delfavoriteList(song)
		      	} else {
		       	 	this.savefavoriteList(song)
		      	}
		    },
		    _isFavorite(song) {
		      	let index = this.favoriteList.findIndex((item) => {
		        	return song.id === item.id
		      	})

		      	return index > -1
		    },
			showPlaylist() {
				this.$refs.playlist.show()
			},
			togglePlaying() {
				if (!this.songReady) {
					return
				}
				this.setPlayingState(!this.playing)
				// 暂停时，歌词也暂停
		      	if (this.currentLyric) {
		        	this.currentLyric.togglePlay()
		      	}
			},
			back() {
				this.setFullScreen(false)
			},
			open() {
				this.setFullScreen(true)
			},
			ready() {
				this.songReady = true
				this.saveplayHistory(this.currentSong)
			},
			error() {
				this.songReady = true
			},
			next() {
				//console.log(this.songReady)
				if (!this.songReady) {
					return
				}
				// 如果播放列表只要一条数据
		      	if (this.playlist.length === 1) {
		        	this.loop()
		        	return
		      	} else {
		        	let index = this.currentIndex + 1
		        	if (index === this.playlist.length) {
		          		index = 0
		        	}
		        	this.setCurrentIndex(index)
		        	if (!this.playing) {
		          		this.togglePlaying()
		        	}
		      	}
			},
			prev() {
				if (!this.songReady) {
					return
				}
				// 如果播放列表只要一条数据
		      	if (this.playlist.length === 1) {
		        	this.loop()
		        	return
		      	} else {
					let index = this.currentIndex - 1
					if (index === -1) {
						index = this.playlist.length
					}
					this.setCurrentIndex(index)
					if (!this.playing) {
						this.togglePlaying()
					}
				}
				this.songReady = false
			},
			timeupdate(e) {
				this.currentTime = e.target.currentTime
			},
			/*对时间戳进行格式化*/
			format(interval) {
				interval = Math.floor(interval)
				const minute = Math.floor(interval/60)
				const second = this._pad(Math.floor(interval%60))
				return `${minute}:${second}`
			},
			/*对秒做补零操作*/
			_pad(num, n =2) {
				let len = num.toString().length
				while (len < n) {
					num = '0' + num
					len++
				}
				return num
			},
			percentChange(newPercent) {
				let currentTime = this.currentSong.duration * newPercent
				this.$refs.audio.currentTime = currentTime
      			// 进度改变后自动播放
		      	if (!this.playing) {
		        	this.togglePlaying()
		      	}
		      	if (this.currentLyric) {
        			this.currentLyric.seek(currentTime * 1000)
      			}
			},
			/*js创建css3动画利用第三方库create-keyframe-animation*/
			//计算两个normal-player和mini-player两个歌曲图片中心点偏移量和缩放比例
			enter(el, done) {
				const {x, y, scale} = this._getPosAndScale()
				let animation = {
			        0: {
			          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
			        },
			        60: {
			          transform: `translate3d(0, 0, 0) scale(1.1)`
			        },
			        100: {
			          transform: `translate3d(0, 0, 0) scale(1)`
			        }
			    }
   				createkeyframeAnimation.registerAnimation({
			        name: 'move',
			        animation,
			        presets: {
			          	duration: 400,
			          	easing: 'linear',
			          	delay: 100
			        }
			    })
			    createkeyframeAnimation.runAnimation(this.$refs.cdRef, 'move', done)
			},
			afterEnter() {
				createkeyframeAnimation.unregisterAnimation('move')
      			this.$refs.cdRef.style.animation = ''
			},
			leave(el, done) {
				//纯js写css3动画
				const {x, y, scale} = this._getPosAndScale()
		      	this.$refs.cdRef.style.transition = `all 0.4s ease`
		      	this.$refs.cdRef.style['transform'] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
		      	this.$refs.cdRef.style['webkitTransform'] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
		      	this.$refs.cdRef.addEventListener('transitionend', done)
			},
			afterLeave() {
				this.$refs.cdRef.style['transform'] = ''
      			this.$refs.cdRef.style['webkitTransform'] = ''
      			this.$refs.cdRef.style.transition = ''
			},
			_getPosAndScale() {
				const targetWidth = 40   //小图像的宽度
				const paddingLeft = 40	//小图像中心距离左边偏移
				const paddingBottom = 30 //小图像中心距离底边偏移
				const paddingTop = 30 //大图像距离屏幕上部偏移
				const width = window.innerWidth * 0.8  //大图像的宽度
				const scale = targetWidth / width   //缩放比例
			  	const x = -(window.innerWidth / 2 - paddingLeft)  //x轴应该偏移的量
			  	const y = window.innerHeight - paddingTop - width / 2 - paddingBottom  //y轴应该偏移的量
			  	return {x, y, scale}

			},
			// 改变播放模式，实质是修改 playlist
    		changeMode() {
    			let mode = (this.mode + 1) % 3
      			this.setPlayMode(mode)
      			let newList = null
		      	if (mode === 2) {
		        	// 随机播放
		        	newList = shuffle(this.sequenceList)
		      	} else {
		        	// 顺序播放、单曲循环
		        	newList = this.sequenceList
		     	}
		     	//console.log(this.sequenceList)
		      	// 调整当前歌曲的索引
		      	let index = newList.findIndex((item) => {
		        	return item.id === this.currentSong.id
		      	})
		      	this.setCurrentIndex(newList)
		      	this.setPlayList(newList)
    		},
    		resetCurrentIndex(newList){
    			let index = newList.findIndex((item) => {
    				return item.id === this.currentSong.id
    			})
    			this.setCurrentIndex(index)
    		},
    		ended() {
    			if (this.mode === 1) {
        			// 单曲循环模式
        			this.loop()
      			} else {
        			this.next()
      			}
    			if (this.mode) {}
    			this.next()
    		},
    		loop(){
    			this.$refs.audio.currentTime = 0
    			this.$refs.audio.play()
    			// 单曲循环时，歌词也单曲循环
      			if (this.currentLyric) {
        			this.currentLyric.seek(0)
      			}
    		},
    		getLyric() {
    			this.currentSong.getLyric().then((lyric) => {
			        if (this.currentSong.lyric !== lyric) {
			          	return
			        }
			        //扩展的lyric插件的使用方法
        			this.currentLyric = new Lyric(lyric, this.handleLyric)
        			//console.log(this.currentLyric)
		        	if (this.playing) {
		          		this.currentLyric.play()
		        	}
		      	}).catch(() => {
		        // 获取歌词失败时
		        	this.currentLyric = null
		        	this.playingLyric = '无歌词数据'
		        	this.currentLyricLine = 0
		      	})
    		},
    		// new Lyric 回调函数
		    handleLyric ({lineNum, txt}) {
		      	// this hanlder called when lineNum change
		      	this.currentLyricLine = lineNum

		      	// 歌词在中间
		      	if (lineNum > 5) {
		        	let el = this.$refs.lyricLine[lineNum - 5]
		        	this.$refs.lyricList.scrollToElement(el, 1000)
		      	} else {
		        	this.$refs.lyricList.scrollTo(0, 0, 1000)
		      	}

		      	// 当前歌词
		      	this.playingLyric = txt
		    },
		    middleTouchstart(e) {
		    	this.touch.init = true
		    	// 开始滑动的位置
      			this.touch.startX = e.touches[0].pageX
      			this.touch.startY = e.touches[0].pageY
      			

		    },
		    middleTouchmove(e) {
		    	if (!this.touch.init) {
        			return
      			}
      			// 滑动的差值
      			let deltaX = e.touches[0].pageX - this.touch.startX
      			let deltaY = e.touches[0].pageY - this.touch.startY
      			// 纵向滚动 纵轴方向偏差大于横轴方向偏差
		      	if (Math.abs(deltaX) < Math.abs(deltaY)) {
		        	return
		      	}
		      	let left = this.currentDot === 'cd' ? 0 : -window.innerWidth
		      	// 左滑的距离
      			let offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      			this.touch.percent = Math.abs(offsetWidth / window.innerWidth)

      			this.$refs.lyricList.$el.style['webkitTransform'] = `translate3d(${offsetWidth}px, 0, 0)`
      			this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
      			// 过渡效果坚持 0ms
      			this.$refs.lyricList.$el.style['webkitTransition-duration'] = 0
      			this.$refs.lyricList.$el.style['transition-duration'] = 0
      			// 背景模糊
      			this.$refs.middleRef.style.opacity = 1 - this.touch.percent
      			this.$refs.middleRef.style['webkitTransition-duration'] = 0
      			this.$refs.middleRef.style['transition-duration'] = 0
		    },
		    middleTouchend(e) {
		    	let offsetWidth = null
      			let opacity = null

		      	if (this.currentDot === 'cd') {
		        	// 左滑
		        	if (this.touch.percent > 0.1) {
		          		offsetWidth = -window.innerWidth
		          		this.currentDot = 'lyric'
		          		opacity = 0
	       		 	} else {
		          		offsetWidth = 0
		          		opacity = 1
	        		}
		      	} else {
		        // 右滑
		        	if (this.touch.percent < 0.9) {
		          		offsetWidth = 0
		          		this.currentDot = 'cd'
		          		opacity = 1
	        		} else {
		          		offsetWidth = -window.innerWidth
		          		opacity = 0
		        	}
		      	}
		      	this.$refs.lyricList.$el.style['webkitTransform'] = `translate3d(${offsetWidth}px, 0, 0)`
      			this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
      			// 过渡效果坚持 300ms
      			this.$refs.lyricList.$el.style['webkitTransition-duration'] = '300ms'
  				this.$refs.lyricList.$el.style['transition-duration'] = '300ms'
      			// 背景模糊
      			this.$refs.middleRef.style.opacity = opacity
      			this.$refs.middleRef.style['webkitTransition-duration'] = '300ms'
      			this.$refs.middleRef.style['transition-duration'] = '300ms'
		    },
			...mapMutations({
				setFullScreen: 'SET_FULL_SCREEN',
				setPlayingState: 'SET_PLAYING_STATE',
				setCurrentIndex: 'SET_CURRENT_INDEX',
				setPlayMode: 'SET_PLAY_MODE',
				setPlayList: 'SET_PLAYLIST'
			})
		},
		mounted() {
			
			
		}
		
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	@import "~common/stylus/mixin"
	
	.player
		.normal-player
			position: fixed
			left: 0
			right: 0
			top: 0
			bottom: 0
			z-index: 150
			background: $color-background
			.background
				position: absolute
				left: 0
				top: 0
				width: 100%
				height: 100%
				z-index: -1
				opacity: 0.6
				filter: blur(20px)
			.top
				position: relative
				margin-bottom: 25px
				.back
					position: absolute
					top: 0
					left: 6px
					z-index: 50
					.icon-back
						display: block
						padding: 9px
						font-size: $font-size-large-x
						color: $color-theme
						transform: rotate(-90deg)
				.title
					width: 70%
					margin: 0 auto
					line-height: 40px
					text-align: center
					@include no-wrap()
					font-size: $font-size-large
					color: $color-text
				.subtitle
					line-height:20px
					text-align: center
					font-size: $font-size-medium
			.middle
				position: fixed
				width: 100%
				top: 80px
				bottom: 170px
				white-space: nowrap
				font-size: 0
				.middle-l
					display: inline-block
					vertical-align: top
					position:relative
					width: 100%
					height: 0
					padding-top: 80%
					.cd-wrapper
						position: absolute
						left: 10%
						top: 0
						width: 80%
						height: 100%
						.cd
							width: 100%
							height: 100%
							box-sizing: border-box
							border: 10px solid rgba(255,255,255,0.1)
							border-radius: 50%
							&.play
								animation: rotate 20s linear infinite
							&.pause
								animation-play-state: paused
								-webkit-animation-play-state: paused
							.image
								position: absolute
								left: 0
								top: 0
								width: 100%
								height: 100%
								border-radius: 50%
					.playing-lyric-wrapper
						width: 80%
						margin: 30px auto 0 auto
						overflow: hidden
						text-align: center
						.playing-lyric
							height: 20px
							line-height: 20px
							font-size: $font-size-medium
							color: $color-text-l
				.middle-r
					display: inline-block
					vertical-align: top
					width: 100%
					height: 100%
					overflow: hidden
					.lyric-wrapper
						width:80%
						margin: 0 auto
						overflow: hidden
						text-align: center
						.text
							line-height: 32px
							color: $color-text-l
							font-size: $font-size-medium
							&.current
								color: $color-text
			.bottom
				position: absolute
				bottom: 50px
				width: 100%
				.dot-wrapper
					text-align: center
					font-size: 0
					.dot
						display: inline-block
						vertical-align: middle
						margin: 0 4px
						width: 8px
						height: 8px
						border-radius: 50%
						background: $color-text-l
						&.active
							width: 20px
							border-radius: 5px
							background: $color-text-ll
				.progress-wrapper
					display: flex
					align-items: center
					width: 80%
					margin: 0 auto
					padding: 10px 0
					.time
						color: $color-text
						font-size: $font-size-small
						flex: 0 0 30px
						line-height: 30px
						width: 30px
						&.time-l
							text-align: left
							margin-right: 5px
						&.time-r
							text-align: right
							margin-left: 5px
					.progress-bar-wrapper
						flex: 1
				.operators
					display: flex
					align-items: center
					.icon
						flex: 1
						color: $color-theme
						&.disable
							color: $color-theme-d
						i
							font-size: 30px
					.i-left
						text-align: right
					.i-center
						padding: 0 20px
						text-align: center
						i
							font-size: 40px
					.i-right
						text-align: left
					.icon-favorite
						color: $color-sub-theme
			&.normal-enter-active,&.normal-leave-active
				transition: all 0.4s
				.top, .bottom
					transform: all 0.4s cubic-bezier(0.86,0.18,0.82,1.32)
			&.normal-enter,&.normal-leave-to
				opacity: 0
				.top
					transform: translate3d(0, -100px, 0)
				.bottom
					transform: translate3d(0, 100px, 0)
		.mini-player
			display: flex
			align-items: center
			position: fixed
			left: 0
			bottom: 0
			z-index: 180
			width: 100%
			height: 60px
			background: $color-highlight-background
			&.mini-enter-active,&.mini-leave-active
				transition: all 0.4s
			&.mini-enter,&.mini-leave-to
				opacity: 0
			.icon
				flex: 0 0 40px
				width: 40px
				padding: 0 10px 0 20px
				img
					border-radius: 50%
					&.play
						animation: rotate 10s linear infinite
					&.pause
						animation-play-state: paused
			.text
				display: flex
				flex-direction: column
				justify-content: center
				flex: 1
				line-height: 20px
				overflow: hidden
				.name
					margin-bottom: 2px
					@include no-wrap()
					font-size: $font-size-medium
					color: $color-text
				.desc
					@include no-wrap()
					font-size: font-size-small
					color: $color-text-d
			.control
				flex: 0 0 30px
				width: 30px
				padding: 0 10px
				.icon-play-mini, .icon-pause-mini, .icon-playlist
					font-size: 30px
					color: $color-theme-d
				.icon-mini
					font-size: 32px
					position: absolute
					left: 0
					top: 0
	@keyframes rotate
		0%
			transform:rotate(0)
		100%
			transform:rotate(360deg)
				
</style>