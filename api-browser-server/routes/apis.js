var express = require('express');
var Api = require('../models/api');
var User = require('../models/user');
var passport = require('passport');
var router = express.Router();
var qs = require('qs');
var request = require('request');
var mongoose = require('mongoose');

require('../passport')(passport);

// 从前端获取api信息，并使用这些信息发送请求给第三方api的服务器，从而测试api
router.post(
  '/testApi',
  //passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.header({"Access-Control-Allow-Origin": "*"});
    console.log('前端发来的api信息\n', qs.parse(req.body));
    var data = qs.parse(req.body);
    var params = {};
    if (data.params) {
      for (var i=0,len=data.params.length;i<len;i++) {
        params[data.params[i].key] = data.params[i].value?data.params[i].value:data.params[i].default;
      }
    }
    // console.log('转化后的params：', params);
    if (data.method === "GET") {
      var url_get = data.url;
      if (params) {
        // 如果有参数，则进行字符串拼接，把参数凭借到url后面
        url_get += '?';
        for (var key in params) {
          url_get += key + '=' + params[key] + '&';
        }
        url_get = url_get.slice(0, url_get.length-1);  // 把最后的'&'去掉
      }
      console.log('get请求最终的url', url_get);
      request.get(encodeURI(url_get), function(err, r, body) {
        if (err) {
          console.log("错误信息：", err);
          res.json({ success: false, message: '请求发送失败' });
        } else {
          // console.log('第三方api返回的res:', r);
          console.log('第三方api返回的data: ', body);
          res.json({ success: true, message: '发送请求成功', data: body });
        }
      });
    } else if (data.method === "POST") {
      request.post({url: data.url, formData: params}, function(err, r, body) {
        if (err) {
          console.log("错误信息：", err);
          res.json({ success: false, message: '请求发送失败' });
        } else {
          // console.log('第三方api返回的res:', r);
          console.log('第三方api返回的data: ', body);
          res.json({ success: true, message: '发送请求成功', data: body });
        }
      });
    }
    // TODO: PUT, DELETE request
  }
);

// 响应/testApi的“预检”请求
router.options('/testApi', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});

// 发布Api
router.post(
  '/publishApi', 
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.header({"Access-Control-Allow-Origin": "*"});
    // 正确的JSON字符串形式是：'{ "name": "allen", "age": 27}'
    // console.log(JSON.parse(req.body.params));
    console.log(qs.parse(req.body));
    
    if (!req.body.url) {
      res.json({ success: false, message: '请输入url' });
    } else {
      var data = qs.parse(req.body);
      var newApi = new Api({
        methodUrl: data.method + data.url,
        url: data.url,
        title: data.title,
        params: data.params,
        method: data.method,
        summary: data.summary,
        tags: data.tags,
        stars: 0,
        author: data.author,
        viewOptions: data.viewOptions
      });
      // 把api信息存入数据库的apis集合中
      newApi.save(function(err, saveRes) {
        if (err) {
          console.log(err.message);
          if (err.message.indexOf('E11000 duplicate key error collection') != -1) {
            return res.json({ success: false, message: '发布失败，该Api已经有人发布了' });
          }
          if (err.message.indexOf('is required') != -1) {
            return res.json({ success: false, message: '发布失败，url和title是必填的参数' });
          }
          return res.json({ success: false, message: '发布失败' });
        }
        res.json({ success: true, message: '发布成功', saveRes: saveRes});
      });
    }
  }
);

// 响应/publishApi的预检响应
router.options('/publishApi', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});

