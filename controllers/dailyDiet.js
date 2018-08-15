let {dailyDiet} = require('../models');
const response = require('../utils/response');

class DailyDietController {
  constructor() {}
  async addDailyDiet(reqBody) {
    let dataArr = {
      ...reqBody,
      dietTable: reqBody.dietTableId
    }
    try {
      console.log("添加每日饮食");
      const newDailyDiet = await dailyDiet.create(dataArr);
      const respon = response({data: newDailyDiet});
      return respon;
    } catch (err) {
      console.log(err)
      throw new Error(err);
      return err;
    }
  }
  async findDailyDiet(reqParams) {
    try {
      let respon = {};
      let result = await dailyDiet.find(reqParams);
      respon = response({data: result});
      return respon;
    } catch (err) {
      console.log(err)
      throw new Error(err);
      return err;
    }

  }
}

const dailyDietController = new DailyDietController();

module.exports = dailyDietController;
