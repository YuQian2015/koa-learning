const validate = require('koa2-validation');
const Joi = require('joi');
const {purchase} = require('../controllers');
const router = require('koa-router')();

const addPurchase = {
  body: {
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
  }
}

router.post('/add', validate(addPurchase), async (ctx, next) => {
  let reqBody = ctx.request.body;
  ctx.body = await purchase.addPurchase(reqBody);
});

module.exports = router;
