// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入全局重置样式
import "./assets/css/reset.css"

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import {get,post} from "./utils/http"

import APIs from "./API/index"

import echarts from 'echarts'
Vue.prototype.$echarts=echarts;

import store from "./store"
// 安装 element-ui 插件
Vue.use(ElementUI);



Vue.config.productionTip = false

// 全局注册数据请求的方法
Vue.prototype.$http= {
  get,
  post
}
Vue.prototype.$api= APIs
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
