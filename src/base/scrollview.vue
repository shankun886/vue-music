<template>
	<div ref="wrapper">
		<slot></slot>
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	export default {
		props: {
			//监听滚动事件缓慢拖动还是快速拖动
			probeType: {
				type: Number,
				default: 1
			},
			//是否可以点击
			click: {
				type: Boolean,
				default: true
			},
			data: {
				type: Array,
				default: null			
			},
			//监听是否滚动
			listenScroll: {
				type: Boolean,
				default: false
			},
			//是否上啦刷新
			pullup: {
				type: Boolean,
				default: false
			},
			//滚动前是否触发事件，如：滚动前让输入框失去焦点，避免滚动搜索结果时移动端键盘遮挡
		    beforeScroll: {
		      type: Boolean,
		      default: false
		    },
		    // 延迟刷新
		    refreshDelay: {
		      	type: Number,
		      	default: 20
		    }
		},
		mounted() {
			setTimeout(() => {
				this._initScroll()
			},20)
		},
		methods: {
			_initScroll() {
				if (!this.$refs.wrapper) {
					return
				}
				this.scroll = new BScroll(this.$refs.wrapper, {
					probeType: this.probeType,
					click: this.click
				})
				if (this.listenScroll) {
					let me = this
					this.scroll.on('scroll',(pos) => {
						me.$emit('scroll',pos)
					})
				}
				//上啦加载派发事件
				if (this.pullup) {
					this.scroll.on('scrollEnd', () => {
						if (this.scroll.y <= this.scroll.maxScrollY + 5 ) {
							this.$emit('scrollToEnd')
						}
					})
				}
				  // 滚动前是否触发事件
		      	if (this.beforeScroll) {
		        	this.scroll.on('beforeScrollStart', () => {
		        		//在suggest.vue中
		          		this.$emit('beforeScroll')
		        	})
		      	}
			},
			enable() {
				this.scroll && this.this.scroll.enable()
			},
			disable() {
				this.scroll && this.this.scroll.disable()
			},
			refresh() {
				this.scroll &&this.scroll.refresh()
			},
			scrollTo() {
				this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
			},
			scrollToElement() {
				this.scroll &&this.scroll.scrollToElement.apply(this.scroll,arguments)
			}
		},
		watch: {
			data() {
				setTimeout(() => {
					this.refresh()
				},this.refreshDelay)
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>