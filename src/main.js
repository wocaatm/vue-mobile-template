import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { flexible } from './util/flexible';

Vue.config.productionTip = false

flexible(window, document);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
