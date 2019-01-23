import axios from 'axios';
import router from '../../router';
var qs = require('qs');

// axios.defaults.baseURL = 'http://localhost:3000';
// axios.defaults.baseURL = 'http://120.79.220.199:3000';
axios.defaults.baseURL = 'https://allenxlab.cn:3000';

var state = {
  active: 0,
  api: {
    title: '',
    tags: [],
    summary: '',
    url: '',
    method: 'GET',
    params: [],
    viewOptions: null
  }
};

var getters = {
  getActive: function(state) {
    return state.active;
  },
  getPublishingApi: function(state) {
    return state.api;
  },
  getApiBaseInfo: function(state) {
    let apiBaseInfo = {
      title: state.api.title,
      tags: state.api.tags
    }
    return apiBaseInfo;
  },
  getApiOptions: function(state) {
    let apiOptions = {
      url: state.api.url,
      method: state.api.method,
      params: state.api.params,
      summary: state.api.summary
    }
    return apiOptions;
  },
  getViewOptions: function(state) {
    return state.api.viewOptions;
  }
};

var mutations = {
  clearApiState: function(state) {
    state.api = {
      title: '',
      tags: [],
      summary: '',
      url: '',
      method: 'GET',
      params: [],
      viewOptions: null
    }
  },
  addActive: function(state) {
    if (state.active++ > 2) state.active = 0;
  },
  subActive: function(state) {
    if (state.active-- <= 0) state.active = 0;
  },
  resetActive: function(state) {
    state.active = 0;
  },
  saveApiBaseInfo: function(state, formData) {  // 保存第一步的数据
    state.api.title = formData.title;
    state.api.tags = formData.tags;
  },
  saveApiOptions: function(state, formData) {  // 保存第二步的数据
    state.api.url = formData.url;
    state.api.method = formData.method;
    // state.api.header = formData.header;
    state.api.params = formData.params;
    state.api.summary = formData.summary;
  },
  saveViewOptions: function(state, formData) {  // 保存第三步的数据
    state.api.viewOptions = formData;
  }
};

var actions = {
  publishApi: function(context, data) {  // 发布api
    let Vue = data.Vue;
    let apiInfo = { 
      url: context.state.api.url,
      title: context.state.api.title,
      params: context.state.api.params,
      method: context.state.api.method,
      summary: context.state.api.summary,
      tags: context.state.api.tags,
      stars: 0,
      author: data.userName,
      viewOptions: context.state.api.viewOptions
    };
    console.log('前端发来想要发布的信息：\n', apiInfo);
    axios.post(
      '/api/publishApi',
      qs.stringify(apiInfo),
      { 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': localStorage.getItem('token')
        }
      }).then(function(res) {
        console.log('保存（发布）Api的结果：', res);
        if (res.data.success) {
          Vue.$message({
            message: "发布成功",
            type: "success"
          });
          router.replace('/useapi/' + res.data.saveRes._id);
        } else {
          alert(res.data.message);
        }
      }).catch(function(err) {
        console.log(err)
        Vue.$message({
          message: "哎呀，token失效了，请重新登录",
          type: "error"
        });
        context.commit('clearAuth');
        router.replace('/signin');
      }
    );
  },
};

export default {
  state,
  getters,
  mutations,
  actions
};