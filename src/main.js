import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import "@/assets/css/reset.css"
import MyHttp from './plugins/http'
import store from '@/vuex/store'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

Vue.use(ElementUI)
Vue.use(MyHttp)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
