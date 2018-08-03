import axios from 'axios';
import router from '../../router';
var qs = require('qs');

axios.defaults.baseURL = 'http://localhost:3000';

var state = {
  isTesting: false,
  api: {
    title: null,
    url: null,
    params: null,
    method: null,
    summary: null,
    tags: null,
    stars: null
  },
  dataFromApi: null,
  testLoading: false,
  allApisList: [],
  searchApisList: []
};

var getters = {
  getApi: function(state) {
    return state.api;
  },
  isTest: function(state) {
    return state.isTesting;
  },
  getDataFromApi: function(state) {
    return state.dataFromApi;
  },
  getTestLoading: function(state) {
    return state.testLoading;
  },
  getAllApisList: function(state) {
    return state.allApisList;
  },
  getSearchApisList: function(state) {
    return state.searchApisList;
  }
};

var mutations = {
  storeApi: function(state, data) {
    state.api.title = data.title;
    state.api.url = data.url;
    state.api.params = data.params;
    state.api.method = data.method;
    state.api.summary = data.summary;
    state.api.tags = data.tags;
    state.api.stars = data.stars;
  },
  changeTestState: function(state) {
    state.isTesting = !state.isTesting;
  },
  setDataFromApi: function(state, data) {
    state.dataFromApi = data;
  },
  setTestLoadingTrue: function(state) {
    state.testLoading = true;
  },
  setTestLoadingFalse: function(state) {
    state.testLoading = false;
  },
  clearDataFromApi: function(state) {
    state.dataFromApi = null;
  },
  resetTestState: function(state) {
    state.isTesting = false;
  },
  setAllApisList: function(state, apiList) {
    state.allApisList = apiList;
  },
  setSearchApisList: function(state, apiList) {
    state.searchApisList = apiList;
  }
};

var actions = {
  storeApiToVuex: function(context, formData) {
    context.commit('storeApi', formData);
  },
  testApi: function(context, apiInfo) {
    axios.post(
      '/api/testApi', 
      qs.stringify(apiInfo),
      { headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': localStorage.getItem('token')
        }
      }
      ).then(function(res) {
        console.log(res);
        console.log('第三方api返回的数据', JSON.parse(res.data.data));
        if (!res.data.success) {
          alert('糟糕，后台出现了一些问题，测试失败~')
        }
        context.commit('setDataFromApi', JSON.parse(res.data.data));
        context.commit('setTestLoadingFalse');
      }).catch(function(error) {console.log(error);}
    );
  },
  publishApi: function(context, apiInfo, author) {
    // console.log('前端发来想要发布的信息：\n', apiInfo);
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
        if (!res.data.success) {
          alert('糟糕，后台数据插入出现了一些问题，API发布失败~')
        }
      }).catch(function(error) {console.log(error);}
    );
  },
  updateApi: function(context, apiInfo) {
    axios.post(
      '/api/updateApi',
      qs.stringify(apiInfo),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': localStorage.getItem('token')
        }
      }).then(function(res) {
        console.log('更新Api的结果', res);
        if (!res.data.success) {
          alert('糟糕，后台数据更新出现了一些问题，API更新失败~')
        }
      }).catch(function(error) {console.log(error);}
    );
  },
  deleteApi: function(context, apiId) {
    // apiId == { apiId: ... }
    axios.post(
      '/api/deleteapi',
      qs.stringify(apiId),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': localStorage.getItem('token')
        }
      }).then(function(res) {
        console.log('删除api的结果', res);
        if (!res.data.success) {
          alert('糟糕，后台数据库删除数据出现了一些问题，API删除失败~')
        }
        router.replace('/profile/' + context.getters.getUserName);
      }).catch(function(err) {console.log(err)}
    );
  },
  collectApi: function(context, apiIdAndUsername) {
    if (apiIdAndUsername.username == null) {
      router.replace('/signin');
      return;
    }
    axios.post(
      '/api/collectApi',
      qs.stringify(apiIdAndUsername),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': localStorage.getItem('token')
        }
      }).then(function(res) {
        console.log('收藏api的结果', res);
        if (!res.data.success) {
          alert('糟糕，后台数据库删除数据出现了一些问题，API收藏失败~')
        }
      }).catch(function(err) {console.log(err)}
    );
  },
  cancelCollectApi: function(context, apiIdAndUsername) {
    if (apiIdAndUsername.username == null) {
      router.replace('/signin');
      return;
    }
    axios.post(
      '/api/cancelCollectApi',
      qs.stringify(apiIdAndUsername),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': localStorage.getItem('token')
        }
      }).then(function(res) {
        console.log('取消收藏api的结果', res);
        if (!res.data.success) {
          alert('糟糕，后台数据库删除数据出现了一些问题，取消API收藏失败~')
        }
      }).catch(function(err) {console.log(err)}
    );
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}