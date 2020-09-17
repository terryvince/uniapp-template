import Vue from 'vue'
import Router from '@/libs/router.js'

Vue.use(Router)

const router = new Router();

router.beforeEach((to,from,next)=>{
  console.log('路由前置钩子拦截：',to,from)
  next()
})

router.afterEach((to,from)=>{
  console.log('路由后置钩子拦截：', router._route.path)
})

export default router