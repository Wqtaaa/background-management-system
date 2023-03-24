import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router'
import store from './store'
import './api/mock'
import Cookie from "js-cookie";

Vue.use(ElementUI);

//添加全局前置路由守卫

router.beforeEach((to, from, next) => {
  // 判断token存不存在
  const token = Cookie.get('token')
  //token不存在，说明用户是未登录状态，应该跳转至登录页
  if (!token && to.name !== 'login') {
    next({ name: 'login' })
  } else if (token && to.name === 'login') {
    next({ name: 'home' })
  } else {
    next()
  }
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created() {
    store.commit('addMenu', router)
  }
});