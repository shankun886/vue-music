# 概述
项目是基于Vue.js，成品是一个移动端的音乐播放器，来源于imooc的实战课程。自己动手实践并加以修改拓展。
项目的大致流程是Vue-cli构建开发环境，分析需求，设计构思，规划目录结构，开始编码。

#### 视图层
<blockquote>
推荐页

歌手页

    歌手详情

歌曲排行榜

    排行榜详情

搜索页

用户中心</blockquote>


# 数据来源
所有数据都来自于QQ音乐，抓取自QQ的接口，大部分接口都是JSONP，抓取比较容易，其中一些接口限制了host，不能直接抓取，采用的方法是用axios代理，设置header，以此绕过host的限制。
PS：具体代码请看prod.server.js文件

# 技术栈
<blockquote>
Vue

Vuex

Vue-Router

Vue-cli

Stylus

Axios

ESlint

Better-scroll
</blockquote>


src目录结构
<img src="https://camo.githubusercontent.com/8774821f1bdcba1e180aef798c36ab2c0ac2ad7e/68747470733a2f2f6f63316779666536712e716e73736c2e636f6d2f31372d372d32372f37313532393437322e6a7067" alt="" data-canonical-src="https://oc1gyfe6q.qnssl.com/17-7-27/71529472.jpg" style="max-width:100%;">

# 难点
### ## player组件
讲一讲player 播放器组件，播放器组件可谓是整个项目的核心，当然数据处理和用户体验方面也是不简单的（逃。
播放器是全局组件，放在App.vue下面，通过Vuex传递数据，触发action提交mutation，从而使播放器开始工作。当然，其中的数据交互说复杂也不是很复杂，就是要花多点时间理解，player组件由多个基础组件构成，具体请看项目代码，下面上图

![image](https://camo.githubusercontent.com/1e32f582eba8aa24a2e15993ca0d97dd2f734dbe/68747470733a2f2f6f63316779666536712e716e73736c2e636f6d2f31372d372d32382f37353832383039352e6a7067)
为了防止切换歌曲时点击速度过快导致歌曲播放错误，使用了audio的onplayAPI，结合Vuex获取到数据，判断当前歌曲数据请求到才可以切换下一首歌曲，判断函数如下

 
```
ready() {
   this.songReady = true
 }
```

### 数据处理
通过调用QQ音乐的JSONP接口，获取的数据并不能直接拿来用，需要做进一步的规格化，达到我们使用的要求，所以在这方面单独封装了一个class来处理这方面的数据，具体请看src/common/js/song.js

在请求JSONP的时候，用到了一个JSONP库，这个库代码十分简短，只有几十行，有兴趣的同学可以学习下。

使用时，就是将请求的参数拼接在请求url上，然后调用这个库的jsonp方法。所以，在此封装了两个函数，一个是将参数拼接在url上，另一个是将库里面的jsonp方法Promise化，方便我们使用，具体请查看src/common/js/jsonp.js。

将请求的数据格式化后再通过Vuex传递，组件间共享，实现歌曲的播放切换等。

### 交互体验
该项目的很多地方都涉及到滚动，包括下拉滚动，下拉滚动刷新等。这里面用到了一个库(better-scroll)，来实现所有涉及到的滚动，建议学习下它的<a href="https://github.com/ustbhuangyi/better-scroll">API</a>。

其他动画包括了Vue的transition动画，路由之间切换时的简单动画，播放器打开时的动画，这个地方比较难，也比较好玩。

打开页面时的加载Loading效果，其实就是一个Loading组件，也比较简单。

为了减少流量，图片加载使用了懒加载的方式，滚动时再加载真实的图片。
具体效果请自身体验：）

### 效果
<img src="https://camo.githubusercontent.com/0b987f760faead0acedbec6d4d7fee711c9df39c/68747470733a2f2f6f63316779666536712e716e73736c2e636f6d2f31372d372d32382f32393534363430302e6a7067" alt="" data-canonical-src="https://oc1gyfe6q.qnssl.com/17-7-28/29546400.jpg" style="max-width:100%;">
<img src="https://camo.githubusercontent.com/8491a9096d52dbd16972836cd2096b54bdce3435/68747470733a2f2f6f63316779666536712e716e73736c2e636f6d2f31372d372d32382f38303934313234372e6a7067" alt="" data-canonical-src="https://oc1gyfe6q.qnssl.com/17-7-28/80941247.jpg" style="max-width:100%;">







# 构建
### 开发环境

```
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```



### 生产环境

```
# build for production with minification
npm run build
# run
node prod.server.js
```

总结
通过学习该项目，自己收获了许多，实践中也遇到了大大小小许多问题，通过断点调试等最终解决了，对我来说无疑是最大的鼓励，也希望能与大家一起学习。