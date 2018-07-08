const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = require('./model');
const exportExcel = require('../files/exportExcel');
const fs = require('fs');
const purchaseSchema = new Schema({
  code: Number, // 食材编号
  purchasingDate: Date, // 采购日期
  name: String, // 食品名称
  manufactureDate: Date, // 生产日期
  qualityPeriod: Date, // 保质期
  quantity: Number, // 数量
  unit: String, // 单位
  price: Number, // 单价
  type: Number, // 类型
  createDate: Date, // 创建时间
  updateDate: Date,
  totalPrice: Number, // 金额
  purchaserName: String, // 采购人
  inspectorName: String, // 收验货人
  supplierName: String, // 供货人
  sign: String, // 签字
  purchaseOrderId: String, // 所属采购单
})

class Purchase extends Model {
  constructor() {
    super('Purchase', purchaseSchema);
  }

  exportExcel(dataArr = {}) {
    return new Promise((resolve, reject) => {
      this.model.find(dataArr, (err, docs) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          exportExcel.exportPurchase("导出文件", docs).then(path => {
            console.log(path);
            let result = fs.readFileSync(path);
            //将数据转为二进制输出
      			let dataBuffer = new Buffer(result,'binary');
            resolve(dataBuffer);
          });
        }
      })
    })
  }
}

const purchase = new Purchase()

module.exports = purchase;
