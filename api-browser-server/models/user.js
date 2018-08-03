var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var Api = require('./api');

var UserSchema = new Schema({
  name: {
    type: String,
    unique: true, // 不可重复约束
    required: true // 不可为空约束
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  email: {
    type: String
  },
  profile: {
    type: String
  },
  myStars: [{ type: Schema.Types.ObjectId, ref: 'Api' }]
});

// 在把新用户的数据save到数据库前，对password进行bcrypt加密
UserSchema.pre('save', function(next) {
  var user = this;  // this指向UserSchema
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

// 校验用户输入密码是否正确
UserSchema.methods.comparePassword = function(passw, cb) {
  // this指向UserSchema
  bcrypt.compare(passw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
