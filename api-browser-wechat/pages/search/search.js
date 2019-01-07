// pages/search/search.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoFocus: false,
    showingApi: false,  // 正在显示搜索结果api列表
    searchKeyword: '',  // 搜索关键字
    topTags: [],  // 热门标签
    resultList: [],  // 搜索结果列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    that.setData({
      autoFocus: true
    });

    that.getTopTags();
  },

  // 获取热门标签
  getTopTags() {
    const that = this;
    wx.request({
      url: app.globalData.domain + '/api/getTopTags',
      success(res) {
        console.log('调用getTopTags接口返回的结果：', res);
        if (res.data.success) {
          that.setData({
            topTags: res.data.data
          });
        }
      }
    })
  },

  // 根据关键字搜索api
  searchByKeyword(e) {
    const that = this;
    let keyword = e.detail.value;
    that.setData({
      searchKeyword: keyword
    })
    wx.request({
      url: app.globalData.domain + '/api/search?keyword=' + keyword,
      success(res) {
        console.log('调用search接口返回的结果：', res);
        if (res.data.success) {
          that.setData({
            resultList: res.data.data,
            showingApi: true
          });
        }
      }
    })
  },

  // 根据标签搜索api
  searchByTag(e) {
    const that = this;
    let tag = e.currentTarget.dataset.tag;
    wx.request({
      url: app.globalData.domain + '/api/getApiByTag?tag=' + tag,
      success(res) {
        console.log('调用getApiByTag接口返回的结果：', res);
        if (res.data.success) {
          that.setData({
            resultList: res.data.data,
            showingApi: true
          });
        }
      }
    })
  },

  // 点击返回搜索首页按钮
  back() {
    const that = this;
    that.setData({
      showingApi: false,
      searchKeyword: ''
    });
  }
})