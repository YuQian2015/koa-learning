const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = require('./model');

const material = new Schema({
  name: String, // 名称
  quantity: Number, // 数量
  unit: String, // 单位
  price: Number, // 单价
  totalPrice: Number, // 金额
});

const dailyDietSchema = new Schema({
  name: String, // 所属公示表名称
  dietTable: {
    type: Schema.Types.ObjectId,
    ref: 'DietTable'
  }, // 所属公示表
  dietTableId: String, // 所属公示表ID
  date: Date, // 日期
  materials: [material],
  cookbook: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Cookbook'
    }
  ], // 食谱
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }, // 创建者
  totalCount: Number, // 总就餐人数
  actualCount: Number, // 实际就餐人数
  totalPrice: Number, // 总计
  averagePrice: Number, // 人均
  creatorId: String, // 创建者Id
  createDate: Date, // 创建时间
  updateDate: Date // 修改时间
});

dailyDietSchema.pre('find', function() {
  this.populate('cookbook', 'name');
  this.populate('creator', 'name');
});

class DailyDiet extends Model {
  constructor() {
    super('DailyDiet', dailyDietSchema);
  }

  exportExcel(dataArr = {}) {
    return new Promise((resolve, reject) => {
      this.model.find({
        _id: dataArr.id,
        fileName: undefined,
      }).lean().exec((err, docs) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(docs);
          // exportExcel.exportPurchase(dataArr.fileName, docs).then(path => {
          //   console.log(path);
          //   console.log(dataArr.fileName);
          //   let result = fs.createReadStream(path);
          //   qiniuUpload(`${dataArr.fileName + new Date().getTime()}.xlsx`, path);
          //   //将数据转为二进制输出
          //   // let result = fs.readFileSync(path, {encoding:'binary'});
          //   // let dataBuffer = new Buffer.from(result,'binary');
          //   resolve(result);
          // });
        }
      })
    })
  }
}

const dailyDiet = new DailyDiet();

module.exports = dailyDiet;
