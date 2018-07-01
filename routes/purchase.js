const validate = require('koa2-validation');
const Joi = require('joi');
const {purchase} = require('../controllers');
const router = require('koa-router')();

const Route = require('./route');
const convert2json = require('../utils/joi2json');
const { request, summary, query, path, body, tags } = require('koa-swagger-decorator');

const validation = {
  addPurchase: {
    body: Joi.object({
      code: Joi.number().required(), // 食材编号
      purchasingDate: Joi.date().required(), // 采购日期
      name: Joi.string().required(), // 食品名称
      manufactureDate: Joi.date(), // 生产日期
      qualityPeriod: Joi.date(), // 保质期
      quantity: Joi.number().required(), // 数量
      unit: Joi.string(), // 单位
      price: Joi.number().required(), // 单价
      totalPrice: Joi.number().required(), // 金额
      purchaserName: Joi.string().required(), // 采购人
      inspectorName: Joi.string().required(), // 收验货人
      supplierName: Joi.string().required(), // 供货人
      sign: Joi.string().required(), // 签字
      purchaseOrderId: Joi.string().required() // 所属采购单
    })
  }
}
class Purchase extends Route {
  constructor() {
    super();
  }

  @request('post', '/purchase/add')
  @summary('添加采购项目')
  @tags(['采购'])
  @body(convert2json(validation.addPurchase))
  addPurchase() {
    router.post('/add', validate(validation.addPurchase), async (ctx, next) => {
      let reqBody = ctx.request.body;
      ctx.body = await purchase.addPurchase(reqBody);
    });
  }
}

new Purchase().route();

module.exports = router;
