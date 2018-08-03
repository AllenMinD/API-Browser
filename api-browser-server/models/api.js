var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApiSchema = new Schema({
  methodUrl: {  // 这个字段只是简单的字符串拼接（method+url），目的是为了“判重”（数据库中不能存“用相同的方法去请求相同url”的api）
    type: String,
    unique: true,   // 不可重复约束
  },
  url: {
    type: String,
    required: true  // 不可为空约束
  },
  title: {
    type: String,
    required: true
  },
  params: {
    type: Object
  },
  method: {
    type: String
  },
  summary: {
    type: String
  },
  tags: {
    type: Array
  },
  stars: {
    type: Number
  },
  author: {
    type: String
  }
});

module.exports = mongoose.model('Api', ApiSchema);