// 获取“我的Api”
router.get(
  '/getMyApi', 
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.header({"Access-Control-Allow-Origin": "*"});
    let lastId = req.query.lastId;
    let pageSize = parseInt(req.query.pageSize);
    console.log(lastId, pageSize);
    // console.log(req.query.username);
    var author = req.query.username;
    if (lastId == null || lastId == "") {  // 如果lastId为空，那么表示是 第一页
      Api.find({ author: author }, null, { limit: pageSize, sort: {_id: -1} }, function(err, apis) {
        if (err) {
          throw err;
        } else {
          // console.log(apis);
          let lastId_temp = '';
          if (apis.length === 0 || apis == null) {
            lastId_temp = '';
          } else {
            lastId_temp = apis[apis.length-1]._id;
          }
          res.json({ success: true, message: '我的API', data: apis, lastId: lastId_temp });
        }
      });
    } else {  // 第1+n页
      Api.find({ author: author, _id: { $lt: lastId } }, null, { limit: pageSize, sort: {_id: -1} }, function(err, apis) {
        if (err) {
          throw err;
        } else {
          // console.log(apis);
          let lastId_temp = lastId;
          if (apis.length === 0 || apis == null) {
            lastId_temp = lastId;
            res.json({ success: true, message: '我的API, 已经是最后一页了', data: [], lastId: lastId_temp });
          } else {
            lastId_temp = apis[apis.length-1]._id;
            res.json({ success: true, message: '我的API', data: apis, lastId: lastId_temp });
          }
        }
      });
    }

    // res.json({ success: true, message: '服务器已经收到' });
  }
);

// 响应/getMyApi的预检响应
router.options('/getMyApi', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});

// 根据apiId查询api
router.get('/getApiById', function(req, res) {
  res.header({"Access-Control-Allow-Origin": "*"});
  // console.log(req.query.apiId);
  Api.findOne({ _id: req.query.apiId }, function(err, api) {
    if (err) {
      throw err;
      res.json({ success: false, message: '根据id查找API失败' });
    } else {
      console.log('根据apiId查询api: \n', api);
      res.json({ success: true, message: '根据id查找API', data: api });
    }
  });
});

// 响应/getApiById的预检响应
router.options('/getApiById', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});

// 更新、修改api
router.post(
  '/updateApi', 
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.header({"Access-Control-Allow-Origin": "*"});
    // console.log(req.body);
    var data = qs.parse(req.body);
    Api.findByIdAndUpdate(
      data.id,
      { 
        title: data.title,
        url: data.url,
        method: data.method,
        methodUrl: data.method + req.body.url,
        params: data.params,
        summary: data.summary,
        tags: data.tags,
        viewOptions: data.viewOptions
      },
      { new: true },
      function(err, newApi) {
        if (err) {
          throw err;
          res.json({ success: false, message: '数据库因为某种原因导致api更新失败' });
        } else {
          console.log('数据库已更新了api：', newApi);
          res.json({ success: true, message: '数据库已更新了api' });
        }
      }
    );
  }
);

// 响应/updateApi的预检响应
router.options('/updateApi', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});

// 删除api
router.post(
  '/deleteapi', 
  passport.authenticate('bearer', { session: false }),
  function (req, res) {
    res.header({"Access-Control-Allow-Origin": "*"});
    // console.log(req.body.apiId);
    Api.findByIdAndDelete(req.body.apiId, function(err, api) {
      if (err) {
        throw err;
        res.json({ success: false, message: 'API删除失败' });
      }
      if (api) {
        res.json({ success: true, message: 'API已经从服务器中删除' });
      } else {
        res.json({ success: false, message: 'API删除失败' });
      }
    });
  }
);

// 响应/deleteapi的预检响应
router.options('/deleteapi', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});

// 获取全部API
// router.get('/getAllApis', function(req, res) {
//   res.header({"Access-Control-Allow-Origin": "*"});
//   Api.find({}, function(err, apis) {
//     if (err) throw err;
//     res.json({ success: true, message: '返回全部api', data: apis });
//   });
// });

// 获取全部API - 加上分页
router.get('/getAllApis', function(req, res) {
  res.header({"Access-Control-Allow-Origin": "*"});
  let lastId = req.query.lastId;
  let pageSize = parseInt(req.query.pageSize);
  console.log(lastId, pageSize);
  if (lastId == null || lastId == "") {  // 如果lastId为空，那么表示是 第一页
    Api.find({}, null, {limit: pageSize, sort: {_id: -1}}, function(err, apis) {
      if (err) throw err;
      // console.log(apis);
      let lastId_temp = '';
      if (apis.length === 0 || apis == null) {
        lastId_temp = '';
      } else {
        lastId_temp = apis[apis.length-1]._id;
      }
      res.json({ success: true, message: '返回全部Api', data: apis, lastId: lastId_temp });
    });
  } else {  // 第1+n页
    Api.find({_id: {$lt: lastId}}, null, {limit: pageSize, sort: {_id: -1}}, function(err, apis) {  
      if (err) throw err;
      // console.log(apis);
      let lastId_temp = lastId;
      if (apis.length === 0 || apis == null) {
        lastId_temp = lastId;
        res.json({ success: true, message: '返回全部Api, 已经是最后一页了', data: [], lastId: lastId_temp });
      } else {
        lastId_temp = apis[apis.length-1]._id;
        res.json({ success: true, message: '返回全部Api', data: apis, lastId: lastId_temp });
      }
    });
  }
});

