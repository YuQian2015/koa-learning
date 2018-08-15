const jwt = require('jsonwebtoken');
const config = require('config');
const response = require('../utils/response');
const jwtSecret = config.get('Token.jwtSecret');
const verify = () => {
  return async (ctx, next) => {
    const token = ctx.request.header.authorization;
    if (token) {
      let codeStr = token.split(" ")[1];
      console.log(codeStr);
      try {
        ctx.request.decoded = jwt.verify(codeStr, jwtSecret);
        await next();
      } catch (err) {
        // ctx.status = 401;
        // if (err.name == 'TokenExpiredError') {
        //   ctx.body = response({errorCode: '004'})
        // } else {
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
