const validate = require('koa2-validation');
const Joi = require('joi');
const router = require('koa-router')();
const {dailyDiet} = require('../controllers');

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
  addDailyDiet: {
    body: Joi.object({
      name: Joi.string().required(), // 所属公示表名称
      dietTableId: Joi.string().required(), // 所属公示表Id
      date: Joi.date().required(), // 日期
      materials: Joi.array().items(Joi.object({
        name: Joi.string().required(), // 名称
        quantity: Joi.number().required(), // 数量
        unit: Joi.string().required(), // 单位
        price: Joi.number().required(), // 单价
        totalPrice: Joi.number() // 总价
      })),
      cookbook: Joi.array().items(Joi.string()), // 食谱
      totalCount: Joi.number(), // 总就餐人数
      actualCount: Joi.number(), // 实际就餐人数
      totalPrice:  Joi.number(), // 总计
      averagePrice:  Joi.number(), // 人均
    })
  },
  findDailyDiet: {
    query: Joi.object({
      page: Joi.number(), // 页码
      pageSize: Joi.number(), // 页数
      dietTableId: Joi.string()
    })
  },
  exportDailyDiet: {
    body: Joi.object({
      id: Joi.string().required(), // id
      fileName: Joi.string().required(), // 文件名
    })
  }
}

class DailyDiet extends Route {
  constructor() {
    super();
  }

  @request('get', '/daily-diet/')
  @summary('获取每日饮食')
  @tags(['每日饮食'])
  @query(convert2json(validation.findDailyDiet))
  findDailyDiet() {
    router.get('/', validate(validation.findDailyDiet), async (ctx, next) => {
      let reqParams = ctx.query;
      console.log("+++++++++++++++++++");
      ctx.body = await dailyDiet.findDailyDiet(reqParams);
    });
  }

  @request('post', '/daily-diet/add')
  @summary('添加每日饮食')
  @tags(['每日饮食'])
  @body(convert2json(validation.addDailyDiet))
  addDailyDiet() {
    router.post('/add', validate(validation.addDailyDiet), async (ctx, next) => {
      let reqBody = ctx.request.body;
      reqBody.creatorId = ctx.request.decoded.id;
      reqBody.creator = ctx.request.decoded.id;
      ctx.body = await dailyDiet.addDailyDiet(reqBody);
    });
  }

  @request('post', '/daily-diet/export')
  @summary('导出每日饮食')
  @tags(['每日饮食'])
  @body(convert2json(validation.exportDailyDiet))
  exportDailyDiet() {
    router.post('/export', validate(validation.exportDailyDiet), async (ctx, next) => {
      let reqParams = ctx.request.body;
      ctx.body = await dailyDiet.exportDailyDiet(reqParams);
      ctx.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=${reqParams.fileName}.xlsx`
      });
    });
  }
}

new DailyDiet().route();

module.exports = router;
