// pages/login/login.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isActive1: '',
    isActive2: '',
    username: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  // 表单获取到焦点时，改变表单样式
  highlightOn(e) {
    const that = this;
    let inputNum = e.currentTarget.dataset.inputnum;
    if (inputNum == '1') {
      that.setData({
        isActive1: 'active',
        isActive2: ''
      });
    } else {
      that.setData({
        isActive1: '',
        isActive2: 'active'
      });
    }
  },

  // 表单失去焦点时，取消表单样式
  highlightOff() {
    const that = this;
    that.setData({
      isActive1: '',
      isActive2: ''
    });
  },

  // 监听输入用户名
  inputUsername(e) {
    const that = this;
    that.setData({
      username: e.detail.value
    });
  },

  // 监听输入密码
  inputPassword(e) {
    const that = this;
    that.setData({
      password: e.detail.value
    });
  },

  // 登录（调用全局登录函数）
  login() {
    const that = this;
    let username = that.data.username;
    let password = that.data.password;
    app.login(username, password);
  },

  // 返回探索页面
  backTo() {
    wx.switchTab({
      url: '../explore/explore',
    })
  }
})