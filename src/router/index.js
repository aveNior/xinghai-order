import { createRouter, createWebHistory } from 'vue-router'

const HomePage = () => import('../pages/HomePage.vue')
const SearchResult = () => import('../pages/SearchResult.vue') // 用这个文件
const GoodsDetail = () => import('../pages/GoodsDetail.vue')
const MyPage = () => import('../pages/MyPage.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { title: '主页' }
    },
    {
      path: '/search',
      name: 'search',
      component: SearchResult, // 指向你现有的文件
      meta: { title: '搜索结果' }
    },
    {
      path: '/goods/:id',
      name: 'goods-detail',
      component: GoodsDetail,
      meta: { title: '商品详情' }
    },
    {
      path: '/my',
      name: 'my',
      component: MyPage,
      meta: { title: '我的' }
    },
    {
  path: '/my-orders',
  name: 'my-orders',
  component: () => import('../pages/MyOrders.vue'),
  meta: { title: '我的订单' }
}
  ]
})

export default router