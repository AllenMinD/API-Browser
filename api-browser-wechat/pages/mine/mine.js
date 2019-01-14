// pages/mine/mine.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curTab: 0,
    myStars: [],
    myApis: [],
    curPage_star: 0,  // 我的收藏的当前页
    lastId_myapi: '',  // 我的api列表每次分页返回api列表的最后一个api的_id
    loadMoreTip_star: '上拉加载更多',
    loadMoreTip_myapi: '上拉加载更多'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
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

    // 初始化数据
    that.setData({
      curTab: parseInt(app.globalData.minePageStatus),
      myStars: [],
      myApis: [],
      curPage_star: 0,  // 我的收藏的当前页
      lastId_myapi: '',  // 我的api列表每次分页返回api列表的最后一个api的_id
    });

    that.getMyStars();
    that.getMyApis();
  },

  // 点击tab-menu
  onTap(e) {
    const that = this;
    let index = parseInt(e.currentTarget.dataset.index);
    if (that.data.curTab === index) {
      return;
    } else {
      that.setData({
        curTab: index
      });
    }
  },

  // 获取我的收藏
  getMyStars() {
    const that = this;
    let username = wx.getStorageSync('username');
    let pageSize = 5;
    let pageNo = that.data.curPage_star;
    wx.request({
      url: app.globalData.domain + `/api/getMyStars?username=${username}&pageNo=${pageNo}&pageSize=${pageSize}`,
      header: {
        'Authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log('调用getMyStars接口返回的结果:', res);
        if (res.data.success) {
          if (res.data.data.length == 0) {  // 已经是最后一页
            that.setData({
              loadMoreTip_star: '我也是有底线的'
            })
          } else {
            that.setData({
              loadMoreTip_star: '上拉加载更多'
            });
          }

          that.setData({
            myStars: that.data.myStars.concat(res.data.data),
            curPage_star: that.data.curPage_star + 1 
          });
        }
      }
    });
  },

  // 获取我的api
  getMyApis() {
    const that = this;
    let username = wx.getStorageSync('username');
    let pageSize = 5;
    let lastId = that.data.lastId_myapi;
    wx.request({
      url: app.globalData.domain + `/api/getMyApi?username=${username}&lastId=${lastId}&pageSize=${pageSize}`,
      header: {
        'Authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log('调用getMyApi接口返回的结果:', res);
        if (res.data.success) {
          if (res.data.data.length === 0 || res.data.data == null) {
            that.setData({
              loadMoreTip_myapi: '我也是有底线的'
            });
          } else {
            that.setData({
              loadMoreTip_myapi: '上拉加载更多'
            });
          }
          that.setData({
            myApis: that.data.myApis.concat(res.data.data),
            lastId_myapi: res.data.lastId
          });
        }
      }
    });
  },

  // 加载更多
  onLower(e) {
    const that = this;
    let curTab = e.currentTarget.dataset.curtab;
    if (curTab === 0) {  // 加载“我的收藏”列表
      that.getMyStars();
    } else {  // 加载“我的API”列表
      that.getMyApis();
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