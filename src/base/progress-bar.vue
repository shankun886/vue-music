<!-- 进度条组件 -->
<template>
  	<div ref="progressBar" @click.stop="progressClick" class="my-progress-bar">
    	<div class="bar-inner">
      	<!-- 已播放的进度 -->
      		<div ref="progress" class="progress"></div>

       		<!-- 小球 -->
      		<div ref="progressBtn"
           		@touchstart.prevent="progressTouchstart"
           		@touchmove.prevent="progressTouchmove"
           		@touchend="progressTouchend"
           		class="progress-btn-wrapper">
        		<div class="progress-btn"></div>
      		</div>
    	</div>
  </div>
</template>

<script type="text/ecmascript-6">
	const progressBtnWidth = 16
	export default {
		props: {
			precent: {
				type: Number,
				default: 0
			}
		},
		watch: {
			precent(newPercent) {
				if (newPercent >= 0 &&!this.touch.init) {
					const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
					const offsetWidth = newPercent* barWidth
					this._move(offsetWidth)
				}
			}
		},
		created() {
			//用于在不同回调函数共享数据，把共享数据挂载到这个touch
			this.touch = {}

		},
		methods: {
			progressClick(e) {
				// 返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。
				//console.log(e)
      			let rectLeft = this.$refs.progressBar.getBoundingClientRect().left
      			//console.log(rectLeft)
      			let offsetWidth = e.pageX - rectLeft
				// this._move(e.offsetX) // 这样的话，点小球的时候数据不对，弃
      			this._move(offsetWidth)
      			this._percentChange()
			},
			progressTouchstart(e) {
				//表示已经初始化
				this.touch.init = true   
				 // 开始滑动的位置
      			this.touch.startX = e.touches[0].pageX
      			// 当前偏移
      			this.touch.left = this.$refs.progress.clientWidth
			},
			progressTouchmove(e) {
				if (!this.touch.init) return
				// 滑动的差值
      			let deltaX = e.touches[0].pageX - this.touch.startX
      			// 进度条的差值，大于0，小于总长度
      			let offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))

      			this._move(offsetWidth)
			},
			progressTouchend(e) {
				this.touch.init = false
      			this._percentChange()
			},
			  // 进度条前进 + 小球前进
		    _move(offsetWidth) {
		      	this.$refs.progress.style.width = `${offsetWidth}px`
		      	this.$refs.progressBtn.style['webkitTransform'] = `translate3d(${offsetWidth}px, 0, 0)`
		      	this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
		    },
		    _percentChange() {
		    	const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
		    	let newPercent = this.$refs.progress.clientWidth / barWidth
		    	this.$emit('percentChange', newPercent)
		    }
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import '~@/common/stylus/variable'
	
	.my-progress-bar
		height: 30px
		.bar-inner
			position: relative
			top:13px
			height: 4px
			border-radius: 50%
			background: rgba(0,0,0,0.3)
			.progress
				position: absolute
				height:100%
				background: $color-theme
			.progress-btn-wrapper
				position: absolute
				left: -8px
				top:-13px
				width: 30px
				height: 30px
				.progress-btn
					position:relative
					top: 7px
					left: 7px
					box-sizing: border-box
					width: 16px
					height: 16px
					border: 3px solid $color-text
					border-radius: 50%
					background: $color-theme
</style>