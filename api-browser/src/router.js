import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store/store';

import Home from './components/Home.vue';
import Signin from './components/auth/Signin.vue';
import Signup from './components/auth/Signup.vue';
// import Publish from './components/publishApi/Publish.vue';
import Publish from './components/publishApi/PublishAPI.vue';
import Profile from './components/profile/Profile.vue';
import UseApi from './components/useApi/UseApi.vue';
import UpdateApi from './components/updateApi/UpdateApi.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', components: {
    'Home': Home
  }, name: 'Home' },
  { path: '/signin', component: Signin },
  { path: '/signup', component: Signup },
  { path: '/publish', 
    component: Publish, 
    beforeEnter: function(to, from, next) {
      if (localStorage.getItem('token')) {
        next();
      } else {
        next('/signin');
      }
    }
  },
  { path: '/profile/:username', component: Profile },
  { path: '/useapi/:apiId', component: UseApi, props: true },
  { path: '/updateapi/:apiId', component: UpdateApi, props: true }
];

export default new VueRouter({
  mode: 'history',
  routes: routes
});