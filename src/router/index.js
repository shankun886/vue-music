import Vue from 'vue'
import Router from 'vue-router'
/*import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import SingerDetail from 'components/singer-detail/singer-detail'
import Disc from 'components/disc/disc'
import RankDetail from 'components/rank-detail/rank-detail'
import UserCenter from 'components/user-center/user-center'*/
Vue.use(Router)

// 路由懒加载
const Recommend = (resolve) => {
  import('@/components/recommend/recommend').then((recommend) => {
    resolve(recommend)
  })
}
const Singer = (resolve) => {
  import('@/components/singer/singer').then((singer) => {
    resolve(singer)
  })
}
const Rank = (resolve) => {
  import('@/components/rank/rank').then((module) => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('components/search/search').then((module) => {
    resolve(module)
  })
}
const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
}
const Disc = (resolve) => {
  import('components/disc/disc').then((module) => {
    resolve(module)
  })
}
const RankDetail = (resolve) => {
  import('components/rank-detail/rank-detail').then((module) => {
    resolve(module)
  })
}
const UserCenter = (resolve) => {
  import('components/user-center/user-center').then((module) => {
    resolve(module)
  })
}
export default new Router({
	routes: [
		//解决刚开始启动时，首页高亮，即配置根路径，redirect
		{
			path:'/',
			redirect:'/recommend'
		},
		{
			path: '/recommend',
			component: Recommend,
			children: [
				{
					path:':id',
					component: Disc 
				}
			]
		},
		{
			path: '/rank',
			component: Rank,
			children: [
				{
					path: ':id',
					component: RankDetail
				}
			]
		},
		{
			path: '/singer',
			component: Singer,
			children:[
				{
					path: ':id',
					component: SingerDetail	
				}
				
			]
		},
		{
			path: '/search',
			component: Search,
			children:[
				{
					path: ':id',
					component: SingerDetail	
				}
				
			]
		},
		{
			path:'/user',
			component: UserCenter
		}
	]
})
