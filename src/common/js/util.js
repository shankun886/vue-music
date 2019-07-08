function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}
/**
   * 洗牌函数
   * @param  {Array} arr 原数组
   * @param  {boolean} flag 是否改变原数组，默认不改变
   * @return {Array}     新数组
   */
export function shuffle(arr) {
	let _arr = arr.slice()   //返回一个新的数组，没有参数则相当于复制这个数组
	for (let i = 0; i < _arr.length; i++) {
      	let j = getRandom(0, i)
      	let temp = _arr[i]
      	_arr[i] = _arr[j]
      	_arr[j] = temp
    }
    return arr
}
  /**
    search-box.vue
   * 去抖（节流）
   * 有一些浏览器事件可以很快地在短时间内多次触发，
   * 例如调整窗口大小、向下滚动页面、搜索框节流等。
   * 如果你将事件监听器绑定到窗口滚动事件，并且用户不断快速地向下滚动页面，
   * 则你的事件可能在1秒内触发数千次。这可能会导致一些严重的性能问题。
   * 解决这个问题的一种方法是去抖，通过限制再次调用函数之前必须经过的时间。
   * 因此，去抖的正确实现是将几个函数调用组合成一个，并且在经过一段时间后仅执行一次。
   *
   * document.addEventListener('scroll', debounce(function () {
   *   console.log('hello');
   * }, 1000));
   *
   * @param  {Function} fn    要节流的函数
   * @param  {number}   delay 延迟毫秒数
   */
export function debounce (fn, delay) {
  let timer = null

  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}