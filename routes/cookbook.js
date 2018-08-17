const validate = require('koa2-validation');
const Joi = require('joi');
const router = require('koa-router')();
const {cookbook} = require('../controllers');

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
  addCookbook: {
    body: Joi.object({
      name: Joi.string().required(), // 名称
      materials: Joi.array().required(), // 使用的材料
    })
  },
  // getMaterial: {
  //   params: Joi.object({
  //     code: Joi.string().required(),  食材编号
  //   })
  // },
  findCookbook: {
    query: Joi.object({
      page: Joi.number(), // 页码
      pageSize: Joi.number(), // 页数
      name: Joi.string() // 材料名
    })
  },
  searchCookbook: {
    body: Joi.object({
      keyword: Joi.string().required(), // 关键词
      filter: Joi.object({})
    })
  }
}

class Cookbook extends Route {
  constructor() {
    super();
  }

  @request('get', '/cookbook/')
  @summary('获取食谱')
  @tags(['食谱'])
  @query(convert2json(validation.findCookbook))
  findCookbook() {
    router.get('/', validate(validation.findCookbook), async (ctx, next) => {
      let reqParams = ctx.query;
      ctx.body = await cookbook.findCookbook(reqParams);
    });
  }

  @request('post', '/cookbook/add')
  @summary('添加食谱')
  @tags(['食谱'])
  @body(convert2json(validation.addCookbook))
  addCookbook() {
    router.post('/add', validate(validation.addCookbook), async (ctx, next) => {
      let reqBody = ctx.request.body;
      ctx.body = await cookbook.addCookbook(reqBody);
    });
  }

  // @request('get', '/material/{code}')
  // @summary('查询食材详情')
  // @tags(['食材'])
  // @path(convert2json(validation.getMaterial))
  // getMaterial() {
  //   router.get('/:code', validate(validation.getMaterial), async (ctx, next) => {
  //     let reqParams = ctx.params;
  //     ctx.body = await material.getMaterial(reqParams);
  //   });
  // }
  //
  @request('post', '/cookbook/search')
  @summary('搜索食谱')
  @tags(['食谱'])
  @body(convert2json(validation.searchCookbook))
  searchCookbook() {
    router.post('/search', validate(validation.searchCookbook), async (ctx, next) => {
      let reqBody = ctx.request.body;
      ctx.body = await cookbook.searchCookbook(reqBody);
    });
  }
}

new Cookbook().route();

module.exports = router;
