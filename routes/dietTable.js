const validate = require('koa2-validation');
const Joi = require('joi');
const router = require('koa-router')();
const { dietTable } = require('../controllers');

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
  addDietTable: {
    body: Joi.object({
      name: Joi.string().required(), // 名称
      materials: Joi.array().required(), // 使用的材料
    })
  },
  findDietTable: {
    query: Joi.object({
      page: Joi.number(), // 页码
      pageSize: Joi.number(), // 页数
      name: Joi.string() // 材料名
    })
  },
}

class DietTable extends Route {
  constructor() {
    super();
  }

  @request('get', '/diet-table/')
  @summary('获取公示表')
  @tags(['公示表'])
  @query(convert2json(validation.findDietTable))
  findDietTable() {
    router.get('/', validate(validation.findDietTable), async (ctx, next) => {
      let reqParams = ctx.query;
      ctx.body = await dietTable.findDietTable(reqParams);
    });
  }

  @request('post', '/diet-table/add')
  @summary('添加公示表')
  @tags(['公示表'])
  @body(convert2json(validation.addDietTable))
  addDietTable() {
    router.post('/add', validate(validation.addDietTable), async (ctx, next) => {
      let reqBody = ctx.request.body;
      ctx.body = await dietTable.addDietTable(reqBody);
    });
  }
}

new DietTable().route();

module.exports = router;
