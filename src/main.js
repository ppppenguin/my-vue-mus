// Babel 默认只转换新的 JavaScript 语法，而不转换新的 API。例如，Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转译。
// 如果想使用这些新的对象和方法，必须使用 babel-polyfill，为当前环境提供一个垫片。
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
// 解决移动端点击事件延迟300ms用的
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
// 引入样式预处理器
import 'common/stylus/index.styl'

// 初始化fastclick
fastclick.attach(document.body)
// 注册插件
Vue.use(VueLazyLoad,{
  loading:require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})


