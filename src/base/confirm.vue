<!-- confirm 确认对话框 组件 -->

<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{ text }}</p>

          <div class="operate">
            <div @click="confirm" class="operate-btn left">{{ confirmBtnText }}</div>
            <div @click="cancel" class="operate-btn">{{ cancelBtnText }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: '确认清空吗'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      }
    },
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      show() {
        this.showFlag = true
      },
      hide() {
        this.showFlag = false
      },
      confirm() {
        this.showFlag = false
        this.$emit('confirm')
      },
      cancel() {
        this.showFlag = false
        this.$emit('cancel')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  
  .confirm
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 998
    background-color:$color-background-d
    &.confirm-fade-enter-active
      animation: confirm-fadein .3s
      .confirm-content
        animation: confirm-zoom .3s
    .confirm-wrapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%,-50%)
      z-index: 999
      .confirm-content
        width: 270px
        border-radius: 13px
        background: $color-highlight-background
        .text
          padding: 19px 15px
          line-height: 22px
          text-align: center
          font-size: $font-size-large
          color: $color-text-l
        .operate
          display: flex
          align-items: center
          text-align: center
          font-size: $font-size-large
          .operate-btn
            flex: 1
            line-height: 22px
            padding: 10px 0
            border-top: 1px solid $color-background-d
            color: $color-text-d
            &.left
              border-right: 1px solid $color-background-d
  @keyframes confirm-fadein
    0%
      opacity: 0
    100%
      opacity: 1
  @keyframes confirm-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>