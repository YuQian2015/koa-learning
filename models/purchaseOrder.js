const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = require('./model');
const purchaseOrderSchema = new Schema({
  name: String, // 采购单名称
  type: String, // 采购单类型
  creator: { type: Schema.Types.ObjectId, ref: 'User' }, // 创建者
  creatorId: String, // 创建者Id
  createDate: Date, // 创建时间
  updateDate: Date,
})

purchaseOrderSchema.pre('find', function() {
  this.populate('creator', 'name');
});

class PurchaseOrder extends Model {
  constructor() {
    super('PurchaseOrder', purchaseOrderSchema);
  }
}

const purchaseOrder = new PurchaseOrder()

module.exports = purchaseOrder;
