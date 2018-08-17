let {cookbook} = require('../models');
const response = require('../utils/response');

class CookbookController {
  constructor() {}
  async addCookbook(reqBody) {
    let dataArr = {
      ...reqBody
    }
    try {
      console.log("添加食谱");
      const newCookbook = await cookbook.create(dataArr);
      const respon = response({data: newCookbook});
      return respon;
    } catch (err) {
      console.log(err)
      throw new Error(err);
      return err;
    }
  }

  // 获取材料
  // async getMaterial(reqParams) {
  //   try {
  //     let respon = {};
  //     let result = await material.findOne(reqParams);
  //     respon = response({data: result});
  //     return respon;
  //   } catch (err) {
  //     console.log(err)
  //     throw new Error(err);
  //     return err;
  //   }
  //
  // }

  // 查询食谱
  async findCookbook(reqParams) {
    try {
      let respon = {};
      let result = await cookbook.find(reqParams);
      respon = response({data: result});
      return respon;
    } catch (err) {
      console.log(err)
      throw new Error(err);
      return err;
    }

  }

  // 搜索食谱
  async searchCookbook(reqParams) {
    try {
      let respon = {};
      let result = await cookbook.search('name', reqParams);
      respon = response({data: result});
      return respon;
    } catch (err) {
      console.log(err)
      throw new Error(err);
      return err;
    }

  }
}

const cookbookController = new CookbookController();

module.exports = cookbookController;
