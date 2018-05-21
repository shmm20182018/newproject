import Vue from 'vue'
import Router from 'vue-router'
import ServerTable from '@/components/ServerTable'




Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ServerTable',
      component: ServerTable,
      props: (route) => ({ id: route.params.id,engine:'TJCX'}) 
    },
    {
      path: '/TJCX/:id',
      name: 'ServerTable',
      component: ServerTable,
      props: (route) => ({ id: route.params.id,engine:'TJCX'}) 
    }
  ]
})
