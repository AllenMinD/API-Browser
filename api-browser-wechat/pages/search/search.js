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
    resultList: [],  // 搜索结果列表,
    lastId_keyword: '',  //  根据关键字搜索回来的api列表每次分页返回api列表的最后一个api的_id
    lastId_tag: '',  //  根据标签搜索回来的api列表每次分页返回api列表的最后一个api的_id
    loadMoreTip: '上拉加载更多',
    searchType: null  // 搜索类型（0:根据“关键字”, 1:根据“标签”）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight + 150
        })
      }
    })
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
      searchKeyword: keyword,
      resultList: [],  // 清空列表
      lastId_keyword: '',  // 清空lastId
      searchType: 0
    });
    let lastId = that.data.lastId_keyword;
    let pageSize = 5;
    wx.request({
      url: app.globalData.domain + `/api/search?keyword=${keyword}&pageSize=${pageSize}&lastId=${lastId}` ,
      success(res) {
        console.log('调用search接口返回的结果：', res);
        if (res.data.success) {
          if (res.data.data.length === 0 || res.data.data == null) {
            that.setData({
              loadMoreTip: '我也是有底线的'
            })
          } else {
            that.setData({
              loadMoreTip: '上拉加载更多'
            })
          }
          that.setData({
            resultList: res.data.data,
            showingApi: true,
            lastId_keyword: res.data.lastId
          });
        }
      }
    })
  },

  // 根据关键字搜索api（加载更多）
  searchByKeyword_loadMore() {
    const that = this;
    let lastId = that.data.lastId_keyword;
    let pageSize = 5;
    wx.request({
      url: app.globalData.domain + `/api/search?keyword=${that.data.searchKeyword}&pageSize=${pageSize}&lastId=${lastId}`,
      success(res) {
        console.log('调用search接口返回的结果：', res);
        if (res.data.success) {
          if (res.data.data.length === 0 || res.data.data == null) {
            that.setData({
              loadMoreTip: '我也是有底线的'
            })
          } else {
            that.setData({
              loadMoreTip: '上拉加载更多'
            })
          }
          that.setData({
            resultList: that.data.resultList.concat(res.data.data),
            showingApi: true,
            lastId_keyword: res.data.lastId
          });
        }
      }
    })
  },

  // 根据标签搜索api
  searchByTag(e) {
    const that = this;
    let tag = e.currentTarget.dataset.tag;
    that.setData({
      tag: tag,
      resultList: [],  // 清空结果数组
      lastId_tag: '',  // 清空lastId
      searchType: 1
    });
    let pageSize = 5;
    let lastId = that.data.lastId_tag;
    wx.request({
      url: app.globalData.domain + `/api/getApiByTag?tag=${tag}&pageSize=${pageSize}&lastId=${lastId}`,
      success(res) {
        console.log('调用getApiByTag接口返回的结果：', res);
        if (res.data.success) {
          if (res.data.data.length === 0 || res.data.data == null) {
            that.setData({
              loadMoreTip: '我也是有底线的'
            })
          } else {
            that.setData({
              loadMoreTip: '上拉加载更多'
            })
          }
          that.setData({
            resultList: res.data.data,
            showingApi: true,
            lastId_tag: res.data.lastId
          });
        }
      }
    })
  },

  // 根据标签搜索api（加载更多）
  searchByTag_loadMore(e) {
    const that = this;
    let tag = that.data.tag;
    let pageSize = 5;
    let lastId = that.data.lastId_tag;
    wx.request({
      url: app.globalData.domain + `/api/getApiByTag?tag=${tag}&pageSize=${pageSize}&lastId=${lastId}`,
      success(res) {
        console.log('调用getApiByTag接口返回的结果：', res);
        if (res.data.success) {
          if (res.data.data.length === 0 || res.data.data == null) {
            that.setData({
              loadMoreTip: '我也是有底线的'
            })
          } else {
            that.setData({
              loadMoreTip: '上拉加载更多'
            })
          }
          that.setData({
            resultList: that.data.resultList.concat(res.data.data),
            showingApi: true,
            lastId_tag: res.data.lastId
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
      searchKeyword: '',
      resultList: [], // 点返回键时，清空搜索结果数组
      lastId_keyword: '',  // 清空lastId记录
      lastId_tag: '',  // 清空lastId记录
    });
  },

  // 滚动加载更多
  onLower(e) {
    const that = this;
    let searchType = that.data.searchType;
    if (searchType === 0) {  //  “根据关键搜索”加载更多
      that.searchByKeyword_loadMore();
    } else {  // “根据标签搜索”加载更多
      that.searchByTag_loadMore();
    }
  },

  // 跳转到使用api页面
  gotoUseApi(e) {
    const that = this;
    let apiId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/useapi/useapi?apiId=${apiId}`,
    })
  }
})