import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'lib-flexible'
// import VConsole from 'vconsole/dist/vconsole.min.js'
import 'normalize.css/normalize.css'
import 'element-ui/lib/theme-chalk/index.css';

// let vConsole = new VConsole()
Vue.use(ElementUI)
// Vue.use(ElementUI,vConsole)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
