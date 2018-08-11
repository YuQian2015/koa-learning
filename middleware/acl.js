const mongoose = require('mongoose');
const response = require('../utils/response');
const aclFunc = require('../utils/aclFunc');

const acl = require('acl');

const aclMiddleware = () => {
  return async (ctx, next) => {
    let db = mongoose.connection;
    const mongoBackend = new acl.mongodbBackend(db.db, 'acl_', {useSingle: true});
    const aclInstence = new acl(mongoBackend);

    // guest is allowed to view blogs
    aclInstence.allow('guest', 'public', ['GET', 'POST']);
    aclInstence.allow('guest', '/v1/public/signin', ['GET', 'POST']);
    aclInstence.allow('guest', '/v1/public/register', ['GET', 'POST']);
    aclInstence.allow('guest', '/v1/swagger-html', ['GET', 'POST', 'PUT', 'DELETE']);
    aclInstence.allow('guest', '/v1/swagger-json', ['GET', 'POST', 'PUT', 'DELETE']);


    // allow function accepts arrays as any parameter
    aclInstence.allow('member', 'all', ['GET', 'POST', 'PUT'])

    aclInstence.allow('admin', 'all', ['GET', 'POST', 'PUT', 'DELETE'])

    // let user = 'visitor';
    let group = 'guest';
    if (ctx.request.decoded) {
      console.log(ctx.request.decoded);
      // user = ctx.request.decoded.email;
      group = ctx.request.decoded.group;
    }

    // aclInstence.addUserRoles(user, group); // 将当前用户的角色权限存入数据库

    let {method, url} = ctx.request;
    if(group == 'admin' || group == 'member') { // 临时开启权限
      url = 'all'
    }

    let result = await aclFunc.areAnyRolesAllowed(aclInstence, group, url, method); // 根据角色来判断
    // let result = await aclFunc.isAllowed(aclInstence, user, url, method); // 根据用户来判断
    if (result) {
      await next();
    } else {
      ctx.status = 403;
      ctx.body = response({errorCode: '005'});
      console.log(ctx.response);
    }
  }
}
module.exports = aclMiddleware;
