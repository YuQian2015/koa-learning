const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = require('./model');
const cookbookSchema = new Schema({
  name: String, // 名称
  materials: [{ type: Schema.Types.ObjectId, ref: 'Material' }], // 使用的材料
  createDate: Date, // 创建时间
  updateDate: Date // 修改时间
});

cookbookSchema.pre('find', function() {
  this.populate('materials', 'name price type unit');
});

class Cookbook extends Model {
  constructor() {
    super('Cookbook', cookbookSchema); // 调用父级class的构造，并且把自己的model传递过去
  }
}

const cookbook = new Cookbook();

module.exports = cookbook;
