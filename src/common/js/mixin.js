/*多个组件有相同逻辑*/
import { mapGetters } from 'vuex'

/*
import { playlistMixin } from '@/common/js/mixin.js'

mixins: [playlistMixin],

// 当有迷你播放器时，调整滚动底部距离
handlePlaylist(playlist) {
  let bottom = playlist.length > 0 ? '60px' : ''
  this.$refs.rankRef.style.bottom = bottom
  this.$refs.scrollRef.refresh()
},
 */

export const playlistMixin = {
  	computed: {
    	...mapGetters([
      		'playlist'
    	])
  	},
  	mounted() {//dom  ready时触发
    	this.handlePlaylist(this.playlist)
  	},
  	activated() { //keepalive组件切过来时触发
    	this.handlePlaylist(this.playlist)
  	},
  	watch: {
    	playlist(newVal) {
    	  	this.handlePlaylist(newVal)
    	}
  	},
  	methods: {
    	handlePlaylist() {
      		throw new Error('component must implement handlePlaylist method')
    	}
  	}
}
