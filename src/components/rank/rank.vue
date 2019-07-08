<template>
	<div class="rank" ref="rank">
		<Scroll class="toplist" :data="toplist" ref="toplist">
			<ul>
				<li class="item" v-for="item in toplist" @click="selectItem(item)">
					<div class="icon">
						<img width="100" height="100" v-lazy="item.picUrl">
					</div>
					<ul class="songlist">
						<li class="song" v-for="(song, index) in item.songList">
							<span>{{ index + 1 }}</span>
							<span>{{ song.songname }}</span>
							<span class="singername"> - {{ song.singername }}</span>
						</li>
					</ul>
				</li>
			</ul>
			<div class="loading-container" v-show="!toplist.length">
				<Loading></Loading>
			</div>
		</Scroll>
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
	import { getRankList } from 'api/rank.js'
	import Scroll from '@/base/scrollview'
	import Loading from '@/base/loading'
	import { playlistMixin } from '@/common/js/mixin.js'
	import { mapMutations } from 'vuex'
	export default {
		mixins: [playlistMixin],
		data() {
			return {
				toplist: []
			}
		},
		created() {
			setTimeout(() => {
				this._getRankList()
			},100)
			
		},
		methods: {
			handlePlaylist(playlist) {
		        const bottom = playlist.length > 0 ? '60px' : ''
		        this.$refs.rank.style.bottom = bottom
		        this.$refs.toplist.refresh()
		    },
			_getRankList() {
				getRankList().then((res) => {
					if (res.code === 0 ) {
						this.toplist = res.data.topList
					}
				})
			},
			selectItem(item) {
				this.$router.push({
        			path: `/rank/${item.id}`
      			})
      			this.setRankList(item)
			},
			...mapMutations({
      			setRankList: 'SET_RANKLIST'
    		})
		},
		components: {
    		Scroll,
    		Loading
  		},
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	@import "~common/stylus/mixin"
	
	.rank
		position: fixed
		width: 100%
		top: 88px
		bottom: 0
		.toplist
			height:100%
			overflow: hidden
			.item
				display: flex
				margin: 0 20px
				padding-top: 20px
				height: 100px
				&:last-child
					padding-bottom: 20px
				.icon
					flex: 0 0 100px
					width: 100px
					height: 100px
				.songlist
					flex: 1
					flex-direction: column
					justify-content: center
					padding: 0 20px
					height: 100px
					overflow: hidden
					background: $color-highlight-background
					color: $color-text-d
					font-size: $font-size-small
					.song
						@include no-wrap()
						line-height: 26px
						.singername
							color: rgba(255, 255, 255, 0.2)
			.loading-container
				position: absolute
				width: 100%
				top: 50%
				transform: translateY(-50%)
</style>