// 响应/getAllApis的预检响应
router.options('/getAllApis', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});

// 收藏API
router.post(
  '/collectApi',
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.header({"Access-Control-Allow-Origin": "*"});
    // console.log(req.body);
    // 把字符串类型转换为Schema.Types.ObjectId类型
    var id = mongoose.Types.ObjectId(req.body.apiId);
    User.findOne({ name: req.body.username }, function(err, user) {
      user.myStars.push(id);
      var new_myStars = user.myStars;
      User.findOneAndUpdate({ name: req.body.username }, { myStars: new_myStars }, function(err, user) {
        if (err) {
          throw err;
          res.json({ success: false, message: 'API收藏失败' });
        }
        if (user) {
          // 更新api的stars数目
          Api.findById(req.body.apiId, function(err, api) {
            if (err) throw err;
            api.stars++;
            api.save(function(err, result) {
              if (err) throw err;
            });
          });
          res.json({ success: true, message: 'API收藏成功' });
        } else {
          res.json({ success: false, message: 'API收藏失败' });
        }
      });
    });
  }
);

// 响应/collectApi的预检响应
router.options('/collectApi', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});

// 取消收藏API
router.post(
  '/cancelCollectApi',
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.header({"Access-Control-Allow-Origin": "*"});
    // console.log(req.body);
    // 把字符串类型转换为Schema.Types.ObjectId类型
    var id = mongoose.Types.ObjectId(req.body.apiId);
    User.findOne({ name: req.body.username }, function(err, user) {
      var index = user.myStars.indexOf(id);
      user.myStars.splice(index, 1);
      var new_myStars = user.myStars;
      User.findOneAndUpdate({ name: req.body.username }, { myStars: new_myStars }, function(err, user) {
        if (err) {
          throw err;
          res.json({ success: false, message: '取消API收藏失败' });
        }
        if (user) {
          // 更新api的stars数目
          Api.findById(req.body.apiId, function(err, api) {
            if (err) throw err;
            api.stars--;
            api.save(function(err, result) {
              if (err) throw err;
            });
          });
          res.json({ success: true, message: '取消API收藏成功' });
        } else {
          res.json({ success: false, message: '取消API收藏失败' });
        }
      });
    });
  }
);

// 响应/cancelCollectApi的预检响应
router.options('/cancelCollectApi', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});

// 获取“我的收藏”
router.get(
  '/getMyStars', 
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    // let lastId = req.query.lastId;
    let pageNo = parseInt(req.query.pageNo)
    let pageSize = parseInt(req.query.pageSize);
    console.log(pageNo, pageSize);
    res.header({"Access-Control-Allow-Origin": "*"});
    // console.log(req.query.username);
    var username = req.query.username;
    User
    .findOne({ name: username })
    .populate({
      path: 'myStars',
      options: { skip: pageNo * pageSize, limit: pageSize, sort: {_id: -1} }
    })
    // .skip(pageNo * pageSize)
    // .limit(pageSize)
    // .sort('_id', -1)
    .exec(function(err, user) {
      if (err) {
        throw err;
      } else {
        // console.log('查询的结果：', user.myStars);
        // let lastId_temp = user.myStars[user.myStars.length-1]._id;
        res.json({ success: true, message: '我收藏的API', data: user.myStars });
      }
    });
  }
);

// 响应/getMyStars的预检响应
router.options('/getMyStars', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});

