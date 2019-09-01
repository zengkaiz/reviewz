import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'projectList',
      component: () => import(/* webpackChunkName: "about" */ './views/projectList.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "about" */ './views/login.vue')
    },
    {
      path: '/login',
      name: 'register',
      component: () => import(/* webpackChunkName: "about" */ './views/login.vue')
    },
    {
      path: '/personalCenter',
      name: 'personalCenter',
      component: () => import(/* webpackChunkName: "about" */ './views/personalCenter.vue')
    },
    {
      path: '/projectVideo/:pid',
      name: 'projectVideo',
      component: () => import(/* webpackChunkName: "about" */ './views/projectVideo.vue')
    },
    {
      path: '/videoDetail/:vid',
      name: 'videoDetail',
      component: () => import(/* webpackChunkName: "about" */ './views/videoDetail/index.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import(/* webpackChunkName: "about" */ './views/test.vue')
    }
  ]
})
