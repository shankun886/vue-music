<template>
	<div class="song-list">
		<ul>
			<li v-for="(item, index) in songs" class="item" @click="selectItem(item,index)">
				<div class="rank" v-show="rank">
					<span class="icon" :class="getRankCls(index)" v-text="getRankTxt(index)"></span>
				</div>
				<div class="content">
					<h2 class="name">{{item.name}}</h2>
					<p class="desc">{{getDesc(item)}}</p>
				</div>
			</li>
		</ul>
	</div>
</template>
<script type="text/ecmascript-6">
	export default {
		props: {
			songs: {
				type: Array,
				default: []
			},
			rank: {
				type: Boolean,
				default: false
			}
		},
		mounted() {
			
		},
		methods: {
			getDesc(song) {
				return `${song.singer} - ${song.album}`
			
			},
			selectItem(item, index) {
				this.$emit('select', item, index)
			},
			getRankCls(index) {
				if (index === 0) {
        			return 'icon0'
      			} else if (index === 1) {
        			return 'icon1'
      			} else if (index === 2) {
        			return 'icon2'
      			} else {
        			return 'text'
      			}
			},
			getRankTxt(index) {
				if (index > 0) {
        			return index + 1
      			}
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import '~@/common/stylus/mixin.styl'
	@import '~@/common/stylus/variable.styl'
	.song-list
		.item
			display: flex
			align-items: center
			box-sizing: border-box
			height: 64px
			font-size: $font-size-medium
			.rank
				flex: 0 0 25px
				width: 25px
				margin-right: 30px
				text-align: center
				.icon
					display: inline-block
					width: 25px
					height: 24px
					background-size: 25px 24px
					&.icon0
						
						bg-image('./first')
					&.icon1
						bg-image('./second')
					&.icon2
						bg-image('./third')
				.text
					color: $color-theme
					font-size: $font-size-large
			.content
				flex: 1
				line-height: 20px
				overflow:hidden
				.name
					@include no-wrap()
					margin-top: 4px
					color: $color-text
				.desc
					@include no-wrap()
					margin-top: 4px
					color: $color-text-d
</style>