// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import deepClone from './utils/deepClone.js'
import http from './utils/http.js'


Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$http= http
Vue.prototype.$Clone = deepClone

Vue.directive('drag',//自定义指令                                      JS
        {bind:function (el, binding) {
                let oDiv = el;   //当前元素
                let self = this;  //上下文
                oDiv.onmousedown = function (e) {
                 //鼠标按下，计算当前元素距离可视区的距离
                    let disX = e.clientX - oDiv.offsetLeft;
                    let disY = e.clientY - oDiv.offsetTop;

                    document.onmousemove = function (e) {
                      //通过事件委托，计算移动的距离 
                        let l = e.clientX - disX;
                        let t = e.clientY - disY;
                      //移动当前元素  
                        oDiv.style.left = l + 'px';
                        oDiv.style.top = t + 'px';
                         //将此时的位置传出去
                        binding.value({x:e.pageX,y:e.pageY})
                    };
                    document.onmouseup = function (e) {
                    
                        document.onmousemove = null;
                        document.onmouseup = null;
                     };
                };
            }
        }
);

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
