var express = require('express');
var app = express();
var https = require('https');  //使用nodejs自带的http、https模块
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var routes = require('./routes');
var config = require('./config');

//根据项目的路径导入生成的证书文件
var privateKey  = fs.readFileSync(path.join(__dirname, './certificate/privkey.pem'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, './certificate/cert.pem'), 'utf8');
var credentials = {key: privateKey, cert: certificate};

app.use(passport.initialize()); // 初始化passport模块
app.use(morgan('dev')); //命令行中显示程序运行日志，便于bug调试
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());  // 调用bodyParser模块获取body的值

routes(app);  // 路由引入

mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useNewUrlParser: true }); // 连接数据库

// app.listen(3000, function() {
//   console.log('The server is running on http://localhost:3000');
// });

//创建https服务器
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(3000, function() {
  console.log('HTTPS Server is running on: https://your_domain:3000');
});