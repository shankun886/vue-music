<template>
	<div class="singer" ref="singer">
		<list-view :data="singers" @select="selectSinger" ref="list"></list-view>
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
	import {getSingerList} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import {Singer} from 'common/js/singer'
	import ListView from '../../base/listview.vue'
	import { mapMutations } from 'vuex'
	import {playlistMixin} from '@/common/js/mixin'
	const HOT_TITLE = '热门'
	const HOT_SINGER_LEN = 10

	export default {
		mixins: [playlistMixin],
		data() {
			return {
				singers: []
			}
		},
		components: {
			ListView
		},
		created() {
			this._getSingerList()
			
		},
		methods: {
			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? '60px' : ''
				this.$refs.singer.style.bottom = bottom
				this.$refs.list.refresh()
			},
			selectSinger(singer) {
				this.$router.push({
					path: `/singer/${singer.id}`
				})
				//相当于this.$store.state.commit(singer)
				this.setSinger(singer)
			},
			_getSingerList(){
				getSingerList().then((res) => {
					if(res.code ===ERR_OK) {
						this.singers = this._normalizeSinger(res.data.list)
						//console.log(this.singers)
					}
				})
			},
			//把 res.data.list 数据重新组成新的数据结构
			_normalizeSinger(list) {
				let obj_singer = {
					hot: {
						title: HOT_TITLE,
						items: []
					}
				}
				//foreach遍历数组 没办法使用 break 语句跳出循环，或者使用return从函数体内返回     
				// for/in 遍历对象
				//for of 遍历数组
				list.forEach((item, index) => {
					if (index < HOT_SINGER_LEN) {
						obj_singer.hot.items.push(new Singer({
							id: item.Fsinger_mid,
							name: item.Fsinger_name
						}))
					}
					const key = item.Findex
					if (!obj_singer[key]) {
						obj_singer[key] = {
							title: key,
							items: []
						}
					}
					obj_singer[key].items.push(new Singer({
						id: item.Fsinger_mid,
						name: item.Fsinger_name
					}))
				})
				//为了得到有序列表，我们需要处理obj_singer
				let hot = []
				let ret = []
				for(let key in obj_singer) {
					let val = obj_singer[key]
					if (val.title.match(/[a-zA-Z]/)) {
						ret.push(val)
					}else if(val.title ===HOT_TITLE) {
						hot.push(val)
					}
				}
				ret.sort((a,b) => {
					return a.title.charCodeAt(0) - b.title.charCodeAt(0)
				})
				return hot.concat(ret)
			},
			...mapMutations({
				setSinger: 'SET_SINGER'
			})
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.singer
		position: fixed
		top: 88px
		bottom: 0
		width: 100%
</style>