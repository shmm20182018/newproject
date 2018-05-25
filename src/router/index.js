import Vue from 'vue'
import Router from 'vue-router'
import ChartShow from '@/components/ChartShow/ChartShow.vue'
import ServerTable from '@/components/ServerTable/ServerTable.vue'
import formval from '@/components/test/formval.vue'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ChartShow',
      component: ChartShow,
      props: (route) => ({ id: route.params.id,engine:'TJCX'}) 
    },
    {
      path: '/t',
      name: '',
      component: ServerTable
    },
    {
      path: '/f',
      name: '',
      component: formval
    },
    {
      path: '/TJCX/:id',
      name: 'ChartShow',
      component: ChartShow,
      props: (route) => ({ id: route.params.id,engine:'TJCX'}) 
    }
  ]
})
