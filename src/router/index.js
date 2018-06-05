import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:engine/:id',
      component: resolve => require(['../views/ReportShow.vue'], resolve)
    }
  ]
})
