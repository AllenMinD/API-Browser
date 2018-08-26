import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import store from './store/store';
import TreeView from 'vue-json-tree-view';
// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// 引入vue-easytable样式、table 和 分页组件
import 'vue-easytable/libs/themes-base/index.css';
import {VTable,VPagination} from 'vue-easytable';

// vue-easytable
Vue.component(VTable.name, VTable);
Vue.component(VPagination.name, VPagination);

// fontawesome
library.add(faCoffee);
library.add(faUser);
library.add(faAt);
library.add(faBullhorn);
library.add(faLink);
library.add(faStar);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(TreeView);

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App)
})
