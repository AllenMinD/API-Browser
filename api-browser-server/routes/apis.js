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
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.header({"Access-Control-Allow-Origin": "*"});
    console.log('前端发来的api信息\n', qs.parse(req.body));
    var data = qs.parse(req.body);
    var params = {};
    for (var i=0,len=data.params.length;i<len;i++) {
      params[data.params[i].key] = data.params[i].value;
    }
    // console.log('转化后的params：', params);
    request.post({url: data.url, formData: params}, function(err, r, body) {
      // console.log('第三方api返回的res:', res);
      // console.log('第三方api返回的data: ', body);
      res.json({ success: true, message: '服务器已经收到了api信息', data: body });
    });
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
        // tags: data.tags.split(','),
        stars: 0,
        author: data.author
      });
      // 把api信息存入数据库的apis集合中
      newApi.save(function(err) {
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
        res.json({ success: true, message: '发布成功' });
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
    // console.log(req.query.username);
    var author = req.query.username;
    Api.find({ author: author }, function(err, apis) {
      if (err) {
        throw err;
      } else {
        // console.log(apis);
        res.json({ success: true, message: '我的API', data: apis });
      }
    });
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
      // console.log(apis);
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
        summary: data.summary
        // tags: data.tags
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
router.get('/getAllApis', function(req, res) {
  res.header({"Access-Control-Allow-Origin": "*"});
  Api.find({}, function(err, apis) {
    if (err) throw err;
    res.json({ success: true, message: '返回全部api', data: apis });
  });
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
    res.header({"Access-Control-Allow-Origin": "*"});
    // console.log(req.query.username);
    var username = req.query.username;
    User
    .findOne({ name: username })
    .populate('myStars')
    .exec(function(err, user) {
      if (err) {
        throw err;
      } else {
        // console.log('查询的结果：', user.myStars);
        res.json({ success: true, message: '我收藏的API', data: user.myStars });
      }
    });
    // res.json({ success: true, message: '服务器已经收到' });
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


// 搜索API
router.get('/search', function(req, res) {
  res.header({"Access-Control-Allow-Origin": "*"});
  // console.log('来自前端的keyword:', req.query.keyword);
  var query = new RegExp(req.query.keyword, 'gi');
  var findInTitle = Api.find({ title: query }).exec();
  var findInUrl = Api.find({ url: query }).exec();
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
    res.json({ success: true, message: '服务器已经收到了关键字', data: resArray });
  });
});

// 响应/search的预检响应
router.options('/search', function(req, res) {
  console.log('收到OPTIONS请求');
  res.header({"Access-Control-Allow-Origin": "*"});
  res.header({"Access-Control-Request-Method": "GET, POST, PUT"});
  res.header({"Access-Control-Allow-Headers": "*"});
  res.send();
});

module.exports = router;