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
  title: {  // api标题
    type: String,
    required: true
  },
  params: {  // api参数
    type: Object
  },
  method: {  // 请求方法
    type: String
  },
  summary: {  // 简要说明
    type: String
  },
  tags: {  // api的标签
    type: Array
  },
  stars: {  // 收藏数
    type: Number
  },
  author: {  // api的发布者
    type: String
  },
  viewOptions: {  // 视图配置对象，主要用来表示json数据中键值对是否显示，以及键名的注释
    type: Object
  }
});

module.exports = mongoose.model('Api', ApiSchema);