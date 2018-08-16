const jwt = require('jsonwebtoken');
const config = require('config');
const response = require('../utils/response');
const jwtSecret = config.get('Token.jwtSecret');
const verify = () => {
  return async (ctx, next) => {
    const token = ctx.request.header.authorization;
    console.log("-------------------------------------------");
    if (token) {
      let codeStr = token.split(" ")[1];
      console.log(codeStr);
      try {
        ctx.request.decoded = jwt.verify(codeStr, jwtSecret);
        console.log(ctx.request.decoded);
        await next();
      } catch (err) {
        console.log("-------------------------------------------");
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
    await next();
  }
}
module.exports = verify;
