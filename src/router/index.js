import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CategoryView from '@/views/CategoryView.vue'
import PublishView from '@/views/PublishView.vue'
import MessageView from '@/views/MessageView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import ProductListView from '@/views/ProductListView.vue'
import WantBuyView from '@/views/WantBuyView.vue'
import PublishWantBuyView from '@/views/PublishWantBuyView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '首页', requiresTabBar: true }
  },
  {
    path: '/category',
    name: 'category',
    component: CategoryView,
    meta: { title: '分类', requiresTabBar: true }
  },
  {
    path: '/publish',
    name: 'publish',
    component: PublishView,
    meta: { title: '发布' }
  },
  {
    path: '/message',
    name: 'message',
    component: MessageView,
    meta: { title: '消息', requiresTabBar: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { title: '我的', requiresTabBar: true }
  },
  {
    path: '/product/:id',
    name: 'productDetail',
    component: ProductDetailView,
    meta: { title: '商品详情' }
  },
  {
    path: '/products',
    name: 'productList',
    component: ProductListView,
    meta: { title: '商品列表' }
  },
  {
    path: '/want-buy',
    name: 'wantBuy',
    component: WantBuyView,
    meta: { title: '求购专区' }
  },
  {
    path: '/publish-want-buy',
    name: 'publishWantBuy',
    component: PublishWantBuyView,
    meta: { title: '发布求购' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '闲品'
  next()
})

export default router
