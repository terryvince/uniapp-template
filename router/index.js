import Vue from 'vue'
import Router from '@/libs/router.js'

Vue.use(Router)

const router = new Router();

// 拦截器无法拦截首次进入的页面，因为不是直接通过$router api跳转的，无法监测
router.beforeEach(async (to,from,next)=>{
  // console.log('路由前置钩子拦截：',to,from)
  next()
})

router.afterEach((to,from)=>{
  console.log('路由后置钩子拦截：', router._route.path)
})

export default router