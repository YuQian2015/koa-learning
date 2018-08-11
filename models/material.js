const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = require('./model');
const Counters = require('./Counters');
const materialSchema = new Schema({
  code: {
    type: Number,
    default: 1
  }, // 食材编号
  name: String, // 名称
  unit: {
    type: String,
    default: "斤"
  }, // 单位
  price: Number, // 单价
  type: Number, // 类型
  createDate: Date, // 创建时间
  updateDate: Date // 修改时间
});


class Material extends Model {
  constructor() {
    materialSchema.pre('save', async (next) => {
      try {
        if(this.code == 1) { // 对于已有ID的数据不做自增
          let counter = await Counters.findByIdAndUpdate('materialId');
          this.code = counter.sequenceValue;
          next()
        }
      } catch (err) {
        console.log(err);
        return next(err);
      }
    });
    super('Material', materialSchema); // 调用父级class的构造，并且把自己的model传递过去
  }
}

const material = new Material();

module.exports = material;
