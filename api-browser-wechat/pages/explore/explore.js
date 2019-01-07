// pages/explore/explore.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab0',
    tabs: [
      {
        key: 'tab0',
        title: '全部',
      },
      {
        key: 'tab1',
        title: '排行榜',
      },
      {
        key: 'tab2',
        title: '发布者',
      },
    ],

    swiperHeight: 0,  // swiper的高度
    allApis: [],  // 全部Api列表
    topTenApis: [],  // 排行前十的Api
  },

  onShow() {
    const that = this;

    that.getAllApis();  // 获取全部Api
    that.getTopTenApis();  // 获取排名前十的Api
  },

  // 点击改变Tabs
  onTabsChange(e) {
    const that = this;
    console.log('onTabsChange', e)
    const { key } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)

    // 根据Tabs内容来设置swiper的高度
    let swiperHeight_temp = ''; 
    if (index === 0) {
      swiperHeight_temp = that.data.allApis.length * 205;
    } else if (index === 1) {
      swiperHeight_temp = that.data.topTenApis.length * 205;
    } else {
      swiperHeight_temp = '200rpx';
    }

    this.setData({
      key,
      index,
      swiperHeight: swiperHeight_temp
    })
  },

  // 根据Tabs的改变而改变显示的内容
  onSwiperChange(e) {
    console.log('onSwiperChange', e)
    const { current: index, source } = e.detail
    const { key } = this.data.tabs[index]

    if (!!source) {
      this.setData({
        key,
        index,
      })
    }
  },

  // 获取所有Api
  getAllApis() {
    const that = this;
    wx.request({
      url: app.globalData.domain + '/api/getAllApis',
      success(res) {
        console.log('调用getAllApis接口返回的结果：', res);
        if (res.data.success) {
          that.setData({
            allApis: res.data.data,
            swiperHeight: res.data.data.length * 205  // 初始化swiper高度
          });
        }
      }
    });
  },

  // 获取排名前十的Api
  getTopTenApis() {
    const that = this;
    wx.request({
      url: app.globalData.domain + '/api/getTopApis',
      success(res) {
        console.log('调用getTopApis接口返回的结果：', res);
        if (res.data.success) {
          that.setData({
            topTenApis: res.data.data
          });
        }
      }
    });
  },

  // 跳转到搜索页
  goSearchPage() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }

})