import 'font-awesome/css/font-awesome.css'
import "vue-select/dist/vue-select.css"
import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import './config/msgs'
import './config/axios'
import './config/mq'

import store from './config/store'
import router from './config/router'

// mascara do input
import { VueMaskDirective } from "v-mask"
Vue.directive("mask", VueMaskDirective)


Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')