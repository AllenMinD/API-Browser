// pages/mine/mine.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curTab: 0,
    myStars: [],
    myApis: []
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
      curTab: parseInt(app.globalData.minePageStatus)
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
    wx.request({
      url: app.globalData.domain + '/api/getMyStars?username=' + username,
      header: {
        'Authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log('调用getMyStars接口返回的结果:', res);
        if (res.data.success) {
          that.setData({
            myStars: res.data.data
          });
        }
      }
    });
  },

  // 获取我的api
  getMyApis() {
    const that = this;
    let username = wx.getStorageSync('username');
    wx.request({
      url: app.globalData.domain + '/api/getMyApi?username=' + username,
      header: {
        'Authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log('调用getMyApi接口返回的结果:', res);
        if (res.data.success) {
          that.setData({
            myApis: res.data.data
          });
        }
      }
    });
  }
})