const path = require('path');
const jwt = require('koa-jwt');
const config = require('config');
const apiVersion = config.get('App.apiVersion');
const jwtSecret = config.get('Token.jwtSecret');
const response = require('../utils/response');
const users = require('./users');
const material = require('./material');
const purchase = require('./purchase');
const purchaseOrder = require('./purchaseOrder');
const cookbook = require('./cookbook');
const dietTable = require('./dietTable');
const dailyDiet = require('./dailyDiet');
const publicRouter = require('./public');
const {wrapper} = require('koa-swagger-decorator');
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
  }, {
    path: '/purchase-order',
    route: purchaseOrder
  }, {
    path: '/cookbook',
    route: cookbook
  }, {
    path: '/diet-table',
    route: dietTable
  }, {
    path: '/daily-diet',
    route: dailyDiet
  }
]
const publicRouteConfig = [
  {
    path: '/public',
    route: publicRouter
  }
]

const Router = require('koa-router');
const router = new Router();
wrapper(router);
router.prefix(apiVersion); // 设置路由前缀

// 将 swagger文档配置到 http://localhost:3000/${api版本}/swagger-html
router.swagger({
  title: '从零开始的koa实战',
  description: 'API 文档',
  version: '1.0.0',

  prefix: apiVersion, // 可选参数，默认是跟路径，如果使用了嵌套路由，可以使用这个参数。

  swaggerHtmlEndpoint: '/swagger-html', // 可选参数 默认是/swagger-html

  swaggerJsonEndpoint: '/swagger-json', // 可选参数 默认是/swagger-json

  // [optional] additional options for building swagger doc
  // eg. add api_key as shown below
  // swaggerOptions: {
  //   securityDefinitions: {
  //     api_key: {
  //       type: 'apiKey',
  //       in: 'header',
  //       name: 'api_key',
  //     },
  //   },
  // },
})
// map all static methods at Test class for router
// router.map(Test);

// mapDir will scan the input dir, and automatically call router.map to all Router Class
router.mapDir(path.resolve(__dirname), {
  // default: true. To recursively scan the dir to make router. If false, will not scan subroutes dir
  // recursive: true,
  // default: true, if true, you can call ctx.validatedBody[Query|Params] to get validated data.
  // doValidation: true,
})

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

for (let item in publicRouteConfig) {
  router.use(publicRouteConfig[item].path, publicRouteConfig[item].route.routes(), publicRouteConfig[item].route.allowedMethods());
}
// 只有token验证通过了之后才执行这一行以后的中间件
router.use(jwt({ secret: jwtSecret }));

for (let item in routeConfig) {
  router.use(routeConfig[item].path, routeConfig[item].route.routes(), routeConfig[item].route.allowedMethods());
}

module.exports = router;
