// pages/useapi/useapi.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showApiInfoFlag: false,  // 显示Api信息窗口
    showApiParamsFlag: false,  // 显示Api参数设置窗口
    apiId: '',  // api的id
    api: null,
    isCollected: false,  // 是否收藏了这个api
    viewOptions: null, // 视图配置对象
    loading: false,  // 加载动画
    currentNode: null, // 当前键值对的值
    currentNodeKey: "Root", // 当前键值对的键
    columns: null,
    stack: [], // 节点内容栈
    nameStack: [], // 节点键名栈（作为卡片的头部）
    nameStackForBread: ["Root"], // 节点键名栈 （作为面包屑）
    canExpand: null,  // 判断当前节点的每一个键值对是否可以展开
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    // 从api列表页面获取api的id
    if (options.apiId) {
      that.setData({
        apiId: options.apiId
      });
    }
  },

  onShow() {
    const that = this;
    // 根据传入的id获取api
    that.getApiById();
  },

  // 根据api的id获取api信息
  getApiById() {
    const that = this;
    let apiId = that.data.apiId;
    if (apiId) {
      wx.request({
        url: app.globalData.domain + `/api/getApiById?apiId=${apiId}`,
        success(res) {
          console.log('调用getApiById返回的结果：', res);
          if (res.data.success) {
            that.setData({
              api: res.data.data,
              viewOptions: res.data.data.viewOptions
            });

            // 当进入当前页面时，尝试自动调用api
            that.sendReq();
          }
        }
      })
    } else {
      return;
    }
  },

  // 点击按钮显示api信息窗口
  showApiInfo() {
    const that = this;
    that.setData({
      showApiInfoFlag: true,
      isCollected: false  // 初始化收藏按钮状态
    });

    that.getMyStar();  // 判断当前api是不是用户收藏过的api
  },

  // 点击按钮显示api参数设置窗口
  showApiParams() {
    const that = this;
    that.setData({
      showApiParamsFlag: true
    });
  },

  // 关闭模态窗口
  closeModal() {
    const that = this;
    that.setData({
      showApiInfoFlag: false,
      showApiParamsFlag: false,
    });
  },

  // 更改api参数值
  changeParams(e) {
    const that = this;
    let curParamIndex = parseInt(e.currentTarget.dataset.itemindex);
    let curValue = e.detail.value;
    that.setData({
      [`api.params[${curParamIndex}].value`]: curValue
    })
  },

  // 向第三方服务器发送请求
  sendReq(e) {
    const that = this;
    let data = that.data.api;
    // console.log('提交的表单', that.data.api);

    // 显示加载动画及初始化页面栈相关变量
    that.setData({
      loading: true,
      showApiParamsFlag: false,
      currentNodeKey: "Root", // 当前键值对的键
      stack: [], // 节点内容栈
      nameStack: [], // 节点键名栈（作为卡片的头部）
      nameStackForBread: ["Root"], // 节点键名栈 （作为面包屑）
    });

    wx.request({
      url: app.globalData.domain + '/api/testApi',
      method: 'POST',
      data: data,
      success(res) {
        console.log('调用/testApi接口返回的结果：', res);
        if (!res.data.success || res.data.data.indexOf('<!DOCTYPE') !== -1) {
          wx.showModal({
            title: '发送请求失败',
            content: '第三方服务器返回的错误：' + res.data.data,
            confirmColor: '#409eff',
            showCancel: false
          });
        } else {  // 调用第三方api，成功返回数据
          that.setData({
            jsonData: JSON.parse(res.data.data)
          });

          that.jsonDataToCurrentNode();  // 每当jsonData发生变化时，都要把jsonData转化成数组再赋值给currentNode
        }
      },
      complete() {
        that.setData({
          loading: false
        });
      }
    })
  },

  // 把jsonData转化成数组后再赋值给currentNode
  jsonDataToCurrentNode() {
    const that = this;
    let jsonData = that.data.jsonData;
    let newArray = [];
    if (Array.isArray(jsonData)) {
      newArray = jsonData;
    } else {
      newArray.push(jsonData);
    }

    that.setData({
      currentNode: newArray
    });

    that.getTableHead();  // 每当currentNode发生变化时，都要重新获取表头，即更新columns数组
  },

  // 获取表头数组
  getTableHead() {
    const that = this;
    let currentNode = that.data.currentNode,
        columns_temp = [],
        key,
        i,
        len = currentNode.length;
    for (i = 0; i < len; i++) {
      for (key in currentNode[i]) {
        if (columns_temp.indexOf(key) === -1) {
          columns_temp.push(key);
        }
      }
    }

    that.setData({
      columns: columns_temp
    });

    // 判断currentNode中的每一个键值是不是对象（能不能展开）
    that.whetherCanExpand();
  },

  // 判断currentNode中的每一个键值是不是对象（能不能展开）
  whetherCanExpand() {
    const that = this;
    let curNode = that.data.currentNode;
    let columns = that.data.columns;
    /* canExpand的形式：
      canExpand: {
        'curNode的index + column': true | false
      }
     */
    let canExpand_temp = {};
    curNode.forEach((row, index) => {  // (row是一个obj)
      for (let column of columns) {  // (column是一个字符串)
        // 如果值是一个对象或者是一个数组的话，说明可以展开，标记为true
        if (typeof row[column] == 'object' && row[column] != null || Array.isArray(row[column])) {
          canExpand_temp[index + column] = true;  // ['index + column']: true
        } else {
          canExpand_temp[index + column] = false;
        }
      }
    });
    that.setData({
      canExpand: canExpand_temp
    });
  },

  // 点击【展开】按钮
  expand(e) {
    const that = this;
    let expandData = e.currentTarget.dataset.expanddata, 
        keyName = e.currentTarget.dataset.keyname;
    let stack = that.data.stack,
        nameStack = that.data.nameStack,
        currentNode = that.data.currentNode,
        currentNodeKey = that.data.currentNodeKey,
        nameStackForBread = that.data.nameStackForBread,
        newArray = [];

    // 当前层入栈
    stack.push(currentNode);
    nameStack.push(currentNodeKey);

    // 转化成数组形式再赋值给currentNode
    if (Array.isArray(expandData)) {
      newArray = expandData;
    } else {
      newArray.push(expandData);
    }

    currentNode = newArray; // 进入下一层节点
    currentNodeKey = keyName;

    nameStackForBread.push(currentNodeKey);

    that.setData({
      stack,
      nameStack,
      currentNode,
      currentNodeKey,
      nameStackForBread
    });

    that.getTableHead();  // 每当currentNode发生变化时，都要重新获取表头，即更新columns数组
  },

  // 点击【返回上一层】按钮
  backToLast() {
    const that = this;
    let stack = that.data.stack,
        nameStack = that.data.nameStack,
        currentNode = that.data.currentNode,
        currentNodeKey = that.data.currentNodeKey,
        nameStackForBread = that.data.nameStackForBread

    currentNode = stack.pop(); // 出栈，回到上一层
    currentNodeKey = nameStack.pop();
    nameStackForBread.pop();

    that.setData({
      stack,
      nameStack,
      currentNode,
      currentNodeKey,
      nameStackForBread
    });

    that.getTableHead();  // 每当currentNode发生变化时，都要重新获取表头，即更新columns数组
  },

  // 收藏/取消收藏Api
  collectApit() {
    const that = this;
    let isCollected = that.data.isCollected,
        apiId = that.data.apiId,
        username = wx.getStorageSync('username');
    
    if (username == null || username == '') {
      wx.reLaunch({
        url: '/pages/login/login',
      });

      return;
    }

    let data = {
      apiId: apiId, 
      username: username
    }

    if (isCollected) {
      // 取消收藏
      wx.request({
        url: app.globalData.domain + '/api/cancelCollectApi',
        method: 'POST',
        data: data,
        header: {
          'Authorization': wx.getStorageSync('token')
        },
        success(res) {
          console.log('调用/cancelCollectApi返回的结果：', res);

          // 判断当401的情况下（因多端登录导致token被刷新而失效），需要用户重新登录
          app.handleUnauthorized(res.statusCode);

          if (res.data.success) {
            that.setData({
              isCollected: !isCollected,
              ['api.stars']: --that.data.api.stars
            });
          } else {
            wx.showModal({
              title: '取消收藏失败',
              content: res.data.message,
              showCancel: false,
              confirmColor: '#409eff'
            })
          }
        }
      });
    } else {
      // 收藏
      wx.request({
        url: app.globalData.domain + '/api/collectApi',
        method: 'POST',
        data: data,
        header: {
          'Authorization': wx.getStorageSync('token')
        },
        success(res) {
          console.log('调用/collectApi返回的结果：', res);

          // 判断当401的情况下（因多端登录导致token被刷新而失效），需要用户重新登录
          app.handleUnauthorized(res.statusCode);

          if (res.data.success) {
            that.setData({
              isCollected: !isCollected,
              ['api.stars']: ++that.data.api.stars
            });
          } else {
            wx.showModal({
              title: '收藏失败',
              content: res.data.message,
              showCancel: false,
              confirmColor: '#409eff'
            })
          }
        }
      });
    }
  },

  // 获取用户收藏的api（目的是为了判断当前api是否已经收藏）
  getMyStar() {
    const that = this;
    let username = wx.getStorageSync('username');
    let apiId = that.data.apiId;
    wx.request({
      url: app.globalData.domain + `/api/getMyStars?username=${username}`,
      header: {
        'Authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log('调用/getMyStars接口返回的结果：', res);

        // 判断当401的情况下（因多端登录导致token被刷新而失效），需要用户重新登录
        app.handleUnauthorized(res.statusCode);

        if (res.data.success) {
          let resData = res.data.data;
          for (let item of resData) {
            if (item._id == apiId) {
              that.setData({
                isCollected: true
              });
              break;
            } 
          }
        }
      }
    })
  }

})