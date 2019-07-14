<template>
	<div class="search">
		<div class="search-box-wrapper">
			<search-box ref="searchBox" @query="onQueryChange"></search-box>
		</div>
		<div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapperRef">
			<scroll class="shortcut" :data="scrollData" ref="scrollRef" :refreshDelay="refreshDelay">
				<div>
					<div class="hot-key">
						<h1 class="title">热门搜索</h1>
						<ul>
							<li class="item" v-for="item in hotkey" @click="addQuery(item.k)">
								<span>{{item.k}}</span>
							</li>
						</ul>
					</div>
					<div class="search-history" v-show="searchHistory.length">
						<h1 class="title">
							<span class="text">搜索历史</span>
							<span class="clear" @click="showConfirm">
								<i class="icon-clear"></i>
							</span>
						</h1>
						<search-list :searches="searchHistory" @select="addQuery" @delete="deleteHis"></search-list>
					</div>
				</div>
				
			</scroll>
		</div>
		<div class="search-result" v-show="query" ref="resultRef">
			<suggest :query="query" @beforeScroll="blurInput" @select="savaSearch" ref="suggest"></suggest>
		</div>
		<confirm ref="confirm" @confirm="confirm" @cancel="cancel"></confirm>
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
	import SearchBox from '@/base/search-box'
	import { getHotKey } from '@/api/search.js'
	import Suggest from '@/components/suggest/suggest'
	import SearchList from '@/base/search-list'
	import Confirm from '@/base/confirm'
	import Scroll from '@/base/scrollview'
	import { playlistMixin } from '@/common/js/mixin.js'
	import { mapActions, mapGetters } from 'vuex'
	export default {
		mixins: [playlistMixin],
		components: {
			SearchBox,
			Suggest,
			SearchList,
			Confirm,
			Scroll
		} ,
		created () {
    		this._getHotKey()
  		},
  		data() {
  			return {
  				hotkey:[],
  				query: '',
  				refreshDelay: 100
  			}
  		},
  		watch: {
		    // 解决添加歌曲后不能滚动的问题
		    query(newVal) {
		      	if (!newVal) {
		        	setTimeout(() => {
		          		this.$refs.scrollRef.refresh()
	        		}, 20)
		      	}
		    }
		},
  		computed: {
    		...mapGetters(['searchHistory']),
    		scrollData() {
      			return this.hotkey.concat(this.searchHistory)
    		},
    		scrollData() {
      			return this.hotkey.concat(this.searchHistory)
			}
  		},
  		methods: {
  			...mapActions(['saveHistory', 'delHistory', 'clearHistory']),
  			handlePlaylist(playlist) {
        		const bottom = playlist.length > 0 ? '60px' : ''
        		this.$refs.shortcutWrapperRef.style.bottom = bottom
        		this.$refs.scrollRef.refresh()
        		this.$refs.resultRef.style.bottom = bottom
        		this.$refs.suggest.refresh()
      		},
  			savaSearch() {
  				this.saveHistory(this.query)
  			},
  			onQueryChange(query) {
  				this.query = query
  			},
  			_getHotKey() {
  				getHotKey().then((res) => {
        			if (res.code === 0) {
          				// console.log(res.data.hotkey)
          				this.hotkey = res.data.hotkey.slice(0, 10)
        			}
      			})
  			},
  			addQuery(query) {
  				this.$refs.searchBox.setQuery(query)
  			},
  			 // 滚动前触发事件
		    blurInput() {
		      	this.$refs.searchBox.blur()
		    },
		    deleteHis(item) {
		      	this.delHistory(item)
		    },
		    showConfirm() {
		    	this.$refs.confirm.show()
		    },
		   	confirm() {
      			this.clearHistory()
			},
    		cancel() {
      			return
    		},
  		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	@import "~common/stylus/mixin"
	.search
		.search-box-wrapper
			margin: 20px
		.shortcut-wrapper
			position: fixed
			top: 178px
			bottom: 0
			width: 100%
			.shortcut
				height:100%
				overflow: hidden
				.hot-key
					margin: 0 20px 20px 20px
					.title
						margin-bottom: 20px
						font-size: $font-size-medium
						color: $color-text-l
					.item
						display: inline-block
						padding: 5px 10px
						margin: 0 20px 10px 0
						border-radius: 6px
						background: $color-highlight-background
						font-size: $font-size-medium
						color: $color-text-d
						&.special
							color: rgba(255,255,255,0.7)
				.search-history
					position: relative
					margin: 0 20px
					.title
						display:flex
						align-items: center
						height: 40px
						font-size: $font-size-medium
						color: $color-text-l
						.text
							flex:1
						.clear
							@include extend-click()
							.icon-clear
								font-size:$font-size-medium
								color: $color-text-d
		.search-result
			position: fixed
			width: 100%
			top: 178px
			bottom: 0
</style>