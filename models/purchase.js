const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = require('./model');
const exportExcel = require('../files/exportExcel');
const fs = require('fs');
const qiniuUpload = require('../utils/qiniuUploader');
const _ = require('lodash');
const moment = require('moment');
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
    const form = dataArr.fromDate?dataArr.fromDate:new Date(0);
    const to = dataArr.toDate?dataArr.toDate:new Date();
    return new Promise((resolve, reject) => {
      this.model.find({...dataArr,fileName:undefined,fromDate:undefined,toDate:undefined}).where('createDate').gte(form).lte(to).lean().exec((err, docs) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            _.forEach(docs, doc => {
              doc.purchasingDate = moment(doc.purchasingDate).format("YYYY年MM月DD日");
              doc.qualityPeriod = moment(doc.qualityPeriod).format("YYYY年MM月DD日");
              doc.manufactureDate = moment(doc.manufactureDate).format("YYYY年MM月DD日");
            });
            exportExcel.exportPurchase(dataArr.fileName, docs).then(path => {
              console.log(path);
              console.log(dataArr.fileName);
              let result = fs.createReadStream(path);
              qiniuUpload(`${dataArr.fileName + new Date().getTime()}.xlsx`, path);
              //将数据转为二进制输出
              // let result = fs.readFileSync(path, {encoding:'binary'});
        			// let dataBuffer = new Buffer.from(result,'binary');
              resolve(result);
            });
          }
      })
    })
  }
}

const purchase = new Purchase()

module.exports = purchase;
