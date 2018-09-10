const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const Model = require('./model');

const monthlySettlementSchema = new Schema({
  name: String, // 名称
  quantity: Number, // 数量
  unit: String, // 单位
  price: Number, // 单价
  totalPrice: Number, // 金额
});

monthlySettlementSchema.pre('find', function() {
  this.populate('cookbook', 'name');
  this.populate('creator', 'name');
});

class MonthlySettlement extends Model {
  constructor() {
    super('MonthlySettlement', monthlySettlementSchema);
  }
}

const monthlySettlement = new MonthlySettlement();

module.exports = monthlySettlement;
