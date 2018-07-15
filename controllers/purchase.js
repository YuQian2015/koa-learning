let {purchase} = require('../models');
const response = require('../utils/response');

class PurchaseController {
  constructor() {}
  async addPurchase(reqBody) {
    let dataArr = {
      ...reqBody
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

  // 查询采购
  async findPurchase(reqParams) {
    try {
      let respon = {};
      let result = await purchase.find(reqParams);
      respon = response({data: result});
      return respon;
    } catch (err) {
      console.log(err)
      throw new Error(err);
      return err;
    }

  }
  // 修改采购
  async updatePurchase(id, reqBody) {
    try {
      let respon = {};
      let result = await purchase.findOneAndUpdate({_id:id},reqBody);
      respon = response({data: result});
      return respon;
    } catch (err) {
      console.log(err)
      throw new Error(err);
      return err;
    }
  }

  // 删除采购
  async deletePurchase(id) {
    try {
      let respon = {};
      let result = await purchase.findOneAndRemove({_id: id});
      respon = response({data: result});
      return respon;
    } catch (err) {
      console.log(err)
      throw new Error(err);
      return err;
    }
  }

    // 导出采购
    async exportPurchase(reqParams) {
      try {
        let result = await purchase.exportExcel(reqParams);
        return result;
      } catch (err) {
        console.log(err)
        throw new Error(err);
        return err;
      }

    }
}

const purchaseController = new PurchaseController();

module.exports = purchaseController;
