const validate = require('koa2-validation');
const Joi = require('joi');
const router = require('koa-router')();
const {material} = require('../controllers');

const Route = require('./route');
const convert2json = require('../utils/joi2json');
const {
  request,
  summary,
  query,
  path,
  body,
  tags
} = require('koa-swagger-decorator');

const validation = {
  addMaterial: {
    body: Joi.object({
      // code: Joi.string().required(),  食材编号
      name: Joi.string().required(), // 名称
      unit: Joi.string(), // 单位
      price: Joi.number(), // 单价
      type: Joi.number() // 类型
    })
  },
  getMaterial: {
    params: Joi.object({
      code: Joi.string().required(), // 食材编号
    })
  },
  findMaterial: {
    query: Joi.object({
      page: Joi.number(), // 页码
      pageSize: Joi.number(), // 页数
      name: Joi.string() // 关键词
    })
  },
  searchMaterial: {
    body: Joi.object({
      keyword: Joi.string().required(), // 关键词
      filter: Joi.object({

      })
    })
  }
}

class Material extends Route {
  constructor() {
    super();
  }

  @request('get', '/material/')
  @summary('获取食材')
  @tags(['食材'])
  @query(convert2json(validation.findMaterial))
  findMaterial() {
    router.get('/', validate(validation.findMaterial), async (ctx, next) => {
      let reqParams = ctx.query;
      ctx.body = await material.findMaterial(reqParams);
    });
  }

  @request('post', '/material/add')
  @summary('添加食材')
  @tags(['食材'])
  @body(convert2json(validation.addMaterial))
  addMaterial() {
    router.post('/add', validate(validation.addMaterial), async (ctx, next) => {
      let reqBody = ctx.request.body;
      ctx.body = await material.addMaterial(reqBody);
    });
  }

  @request('get', '/material/{code}')
  @summary('查询食材详情')
  @tags(['食材'])
  @path(convert2json(validation.getMaterial))
  getMaterial() {
    router.get('/:code', validate(validation.getMaterial), async (ctx, next) => {
      let reqParams = ctx.params;
      ctx.body = await material.getMaterial(reqParams);
    });
  }

  @request('post', '/material/search')
  @summary('搜索食材')
  @tags(['食材'])
  @body(convert2json(validation.searchMaterial))
  searchMaterial() {
    router.post('/search', validate(validation.searchMaterial), async (ctx, next) => {
      let reqBody = ctx.request.body;
      ctx.body = await material.searchMaterial(reqBody);
    });
  }
}

new Material().route();

module.exports = router;
