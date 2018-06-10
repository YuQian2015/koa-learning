const validate = require('koa2-validation');
const Joi = require('joi');
const {material} = require('../controllers');
const router = require('koa-router')();

const addMaterial = {
  body: {
    // code: Joi.string().required(), // 食材编号
    name: Joi.string().required(), // 名称
    unit: Joi.string(), // 单位
    price: Joi.number(), // 单价
    type: Joi.number(), // 类型
    createDate: Joi.date() // 创建时间
  }
}

const getMaterial = {
  params: {
    code: Joi.string().required(), // 食材编号
  }
}

router.post('/add', validate(addMaterial), async (ctx, next) => {
  let reqBody = ctx.request.body;
  ctx.body = await material.addMaterial(reqBody);
});

router.get('/:code', validate(getMaterial), async (ctx, next) => {
  let reqParams = ctx.params;
  ctx.body = await material.getMaterial(reqParams);
});

module.exports = router;
