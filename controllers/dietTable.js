let {dietTable} = require('../models');
const response = require('../utils/response');

class DietTableController {
  constructor() {}
  async addDietTable(reqBody) {
    let dataArr = {
      ...reqBody
    }
    try {
      console.log("添加公示表");
      const newDietTable = await dietTable.create(dataArr);
      const respon = response({data: newDietTable});
      return respon;
    } catch (err) {
      console.log(err)
      throw new Error(err);
      return err;
    }
  }
  async findDietTable(reqParams) {
    try {
      let respon = {};
      let result = await dietTable.find(reqParams);
      respon = response({data: result});
      return respon;
    } catch (err) {
      console.log(err)
      throw new Error(err);
      return err;
    }

  }
}

const dietTableController = new DietTableController();

module.exports = dietTableController;
