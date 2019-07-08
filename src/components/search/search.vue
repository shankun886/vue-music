<template>
	<div class="search">
		<div class="search-box-wrapper">
			<search-box ref="searchBox" @query="onQueryChange"></search-box>
		</div>
		<div class="shortcut-wrapper" v-show="!query">
			<div class="shortcut">
				<div class="hot-key">
					<h1 class="title">热门搜索</h1>
					<ul>
						<li class="item" v-for="item in hotkey" @click="addQuery(item.k)">
							<span>{{item.k}}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="search-result" v-show="query">
			<suggest :query="query" @beforeScroll="blurInput"></suggest>
		</div>
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
	import SearchBox from '@/base/search-box'
	import { getHotKey } from '@/api/search.js'
	import Suggest from '@/components/suggest/suggest'
	export default {
		components: {
			SearchBox,
			Suggest
		} ,
		created () {
    		this._getHotKey()
  		},
  		data() {
  			return {
  				hotkey:[],
  				query: ''
  			}
  		},
  		methods: {
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
		    }
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