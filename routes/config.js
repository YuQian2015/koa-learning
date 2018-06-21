
const Joi = require('joi');
const config = {
  validation: {
    addMaterial: {
      body: Joi.object({
        // code: Joi.string().required(), // 食材编号
        name: Joi.string().required(), // 名称
        unit: Joi.string(), // 单位
        price: Joi.number(), // 单价
        type: Joi.number(), // 类型
        createDate: Joi.date() // 创建时间
      })
    },
    getMaterial: {
      params: {
        code: Joi.string().required(), // 食材编号
      }
    },
    findMaterial: {
      query: {
        page: Joi.number(), // 页码
        pageSize: Joi.number(), // 页数
        name: Joi.string() // 关键词
      }
    }
  }
}

module.exports = config;
