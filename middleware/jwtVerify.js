const jwt = require('jsonwebtoken');
const config = require('config');
const response = require('../utils/response');
const jwtSecret = config.get('Token.jwtSecret');
const verify = () => {
  return async (ctx, next) => {
    const token = ctx.request.header.authorization;
    if (token) {
      let codeStr = token.split(" ")[1];
      console.log(`-------------------获得请求的token------------------${codeStr}`);
      try {
        ctx.request.decoded = jwt.verify(codeStr, jwtSecret);
        await next();
      } catch (err) {
        console.log("-------------------解析请求token失败------------------");
        console.log(err);
        if (err.name == 'TokenExpiredError') {
          ctx.status = 401;
          ctx.body = response({errorCode: '004'})
        }
        // else {
        //   ctx.body = response({errorCode: '003'})
        // }
        throw err;
      }
      return;
    }
    console.log("-------------------没有token------------------");
    await next();
  }
}
module.exports = verify;