// 获取对应一类标签的API
router.get(
  '/getApiByTag', 
  function(req, res) {
    res.header({"Access-Control-Allow-Origin": "*"});
    // console.log('来自前端的keyword:', req.query.keyword);
    var query = new RegExp(req.query.tag, 'gi');
    let lastId = req.query.lastId;
    let pageSize = parseInt(req.query.pageSize);
    if (lastId == null || lastId === '') {  // 第一页
      var findInTags = Api.find({ tags: query }).limit(pageSize).sort({_id: -1}).exec();
      Promise.all([findInTags]).then(function(results) {
        // console.log('查询结果：', results);
        // 把结果合成一个数组方便返回
        var resArray = [];
        for (var i=0,len=results.length;i<len;i++) {
          var strArr = JSON.stringify(resArray);
          if (results[i] !== [] && strArr.indexOf(JSON.stringify(results[i][0])) == -1 ) {
            resArray = resArray.concat(results[i]);
          }
        }
        // console.log('合并后的结果:', resArray);
        // done();
        let lastId_temp = '';
        if (resArray.length === 0) {
          lastId_temp = ''
        } else {
          lastId_temp = resArray[resArray.length-1]._id;
        }
        res.json({ success: true, message: '服务器已经收到了关键字', data: resArray, lastId: lastId_temp });
      });
    } else {  // 第1+n页
      var findInTags = Api.find({ tags: query, _id: {$lt: lastId}}).limit(pageSize).sort({_id: -1}).exec();
      Promise.all([findInTags]).then(function(results) {
        // console.log('查询结果：', results);
        // 把结果合成一个数组方便返回
        var resArray = [];
        for (var i=0,len=results.length;i<len;i++) {
          var strArr = JSON.stringify(resArray);
          if (results[i] !== [] && strArr.indexOf(JSON.stringify(results[i][0])) == -1 ) {
            resArray = resArray.concat(results[i]);
          }
        }
        // console.log('合并后的结果:', resArray);
        // done();
        let lastId_temp = lastId;
        if (resArray.length === 0) {
          lastId_temp = lastId;
        } else {
          lastId_temp = resArray[resArray.length-1]._id;
        }
        res.json({ success: true, message: '服务器已经收到了关键字', data: resArray, lastId: lastId_temp });
      });
    }
  }
);

// 响应/getApiByTag的预检响应
router.options('/getApiByTag', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});

// 获取热门标签
router.get('/getTopTags', function(req, res) {
  res.header({"Access-Control-Allow-Origin": "*"});
  Api.find({}, 'tags', function(err, findRes) {
    if (err) {
      console.log(err);
      res.json({ success: false, message: '查询失败' });
    } else {
      console.log('查询所有标签', findRes);
      let tags = findRes.map(function(item) {
        return item.tags;
      });

      /*
        1. 把findRes数组扁平化
        2. 统计各个标签出现的频率
        3. 根据出现的频率按大到小排序
        4. 数组去重
      */
      tags = [].concat(...tags);  // 数组扁平化
      // console.log('返回全部标签：', tags);
      // 数组按照出现的频率从高到低排序
      let tagsSortByCount = (function (tags) {
        let arrUni = [];
        let arrCnt = [];
        tags.forEach((val)=>{
            let idx = arrUni.indexOf(val);
            if (idx<0) {
                arrUni.push(val);
                arrCnt.push(1);
            }else{
                arrCnt[idx]++;
            }
        });
        let arrTmp = arrUni.slice();
        arrUni.sort((a, b)=>{
            let idxa = arrTmp.indexOf(a);
            let idxb = arrTmp.indexOf(b);
            return arrCnt[idxb] - arrCnt[idxa];
        });
        return arrUni;
      })(tags);

      console.log('获取热门标签返回到前端：', tagsSortByCount.slice(0, 10));

      res.json({ success: true, message: '查询所有标签成功', data: tagsSortByCount.slice(0, 10)});
    }
  });
});

// 响应/getTopTags的预检响应
router.options('/getTopTags', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});


