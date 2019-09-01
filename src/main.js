import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { getCookie } from './utils/cookie'

Vue.use(ElementUI)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  let uid = getCookie('uid')
  let userInfo = getCookie('userInfo') ? JSON.parse(getCookie('userInfo')) : ''
  store.state.userInfo = userInfo
  if (!uid && to.fullPath !== '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})
let app = new Vue({
  router,
  store,
  render: (h) => h(App)
})

app.$mount('#app')
