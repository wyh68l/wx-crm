import Vue from 'vue'
import App from './App'
import store from './store/index'
import mixins from './mixins';

import './static/css/icon-font.css'
import './static/css/style.css'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.mixin(mixins);
Vue.prototype.$store = store;

const app = new Vue({
  ...App,
  store
})
app.$mount()






