// 搜索API
router.get('/search', function(req, res) {
  res.header({"Access-Control-Allow-Origin": "*"});
  // console.log('来自前端的keyword:', req.query.keyword);
  var query = new RegExp(req.query.keyword, 'gi');
  let lastId = req.query.lastId;
  let pageSize = parseInt(req.query.pageSize);
  if (lastId == null || lastId === '') {  // 第一页
    var findInTitle = Api.find({ title: query }).limit(pageSize).sort({_id: -1}).exec();  // 在标题中寻找关键字
    var findInUrl = Api.find({ url: query }).limit(pageSize).sort({_id: -1}).exec();  // 在url中寻找关键字
    Promise.all([findInTitle, findInUrl]).then(function(results) {
      // console.log('查询结果：', results);
      // 把结果合成一个数组方便返回
      var resArray = [];
      for (var i=0,len=results.length;i<len;i++) {
        var strArr = JSON.stringify(resArray);
        if (results[i] !== [] && strArr.indexOf(JSON.stringify(results[i][0])) == -1 ) {
          resArray = resArray.concat(results[i]);
        }
      }
      // console.log('合并后的结果:', resArray);
      // done();
      let lastId_temp = '';
      if (resArray.length === 0) {
        lastId_temp = ''
      } else {
        lastId_temp = resArray[resArray.length-1]._id;
      }
      res.json({ success: true, message: '服务器已经收到了关键字', data: resArray, lastId: lastId_temp });
    });
  } else {  // 第1+n页
    var findInTitle = Api.find({ title: query, _id: {$lt: lastId} }).limit(pageSize).sort({_id: -1}).exec();  // 在标题中寻找关键字
    var findInUrl = Api.find({ url: query, _id: {$lt: lastId} }).limit(pageSize).sort({_id: -1}).exec();  // 在url中寻找关键字
    Promise.all([findInTitle, findInUrl]).then(function(results) {
      // console.log('查询结果：', results);
      // 把结果合成一个数组方便返回
      var resArray = [];
      for (var i=0,len=results.length;i<len;i++) {
        var strArr = JSON.stringify(resArray);
        if (results[i] !== [] && strArr.indexOf(JSON.stringify(results[i][0])) == -1 ) {
          resArray = resArray.concat(results[i]);
        }
      }
      // console.log('合并后的结果:', resArray);
      // done();
      let lastId_temp = lastId;
      if (resArray.length === 0) {
        lastId_temp = lastId;
      } else {
        lastId_temp = resArray[resArray.length-1]._id;
      }
      res.json({ success: true, message: '服务器已经收到了关键字', data: resArray, lastId: lastId_temp });
    });
  }
});

// 响应/search的预检响应
router.options('/search', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});

// 获取赞数最多的前10个Api
router.get('/getTopApis', function(req, res) {
  res.header({"Access-Control-Allow-Origin": "*"});
  Api.find({}).sort({ "stars": -1 }).exec(function(err, findRes) {
    if (err) {
      res.json({ success: false, message: '查找赞数最多的前十个Api出错' });
      throw err;
    } else {
      console.log('获取赞数最多的前10个Api: ', findRes);
      res.json({ success: true, message: '查询成功', data: findRes});
    }
  });
});

// 响应/getTopApis的预检响应
router.options('/getTopApis', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});

// // 把修改后的数据发送会第三方服务器
// router.post(
//   '/sendBackData',
//   passport.authenticate('bearer', { session: false }),
//   function(req, res) {
//     res.header({"Access-Control-Allow-Origin": "*"});
//     console.log('前端发来的api信息\n', qs.parse(req.body));
//     var data = qs.parse(req.body);
//     var params = {};
//     if (data.params) {
//       for (var i=0,len=data.params.length;i<len;i++) {
//         params[data.params[i].key] = data.params[i].value;
//       }
//     }
//     if (data.method === "POST") {
//       request({
//         method: "POST",
//         uri: data.url,
//         multipart: [{ 
//               'content-type': 'application/json',
//               body: JSON.stringify(params)
//             }
//             , { body: 'I am an attachment' }
//           ]
//         },
//         function(err, r, body) {
//           if (err) {
//             console.log("错误信息：", err);
//             res.json({ success: false, message: '请求发送失败' });
//           } else {
//             // console.log('第三方api返回的res:', r);
//             console.log('第三方api返回的data: ', body);
//             res.json({ success: true, message: '发送请求成功', data: body });
//           }
//         }
//       );
//     }
//     // TODO: PUT, DELETE request
//   }
// );

// // 响应/sendBackData的“预检”请求
// router.options('/sendBackData', function(req, res) {
//   console.log('收到OPTIONS请求');
//   res.header({"Access-Control-Allow-Origin": "*"});
//   res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
//   res.header({"Access-Control-Allow-Headers": "*"});
//   res.send();
// });

module.exports = router;