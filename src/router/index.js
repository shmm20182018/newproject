import Vue from 'vue'
import Router from 'vue-router'
import ReportShow from '@/components/ReportShow/ReportShow.vue'
import ServerTable2 from '@/components/ServerTable/ServerTable2.vue'
import formval from '@/components/test/formval.vue'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:engine/:id',
      name: 'ReportShow',
      component: ReportShow,
      props: (route) => ({ id: route.params.id,engine:route.params.engine}) 
    },
    {
      path: '/t',
      name: '',
      component: ServerTable2
    },
    {
      path: '/f',
      name: '',
      component: formval
    },
    {
      path: '/TJCX/:id',
      name: 'ChartShow',
      component: ReportShow,
      props: (route) => ({ id: route.params.id,engine:'TJCX'}) 
    }
  ]
})
