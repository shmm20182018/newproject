import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:pc/:engine/:id',
      component: resolve => require(['../views/ReportShow.vue'], resolve)
    },
    {
      path: '/define',
      component: resolve => require(['../define/DataDefine.vue'], resolve)
    }
  ]
})
