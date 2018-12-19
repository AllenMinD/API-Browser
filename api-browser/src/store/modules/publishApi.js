var state = {
  active: 0,
  api: {
    name: '',
    tags: [],
    summary: '',
    url: '',
    method: '',
    params: [],
    pageObj: null
  }
};

var getters = {
  getActive: function(state) {
    return state.active;
  },
  getPublishingApi: function(state) {
    return state.api;
  },
  getPageObj: function(state) {
    return state.api.pageObj;
  }
};

var mutations = {
  clearApiState: function(state) {
    state.api = {
      name: '',
      tags: [],
      summary: '',
      url: '',
      method: '',
      params: [],
      pageObj: null
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
  saveApiBaseInfo: function(state, formData) {
    state.api.name = formData.name;
    state.api.tags = formData.tags;
    state.api.summary = formData.summary;
  },
  saveApiOptions: function(state, formData) {
    state.api.url = formData.url;
    state.api.method = formData.method;
    // state.api.header = formData.header;
    state.api.params = formData.params;
  },
  savePageObj: function(state, pageObj) {
    state.api.pageObj = pageObj;
  }
};

var actions = {

};

export default {
  state,
  getters,
  mutations,
  actions
};