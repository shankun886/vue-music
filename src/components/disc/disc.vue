<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend'
  import { createSong } from '@/common/js/song.js'
  export default {
    data () {
      return {
        songs: []
      }
    },
    components: {
      MusicList
    },
    computed: {
      title() {
        return this.songlist.dissname
      },
      bgImage() {
        return this.songlist.imgurl
      },
      ...mapGetters([
        'songlist'
      ])
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        // 禁止直接刷新详情页（获取不到歌单 id）
        if (!this.songlist.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.songlist.dissid).then((res) => {
          if (res.code === 0) {
            //console.log(res.cdlist[0].songlist)
            this.songs = this._formatSongs(res.cdlist[0].songlist)
          }
        })
      },
      // 重组 res.cdlist[0].songlist 数据
      _formatSongs (list) {
        let result = []

        list.forEach((item) => {
          if (item.songid && item.albummid) {
            result.push(createSong(item))
          }
        })
        return result
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>