<template>
	<transition name="slide">
		<music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
	</transition>
</template>
<script type="text/ecmascript-6">
	import MusicList from '@/components/music-list/music-list'
	import { mapGetters } from 'vuex'
	import { getRankDetail } from '@/api/rank.js'
	import { createSong } from '@/common/js/song.js'
	export default {
		components: {
			MusicList
		},
		computed: {
			title() {
				return this.rankList.topTitle
			},
			bgImage() {
				if (this.songs.length) {
        			return this.songs[0].image
      			}
			},
			...mapGetters([
				'rankList'
			])
		},
		created() {
			this._getRankDetail()
		},
		data() {
			return {
				songs: [],
				rank: true
			}
		},
		methods: {
			_getRankDetail() {
				if (!this.rankList.id) {
        			this.$router.push('/rank')
        			return
      			}
				getRankDetail(this.rankList.id).then((res) => {
					if (res.code === 0) {
						//console.log(res.songlist)
						this.songs = this._formatSongs(res.songlist)
						//console.log(this.songs)
					}
				})
			},
			_formatSongs(list) {
				let result = []
				//console.log(list)

		      	list.forEach((item) => {
		      		//console.log(item.data)
		        	if (item.data.songid && item.data.albummid) {
		          		result.push(createSong(item.data))
		        	}
		      	})
		      	return result
		      	
			}
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.slide-enter-active, .slide-leave-active
		transition: all .3s ease
	.slide-enter, .slide-leave-to
		opacity: 0
		transform: translate3d(100%, 0, 0)
</style>