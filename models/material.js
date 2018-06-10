const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = require('./model');
const Counters = require('./Counters');
const materialSchema = new Schema({
  code: {
    type: Number,
    default: 1
  }, // 食材编号
  // purchasingDate: Date,  采购日期
  name: String, // 名称
  // manufactureDate: Date, 生成日期
  // qualityPeriod: Date,  保质期
  // quantity: Number,  数量
  unit: String, // 单位
  price: Number, // 单价
  type: Number, // 类型
  createDate: Date // 创建时间
  // totalPrice: Number,  金额
  // purchaserName: String,  采购人
  // inspectorName: String,  收验货人
  // supplierName: String,  供货人
  // sign: String,  签字
})

materialSchema.pre('save', async function(next) {
  try {
    let countenr = await Counters.findByIdAndUpdate('materialId');
    if (!this.createDate) {
      this.createDate = new Date();
    }
    this.code = countenr.sequenceValue;
    next()
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

let materialModel = mongoose.model('Material', materialSchema);

class Material extends Model {
  constructor() {
    super(materialModel); // 调用父级class的构造，并且把自己的model传递过去
  }
}

const material = new Material()

module.exports = material;
