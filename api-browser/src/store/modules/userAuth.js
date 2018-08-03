import axios from 'axios';
import router from '../../router';
var qs = require('qs');

var reqUrl = 'http://localhost:3000';

var state = {
  token: null,
  userName: null,
  userId: null,
  email: '',
  profile: ''
};

var getters = {
  isAuth: function(state) {
    return state.token?true:false;
  },
  getUserName: function(state) {
    return state.userName;
  },
  getToken: function(state) {
    return state.token;
  },
  getEmail: function(state) {
    return state.email;
  },
  getProfile: function(state) {
    return state.profile;
  }
};

var mutations = {
  authUser: function(state, data) {
    state.token = data.token;
    state.userName = data.userName;
    state.userId = data.userId;
  },
  clearAuth: function(state) {
    state.token = null;
    state.userName = null;
    state.userId = null;
  }
};

var actions = {
  signup: function(context, formData) {
    axios.post(reqUrl + '/api/signup', qs.stringify({
      name: formData.name,
      password: formData.password
    }),{ 
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      // console.log('注册：', res);
      if (res.data.success) {
        alert('注册成功');
        router.replace('/signin');
      } else {
        alert(res.data.message);
      }
    }).catch(function(error) {console.log(error);});
  },
  signin: function(context, formData) {
    axios.post(reqUrl + '/api/signin', qs.stringify({
      name: formData.name,
      password: formData.password
    }), {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      // console.log('登录：', res);
      if (res.data.success) {
        alert('登录成功');
        var now = new Date();
        var expirationDate = new Date(now.getTime() + res.data.expiresIn);
        var resData = {
          token: res.data.token,
          userName: res.data.name,
          userId: res.data.userId,
          expiresIn: res.data.expiresIn,
          expirationDate: expirationDate
        };
        context.commit('authUser', resData);
        context.dispatch('setLocalStorage', resData);
        context.dispatch('expiresTimeout', resData.expiresIn);
        router.replace('/');
      } else {
        alert(res.data.message);
      }
    }).catch(function(error) {console.log(error)});
  },

  setLocalStorage: function(context, data) {
    localStorage.setItem('username', data.userName);
    localStorage.setItem('userid', data.userId);
    localStorage.setItem('token', data.token);
    localStorage.setItem('expirationDate', data.expirationDate);
  },

  clearLocalStorage: function(context) {
    localStorage.removeItem('username');
    localStorage.removeItem('userid');
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  },

  logOut: function(context) {
    context.dispatch('clearLocalStorage');
    context.commit('clearAuth');
    router.replace('/signin');
  },

  tryAutoLogIn: function(context) {
    var token = localStorage.getItem('token');
    if (!token) {
      router.replace('/signin');
      return;
    }
    var expirationDate = localStorage.getItem('expirationDate');
    var now = new Date();
    if (now.toString() >= expirationDate) {
      router.replace('/signin');
      return;
    }
    var expiresIn = new Date(new Date(expirationDate).getTime() - now.getTime());
    var username = localStorage.getItem('username');
    var userid = localStorage.getItem('userid');
    var data = {
      token: token,
      userName: username,
      userId: userid,
      expiresIn: expiresIn,
      expirationDate: expirationDate
    };
    context.commit('authUser', data);
    context.dispatch('expiresTimeout', expiresIn);
  },

  expiresTimeout: function(context, expiresIn) {
    setTimeout(function() {
      axios.post(reqUrl + '/api/resignin', qs.stringify({
        name: context.getters.getUserName 
      }), {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(res) {
        console.log('重新登录返回的结果：', res);
        var now = new Date();
        var expirationDate = new Date(now.getTime() + res.data.expiresIn);
        if (res.data.success) {
          var resData = {
            token: res.data.token,
            userName: res.data.name,
            userId: res.data.userId,
            expiresIn: res.data.expiresIn,
            expirationDate: expirationDate
          };
          context.commit('authUser', resData);
          context.dispatch('setLocalStorage', resData);
          context.dispatch('expiresTimeout', resData.expiresIn);
        } else {
          console.log(res.data.message);
        }
      }).catch(function(error) {console.log(error)});
    }, expiresIn);
  }

};

export default {
  state,
  getters,
  mutations,
  actions
}