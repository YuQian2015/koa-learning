const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = require('./model');
const dietTableSchema = new Schema({
  name: String, // 名称
  creator: { type: Schema.Types.ObjectId, ref: 'User' }, // 创建者
  creatorId: String, // 创建者Id
  createDate: Date, // 创建时间
  updateDate: Date // 修改时间
});

dietTableSchema.pre('find', function() {
  this.populate('creator', 'name');
});

class DietTable extends Model {
  constructor() {
    super('Diettable', dietTableSchema);
  }
}

const dietTable = new DietTable();

module.exports = dietTable;
