// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'


import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'
import 'vue-easytable/libs/themes-base/index.css'

import {VTable,VPagination} from 'vue-easytable'


Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)
Vue.use(ElementUI);

Vue.config.productionTip = false
Vue.prototype.$axios = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
