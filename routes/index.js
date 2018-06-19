const jwt = require('koa-jwt');
const config = require('config');
const apiVersion = config.get('App.apiVersion');
const jwtSecret = config.get('Token.jwtSecret');
const response = require('../utils/response');
const users = require('./users');
const material = require('./material');
const purchase = require('./purchase');
const public = require('./public');
const routeConfig = [
  {
    path: '/users',
    route: users
  }, {
    path: '/material',
    route: material
  }, {
    path: '/purchase',
    route: purchase
  }
]
const publicRouteConfig = [
  {
    path: '/public',
    route: public
  }
]

const Router = require('koa-router');
const router = new Router();
router.prefix(apiVersion); // 设置路由前缀

const index = (ctx, next) => {
  ctx.response.body = 'Hello World';
};


router.get('/', index);

// 处理token验证出错，返回401,处理其它错误
router.use( (ctx, next) => {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = response({
        errorCode: '003'
      })
    } else {
      ctx.status = err.status || err.code;
      ctx.body = response({
        errorCode: ctx.status,
        msg: err.message
      });
      throw err;
    }
  });
});

for (item in publicRouteConfig) {
  router.use(publicRouteConfig[item].path, publicRouteConfig[item].route.routes(), publicRouteConfig[item].route.allowedMethods());
}
// 只有token验证通过了之后才执行这一行以后的中间件
router.use(jwt({ secret: jwtSecret }));

for (item in routeConfig) {
  router.use(routeConfig[item].path, routeConfig[item].route.routes(), routeConfig[item].route.allowedMethods());
}

module.exports = router;
