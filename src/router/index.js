import Vue from 'vue'
import VueRouter from 'vue-router'
// import {
//   localTake
// } from '../utils/baseTack'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'login',//login
        component: () => import('../views/login') //../views/login
    },
    {
        path: '/checkClientEnv',
        name: 'checkClientEnv',
        component: () => import('../views/checkClientEnv')
    },
    {
        path: '/index',
        name: 'Home',
        component: () => import('../views/index')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// router.beforeEach((to, from, next) => {
//   const nextRoute = ['Home']; // 需要登录的页面
//   let isLogin = localTake('userMsg'); // 判断是否登录，本地存储有用户数据则视为已经登录

//   if (nextRoute.indexOf(to.name) >= 0) {
//     if (!isLogin) {
//       return next('/login')
//     }
//   } else {
//     if (isLogin) {
//       next('/')
//       return
//     }
//   }
//   next()
// })

export default router