// pages/personal/personal.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    email: '无',
    summary: '这个人很懒，什么都没有说。',
    apiCount: 0,
    starCount: 0
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
    that.getUserInfo();  // 获取用户信息
  },

  // 获取用户信息
  getUserInfo() {
    const that = this;
    let username = wx.getStorageSync('username');
    let token = wx.getStorageSync('token');
    // 用户名
    that.setData({
      username: username
    });

    // 我的api数量
    wx.request({
      url: app.globalData.domain + '/api/getMyApi?username=' + username,
      header: {
        'Authorization': token
      },
      success(res) {
        console.log('调用/getMyApi接口返回的结果：', res);
        if (res.data.success) {
          that.setData({
            apiCount: res.data.data.length
          });
        }
      }
    });

    // 我的star
    wx.request({
      url: app.globalData.domain + '/api/getMyStars?username=' + username,
      header: {
        'Authorization': token
      },
      success(res) {
        console.log('调用/getMyStars接口返回的结果：', res);
        if (res.data.success) {
          that.setData({
            starCount: res.data.data.length
          });
        }
      }
    })
  },

  // 跳转到“我的”Tab
  gotoMine(e) {
    const that = this;
    let pagestatus = e.currentTarget.dataset.pagestatus;
    app.globalData.minePageStatus = pagestatus;
    wx.switchTab({
      url: '/pages/mine/mine'
    });
  },

  // 登出
  logout() {
    const that = this;
    app.logOut();
  }
})