import axios from 'axios';
import router from '../../router';
var qs = require('qs');

axios.defaults.baseURL = 'http://localhost:3000';
// axios.defaults.baseURL = 'http://120.79.220.199:3000';

var state = {
  isTesting: false,
  isFullPage: false,
  api: {
    title: null,
    url: null,
    params: null,
    method: null,
    summary: null,
    tags: null,
    stars: null,
    allProperties: [],
    showProperties: []
  },
  dataFromApi: null,
  testLoading: false,
  allApisList: [],
  searchApisList: [],
  tagApisList: [],
  reqUrl: 'http://localhost:3000',
  // reqUrl: 'http://120.79.220.199:3000',
};

var getters = {
  getApi: function(state) {
    return state.api;
  },
  isTest: function(state) {
    return state.isTesting;
  },
  getDataFromApi: function(state) {
    var temp = state.dataFromApi;
    if (!temp) {
      return null;
    } else if (Array.isArray(temp)) {  // 若返回的数据直接是一个数组，就用一个对象去包裹它
      var obj = { data: null };
      obj.data = temp;
      return obj;
    } else {
      return temp;
    }
  },
  getTestLoading: function(state) {
    return state.testLoading;
  },
  getAllApisList: function(state) {
    return state.allApisList;
  },
  getSearchApisList: function(state) {
    return state.searchApisList;
  },
  getIsFullPage: function(state) {
    return state.isFullPage;
  },
  getReqUrl: function(state) {
    return state.reqUrl;
  },
  getTagApisList: function(state) {
    return state.tagApisList;
  },
  getAllProperties: function(state) {
    return state.api.allProperties;
  },
  getShowProperties: function(state) {
    return state.api.showProperties;
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
    state.api.allProperties = data.allProperties;
    state.api.showProperties = data.showProperties;
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
  },
  setIsFullPage: function(state, isFullPage) {
    state.isFullPage = isFullPage;
  },
  setTagApisList: function(state, apiList) {
    state.tagApisList = apiList;
  },
  setAllProperties: function(state, allProperties) {
    state.api.allProperties = allProperties;
  },
  setShowProperties: function(state, showProperties) {
    state.api.showProperties = showProperties;
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
          // 'Authorization': localStorage.getItem('token')
        }
      }
      ).then(function(res) {
        console.log(res);
        if (!res.data.success || res.data.data.indexOf('<!DOCTYPE') !== -1) {
          alert('请求发送失败，具体原因请到浏览器控制台查看');
          console.log('第三方服务器返回的错误：', res.data.data);
        } else {
          console.log('第三方api返回的数据', JSON.parse(res.data.data));
          context.commit('setDataFromApi', JSON.parse(res.data.data));
        }
        context.commit('setTestLoadingFalse');
      }).catch(function(error) {console.log(error);}
    );
  },
  publishApi: function(context, apiInfo) {
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
        if (!res.data.success) {
          alert(res.data.message);
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
  },
  sendBackData : function(context, data) {
    axios.post(
      '/api/sendBackData', 
      qs.stringify(data),
      { headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': localStorage.getItem('token')
        }
      }
      ).then(function(res) {
        console.log('服务器响应', res);
        alert(res.data.message);
      }).catch(function(error) {console.log(error);}
    );
  },
};

export default {
  state,
  getters,
  mutations,
  actions
}