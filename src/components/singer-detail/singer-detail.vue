<template>
	<transition name="slide">
		<music-list :songs="songs" :bg-image="bgImage" :title="title"></music-list>
	</transition>
</template>
<script type="text/ecmascript-6">
	import { mapGetters } from 'vuex'
	import { getSingerDetail} from '@/api/singer'
	import {ERR_OK} from '@/api/config'
	import {createSong} from '@/common/js/song'
	import MusicList from '@/components/music-list/music-list'

	export default {
		data() {
			return {
				songs: []
			}
		},
		computed: {
			title() {
				return this.singer.name
			},
			bgImage() {
				return this.singer.avatar
			},
			...mapGetters([
				'singer'
			])
		},
		created() {
			this._getSingerDetail()
			//console.log(this.singer)
		},
		components: {
			MusicList
		},
		methods: {
			_getSingerDetail() {
				
				if (this.singer === undefined) {
					this.$router.push('/singer')
					return
				}
				getSingerDetail(this.singer.id).then((res) => {
					if (res.code === ERR_OK) {
						this.songs = this._normalizeSongs(res.data.list)
						/*console.log(res.data.list)
						console.log(this.songs)*/
					}
				})
			},
			_normalizeSongs(list) {
				let ret = []
				list.forEach((item) => {
					let {musicData} = item
					//console.log(musicData)
					if (musicData.songid && musicData.albummid) {
						ret.push(createSong(musicData))
					}
				})
				return ret
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~@/common/stylus/variable"
	
	
</style>