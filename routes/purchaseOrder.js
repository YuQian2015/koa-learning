const validate = require('koa2-validation');
const Joi = require('joi');
const {purchaseOrder} = require('../controllers');
const router = require('koa-router')();

const Route = require('./route');
const convert2json = require('../utils/joi2json');
const { request, summary, query, path, body, tags } = require('koa-swagger-decorator');

const validation = {
  addPurchaseOrder: {
    body: Joi.object({
        name: Joi.string().required(), // 采购单名称
        type: Joi.string(), // 采购单类型
        createDate: Joi.date(), // 创建时间
        updateDate: Joi.date(),
    })
  },

  findPurchaseOrder: {
    query: Joi.object({
      page: Joi.number(), // 页码
      pageSize: Joi.number(), // 页数
      name: Joi.string() // 关键词
    })
  },
}
class PurchaseOrder extends Route {
  constructor() {
    super();
  }

  @request('post', '/purchase-order/add')
  @summary('添加采购单')
  @tags(['采购单'])
  @body(convert2json(validation.addPurchaseOrder))
  addPurchaseOrder() {
    router.post('/add', validate(validation.addPurchaseOrder), async (ctx, next) => {
      let reqBody = ctx.request.body;
      reqBody.creatorId = ctx.request.decoded.id;
      reqBody.creator = ctx.request.decoded.id;
      ctx.body = await purchaseOrder.addPurchaseOrder(reqBody);
    });
  }

  @request('get', '/purchase-order/')
  @summary('获取采购单')
  @tags(['采购单'])
  @query(convert2json(validation.findPurchaseOrder))
  findPurchaseOrder() {
    router.get('/', validate(validation.findPurchaseOrder), async (ctx, next) => {
      let reqParams = ctx.query;
      reqParams.creatorId = ctx.request.decoded.id;
      ctx.body = await purchaseOrder.findPurchaseOrder(reqParams);
    });
  }
}

new PurchaseOrder().route();

module.exports = router;
