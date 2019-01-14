//app.js
App({
  onLaunch: function () {
    const that = this;
    
    // 进入小程序的时候，尝试自动登录
    that.tryAutoLogin();

    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },

  // 登录
  login(username, password) {
    const that = this;
    let data = {
      name: username,
      password: password
    };
    console.log('提交的数据', data);
    wx.request({
      url: that.globalData.domain + '/api/signin',
      method: 'POST',
      header: { 'content-Type': 'application/x-www-form-urlencoded' },
      data: data,
      success(res) {
        console.log('调用/signin接口返回的结果：', res);
        if (res.data.message === '登录成功') {
          wx.showToast({
            title: res.data.message,
            mask: true
          });

          let now = new Date();
          let expirationDate = new Date(now.getTime() + res.data.expiresIn);  // 计算token过期日期
          // console.log(expirationDate);
          wx.setStorageSync('username', res.data.name);
          wx.setStorageSync('userId', res.data.userId);
          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('expiresIn', res.data.expiresIn);  // token过期限时（30分钟）
          wx.setStorageSync('expirationDate', expirationDate);  // token过期日期

          // 登录成功，对token有效期进行倒数计时
          that.expiresTimeout(res.data.expiresIn);  // token计时
          // 跳转到探索页面
          wx.switchTab({
            url: '/pages/explore/explore',
          });
        } else {
          wx.showModal({
            title: '登录失败',
            content: res.data.message,
            confirmColor: '#409eff',
            showCancel: false
          })
        }
      }
    })
  },

  // 自动登录
  tryAutoLogin() {
    const that = this;
    let token = wx.getStorageSync('token');
    if (!token) {  // 没有token，自动登录失败，退回登录页
      // 跳回登录页面
      wx.reLaunch({
        url: '/pages/login/login',
      });
      return;
    }

    let expirationDate = wx.getStorageSync('expirationDate');
    let now = new Date();
    if (now.toString() >= expirationDate) {  // token已经过期，自动登录失败，返回登录页
      // 跳回登录页面
      wx.reLaunch({
        url: '/pages/login/login',
      });
      return;
    }

    let expiresIn = new Date(new Date(expirationDate).getTime() - now.getTime());
    // 自动登录成功，并开始对token有效期进行倒数计时
    that.expiresTimeout(expiresIn);  // token计时
    // 跳转到探索页面
    wx.switchTab({
      url: '/pages/explore/explore',
    });
  },

  // token有效期倒数计时
  expiresTimeout(expiresIn) {
    const that = this;
    let data = {
      name: wx.getStorageSync('username')
    }
    setTimeout(() => {  // 计时结束后，调用/resignin接口，重新获取新的token
      wx.request({
        url: that.globalData.domain + '/api/resignin',
        method: 'POST',
        header: { 'content-Type': 'application/x-www-form-urlencoded' },
        data: data,
        success(res) {
          console.log('重新登录返回的结果：', res);
          if (res.data.success) {
            let now = new Date();
            let expirationDate = new Date(now.getTime() + res.data.expiresIn);
            wx.setStorageSync('username', res.data.name);
            wx.setStorageSync('userId', res.data.userId);
            wx.setStorageSync('token', res.data.token);
            wx.setStorageSync('expiresIn', res.data.expiresIn);  // token过期限时（30分钟）
            wx.setStorageSync('expirationDate', expirationDate);  // token过期日期
            // 自动登录成功，重新开始计时
            that.expiresTimeout(res.data.expiresIn);  // token计时  
          } else {
            console.log(res.data.message);
          }
        }
      })
    }, expiresIn);
  },

  // 登出
  logOut() {
    // 清理缓存
    wx.removeStorageSync('username');
    wx.removeStorageSync('userId');
    wx.removeStorageSync('token');
    wx.removeStorageSync('expiresIn');
    wx.removeStorageSync('expirationDate');

    // 跳回登录页面
    wx.reLaunch({
      url: '/pages/login/login',
    });
  },

  globalData: {
    userInfo: null,
    domain: "http://localhost:3000",
    minePageStatus: 0,  // “我的（mine）”页面的状态，0表示显示“我的star”，1表示显示“我的api”
  }
})