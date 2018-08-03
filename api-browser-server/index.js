var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var routes = require('./routes');
var config = require('./config');

app.use(passport.initialize()); // 初始化passport模块
app.use(morgan('dev')); //命令行中显示程序运行日志，便于bug调试
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());  // 调用bodyParser模块获取body的值

routes(app);  // 路由引入

mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useNewUrlParser: true }); // 连接数据库

app.listen(3000, function() {
  console.log('The server is running on http://localhost:3000');
});