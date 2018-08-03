module.exports = function(app) {
  app.get('/', function(req, res) {
    res.json({ message: '欢迎！' });
  });

  app.use('/api', require('./users')); // 在所有users路由前加上‘/api’
  app.use('/api', require('./apis')); // 在所有apis路由前加上‘/api’
};