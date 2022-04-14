import App from './App'
import store from './store/store.js'
// #ifndef VUE3
import Vue from 'vue'
import {
  $http
} from '@escook/request-miniprogram'
uni.$http = $http
$http.baseUrl = 'https://api-hmugo-web.itheima.net' //https://www.escook.cn/  https://api-hmugo-web.itheima.net
$http.beforeRequest = function(Option) {
  uni.showLoading({
    title: "数据加载中"
  })
}
$http.afterRequest = function() {
  uni.hideLoading()
}
uni.$showMsg = function(title = '数据加载失败', duration = 1500) {
  uni.showToast({
    duration,
    title,
    icon: 'none'
  })
}

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App,
  store,
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
