import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/define/:id?',
      component: resolve => require(['../views/DataDefine.vue'], resolve)
    },
    {
      path: '/:pc/:engine/:id',
      component: resolve => require(['../views/ReportShow.vue'], resolve)
    }
  ]
})
