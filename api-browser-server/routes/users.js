var express = require('express');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');
var passport = require('passport');
var router = express.Router();

require('../passport')(passport);

// 注册账户
router.post('/signup', function(req, res) {
  res.header({"Access-Control-Allow-Origin": "*"});
  if (!req.body.name || !req.body.password) {
    res.json({success: false, message: '请输入你的帐号密码。'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email?req.body.email:'',
      profile: req.body.profile?req.body.profile:''
    });

    // 保存新用户帐号
    newUser.save(function(err) {
      if (err) {
        console.log(err);
        if (err.message.indexOf('E11000 duplicate key error collection') != -1) {
          return res.json({ success: false, message: '注册失败，你的用户名已被使用' });
        }
        return res.json({ success: false, message: '注册失败' });
      }
      res.json({ success: true, message: '成功创建新用户!' });
    });
  }
});

// 登录（检查用户名与密码，若检查通过，则生成一个token）
router.post('/signin', function(req, res) {
  res.header({"Access-Control-Allow-Origin": "*"});
  // 根据用户名在数据库中查找
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) {
      throw err;
    }
    if (!user) {
      res.json({ success: false, message: "登录失败，用户不存在！"});
    } else {
      // 检查密码是否正确
      user.comparePassword(req.body.password, function(err ,isMatch) {
        if (isMatch && !err) {
          var expiresIn = 1000*60*30;  // token过期时间为半小时
          var token = jwt.sign(
            { name: user.name },  // 用户名
            config.secret,  // 密钥
            { expiresIn: expiresIn }  // token到期时间设置 
          );
          user.token = token;
          user.save(function(err) {  // 保存用户的token到数据库
            if (err) {
              res.send(err);
            }
            res.json({  // 响应，返回‘登录成功’和token
              success: true,
              message: '登录成功',
              token: 'Bearer ' + token,
              expiresIn: expiresIn,
              name: user.name,
              userId: user._id
            });
          });
        } else {
          res.send({
            success: false,
            message: '登录失败，密码错误'
          });
        }
      });
    }
  });
});

// 重新登录（更新token）
router.post('/resignin', function(req, res) {
  res.header({"Access-Control-Allow-Origin": "*"});
  // 根据用户名在数据库中查找
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) {
      throw err;
    }
    if (!user) {
      res.json({ success: false, message: "登录失败，用户已经注销！"});
    } else {
      var expiresIn = 1000*60*30;  // token过期时间为半小时
      var token = jwt.sign(
        { name: user.name },  // 用户名
        config.secret,  // 密钥
        { expiresIn: expiresIn }  // token到期时间设置 
      );
      user.token = token;
      user.save(function(err) {  // 保存用户的token到数据库
        if (err) {
          res.send(err);
        }
        res.json({  // 响应，返回‘登录成功’和token
          success: true,
          message: '重新登录成功',
          token: 'Bearer ' + token,
          expiresIn: expiresIn,
          name: user.name,
          userId: user._id
        });
      });
    }
  });
});

// passport-http-bearer token 中间件
// 通过header发送Authorization->Bearer + token
// 或者通过?access_token = token
router.get(
  '/users/info', 
  passport.authenticate('bearer', { session: false }), 
  function(req, res) {
    res.header({"Access-Control-Allow-Origin": "*"});
    res.json({ user_info: req.user });
  }
);

module.exports = router;