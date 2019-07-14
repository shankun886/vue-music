<!--
开关切换 组件

<my-switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></my-switches>

// 切换开关文案
switches: [
  {name: '最近播放'},
  {name: '搜索历史'}
],
// 当前切换开关
currentIndex: 0

switchItem(index) {
  this.currentIndex = index
}
 -->
<template>
	<ul class="switches">
		<li class="switch-item" v-for="(item, index) in switches" :class="{'active':currentIndex === index}" @click="switchItem(index)">
			<span>{{ item.name }}</span>
		</li>
	</ul>
</template>

<script>
	export default {
		props: {
			switches: {
				type: Array,
				default: []
			},
			currentIndex: {
		      	type: Number,
		      	default: 0
		    }
		},
		methods: {
			switchItem(index) {
				this.$emit('switch',index)
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	@import "~common/stylus/mixin"
	.switches
		display: flex
		align-items: center
		width: 240px
		margin: 0 auto
		border: 1px solid $color-highlight-background
		border-radius: 5px
		.switch-item
			flex: 1
			text-align: center
			padding: 8px
			font-size: $font-size-medium
			color: $color-text-d
			&.active
				background: $color-highlight-background
				color: $color-text
</style>