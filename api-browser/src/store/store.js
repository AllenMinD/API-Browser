import Vue from 'vue';
import Vuex from 'vuex';

import userAuth from './modules/userAuth';
import apiStore from './modules/apiStore';
import publishApi from './modules/publishApi';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    userAuth: userAuth,
    apiStore: apiStore,
    publishApi: publishApi
  }
});