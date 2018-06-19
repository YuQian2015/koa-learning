let {purchase} = require('../models');
const response = require('../utils/response');

class PurchaseController {
  constructor() {}
  async addPurchase(reqBody) {
    let dataArr = { // 添加创建时间
      ...reqBody,
      createDate: new Date()
    }
    try {
      console.log("添加采购项目");
      let newPurchase = await purchase.create(dataArr);
      let respon = response({data: newPurchase});
      return respon;
    } catch (err) {
      console.log(err)
      throw new Error(err);
      return err;
    }
  }
}

const purchaseController = new PurchaseController();

module.exports = purchaseController;
