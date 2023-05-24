import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// 解决重复导航一个地址报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

// 路由懒加载
const Login = () => import('@/views/login')
const Layout = () => import('@/views/layout')
const Article = () => import('@/views/article')
const DashBoard = () => import('@/views/dashboard')

const routes = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      { path: '/dashboard', component: DashBoard },
      { path: '/article', component: Article }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 访问登录页直接放行
  if (to.path === '/login')next()
  else {
    // 访问的不是登录页，判断是否登录
    if (store.state.user.token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
