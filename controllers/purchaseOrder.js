let {purchaseOrder} = require('../models');
const response = require('../utils/response');

class PurchaseOrderController {
  constructor() {}
  async addPurchaseOrder(reqBody) {
    let dataArr = {
      ...reqBody
    }
    try {
      console.log("添加采购单");
      let newPurchaseOrder = await purchaseOrder.create(dataArr);
      let respon = response({data: newPurchaseOrder});
      return respon;
    } catch (err) {
      console.log(err)
      throw new Error(err);
      return err;
    }
  }

  // 查询采购单
  async findPurchaseOrder(reqParams) {
    try {
      let respon = {};
      let result = await purchaseOrder.find(reqParams);
      respon = response({data: result});
      return respon;
    } catch (err) {
      console.log(err)
      throw new Error(err);
      return err;
    }

  }
}

const purchaseOrderController = new PurchaseOrderController();

module.exports = purchaseOrderController;
