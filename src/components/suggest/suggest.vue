<template>
	<scroll class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore" ref="suggest" @beforeScroll="beforeScroll">
		<ul class="suggest-list">
			<li class="suggest-item" v-for="item in result" @click="selectItem(item)">
				<div class="icon">
					<i :class="getIconCls(item)"></i>
				</div>
				<div class="name">
					<p class="text" v-html="getDisplayname(item)"></p>
				</div>
			</li>
			<loading v-show="hasMore" title=""></loading>
		</ul>
		<div class="no-result-wrapper" v-show="!hasMore && !result.length">
			<no-result title="抱歉，暂无搜索结果"></no-result>
		</div>
	</scroll>
</template>

<script type="text/ecmascript-6">
	import { search } from '@/api/search.js'
	import { filterSinger } from '@/common/js/song.js'
	import Scroll from '@/base/scrollview'
	import Loading from '@/base/loading'
	import {Singer} from '@/common/js/singer'
	import { mapMutations ,mapActions} from 'vuex'
	import NoResult from '@/base/no-result'
	const TYPE_SINGER = 'singer'
	const perpage = 20
	export default {
		props: {
    		// 接受的检索值
    		query: {
      			type: String,
      			default: ''
    		},
    		zhida: {
    			type: Boolean,
    			default: true
    		}
  		},
  		data() {
  			return {
  				page: 1,
  				result: [],
  				//上啦加载
  				pullup: true,
  				hasMore: true,
  				beforeScrollData: true,
      			pullup: true
  			}
  		},
  		methods: {
  			...mapMutations({
      			'setSinger': 'SET_SINGER'
    		}),
    		...mapActions(['insertSong']),
  			selectItem(item) {
  				//console.log(item)
  				if (item.type === TYPE_SINGER) {
  					let singer = new Singer({
  						id: item.singermid,
  						name: item.singername
  					})
  					this.$router.push({
  						path: `/search/${singer.id}`
  					})
  					this.setSinger(singer)
  				}else {
  					this.insertSong(item)
  				}
  				this.$emit('select')
  			},
  			searchMore() {
  				if (!this.hasMore) {
  					return
  				}
  				this.page++
  				search(this.query, this.page, this.zhida, perpage).then((res) => {
  					if (res.code === 0) {
  						//console.log(res)
  						this.result = this.result.concat(this._getResult(res.data))
  						this._checkMore(res.data)
  					}
  				})
  			},
  			getDisplayname(item) {
  				if (item.type === TYPE_SINGER) {
  					return item.singername
  				}else {
  					return `${item.songname}-${filterSinger(item.singer)}`
  				}
  			},
  			getIconCls(item) {
  				if (item.type === TYPE_SINGER) {
  					return 'icon-mine'
  				}else {
  					return 'icon-music'
  				}
  			},
  			search() {
  				this.hasMore = true
  				this.page = 1
  				this.$refs.suggest.scrollTo(0,0)
  				search(this.query, this.page, this.zhida, perpage).then((res) => {
  					if (res.code === 0) {
  						//console.log(res)
  						this.result = this._getResult(res.data)
  						this._checkMore(res.data)
  					}
  				})
  			},
  			_checkMore(data) {
  				const song = data.song
  				if (!song.list.length || (song.curnum+song.curpage*perpage) >= song.totalnum) {
  					this.hasMore = false
  				}
  			},
  			_getResult(data) {
  				let ret = []
  				if (data.zhida && data.zhida.singerid) {
  					ret.push({...data.zhida,...{type: TYPE_SINGER}})
  				}
  				if (data.song) {
  					ret = ret.concat(data.song.list)
  				}
  				return ret
  			},
  			// 滚动前触发事件
		    beforeScroll() {
		    	//search.vue
		      	this.$emit('beforeScroll')
		    },
		    refresh() {
		    	this.$refs.suggest.refresh()
		    }
  		},
  		watch: {
  			query() {
  				this.search()
  			}
  		},
  		components: {
  			Scroll,
  			Loading,
  			NoResult
  		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	@import "~common/stylus/mixin"
	.suggest
		height: 100%
		overflow: hidden
		.suggest-list
			padding: 0 30px
			.suggest-item
				display: flex
				align-items: center
				padding-bottom: 20px
				.icon
					flex: 0 0 30px
					width: 30px
					[class^="icon-"]
						font-size: 14px
						color: $color-text-d
				.name
					flex: 1
					font-size: $font-size-medium
					color: $color-text-d
					overflow: hidden
					.text
						@include no-wrap()
		.no-result-wrapper
			position:absolute
			width: 100%
			top: 50%
			transform: translateY(-50%)
</style>