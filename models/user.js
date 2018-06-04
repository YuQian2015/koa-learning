const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = require('./model');

// 创建一个User model，包含用户新增的字段定义
let userModel = mongoose.model('User', new Schema({
  userNo: String,
  email: String,
  password: String,
  name: String,
  sex: Number,
  userType: String,
  avatar: String,
  createDate: Date
}));

class User extends Model {
  constructor() {
    super(userModel); // 调用父级class的构造，并且把自己的model传递过去
  }
}
const user = new User()

module.exports = user;
