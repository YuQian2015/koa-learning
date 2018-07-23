const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = require('./model');
const cookbookSchema = new Schema({
  code: {
    type: Number,
    default: 1
  }, // 食材编号
  name: String, // 名称
  createDate: Date, // 创建时间
  updateDate: Date // 修改时间
});


class Cookbook extends Model {
  constructor() {
    super('Cookbook', cookbookSchema); // 调用父级class的构造，并且把自己的model传递过去
  }
}

const cookbook = new Cookbook();

module.exports = cookbook;
