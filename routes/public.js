const validate = require('koa2-validation'); // 引入 koa2-validation
const Joi = require('joi');
const router = require('koa-router')();
const {user} = require('../controllers');

const Route = require('./route');
const convert2json = require('../utils/joi2json');
const { request, summary, query, path, body, tags } = require('koa-swagger-decorator');

// 定义用于验证的 schema
const register = {
  body: {
    email: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.number().required()
  }
};

const signin = {
  body: {
    email: Joi.string().required(),
    password: Joi.number().required()
  }
}

const validation = {
  register: {
    body: Joi.object({
      email: Joi.string().required(),
      name: Joi.string().required(),
      password: Joi.string().required()
    })
  },

  signin: {
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required()
    })
  }
}

class Public extends Route {
  constructor() {
    super();
  }

  @request('post', '/public/register')
  @summary('注册')
  @tags(['公用'])
  @body(convert2json(validation.register))
  register() {
    // 新增一个post路由，用来接收post请求
    router.post('/register', validate(validation.register), async (ctx, next) => { // 设置需要验证的中间件
      // 接收客户端请求传递的数据
      let reqBody = ctx.request.body;
      console.log(ctx.request.body);
      ctx.body = await user.register(reqBody);
    });
  }

  @request('post', '/public/signin')
  @summary('登录')
  @tags(['公用'])
  @body(convert2json(validation.signin))
  signin() {
    // 用户登录接口
    router.post('/signin', validate(validation.signin), async (ctx, next) => {
      let reqBody = ctx.request.body;
      ctx.body = await user.signin(reqBody);
    });
  }
}

new Public().route();

module.exports = router;
