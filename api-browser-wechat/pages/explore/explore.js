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
      // {
      //   key: 'tab2',
      //   title: '发布者',
      // },
    ],

    allApis: [],  // 全部Api列表
    topTenApis: [],  // 排行前十的Api
    lastId_all: '',  // 全部api列表每次分页返回api列表的最后一个api的_id
    loadMoreTip: '上拉加载更多',
  },

  onLoad(options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight + 150
        })
      }
    })
  },

  onShow() {
    const that = this;

    // 初始化数据
    that.setData({
      allApis: [],  // 全部Api列表
      topTenApis: [],  // 排行前十的Api
      lastId_all: '',  // 全部api列表每次分页返回api列表的最后一个api的_id
    });

    that.getAllApis();  // 获取全部Api
    that.getTopTenApis();  // 获取排名前十的Api
  },

  // 点击改变Tabs
  onTabsChange(e) {
    const that = this;
    console.log('onTabsChange', e)
    const { key } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)

    this.setData({
      key,
      index,
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
    let pageSize = 5;
    let lastId = that.data.lastId_all;
    wx.request({
      url: app.globalData.domain + `/api/getAllApis?pageSize=${pageSize}&lastId=${lastId}`,
      success(res) {
        console.log('调用getAllApis接口返回的结果：', res);
        if (res.data.success) {
          if (res.data.data.length == 0 || res.data.data == null) {
            that.setData({
              loadMoreTip: '我也是有底线的'
            });
          } else {
            that.setData({
              loadMoreTip: '上拉加载更多'
            });
          }
          that.setData({
            allApis: that.data.allApis.concat(res.data.data),
            lastId_all: res.data.lastId,
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
  },

  // 滚动加载更多
  onLower(e) {
    const that = this;
    let curTab = e.currentTarget.dataset.curtab;
    if (curTab ===  'tab0') {
      // “全部”列表加载更多
      that.getAllApis();
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