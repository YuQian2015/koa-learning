const mongoose = require('mongoose');
const response = require('../utils/response');

const acl = require('acl');

const aclMiddleware = () => {
  return(ctx, next) => {
    let db = mongoose.connection;

    console.log(ctx.request);
    const mongoBackend = new acl.mongodbBackend(db.db, 'acl_', {useSingle: true});
    const aclInstence = new acl(mongoBackend);

    // guest is allowed to view blogs
    aclInstence.allow('guest', 'public', ['GET', 'POST']);
    // aclInstence.allow('guest', '/', ['GET']);

    // allow function accepts arrays as any parameter
    aclInstence.allow('member', 'material', ['edit', 'get', 'delete'])

    aclInstence.allow('admin', 'all', ['edit', 'get', 'delete'])

    // aclInstence.addRoleParents('baz', ['foo', 'bar'])
    let user = 'visitor';

    aclInstence.addUserRoles(user, 'guest')
    let method = ctx.request.method;
    let url = ctx.request.url;
    if (ctx.request.header.Authorization) {}

    aclInstence.isAllowed(user, url, method, async (err, res) => {
      console.log(res);
      console.log(err);
      if (err) {
        ctx.status = 403;
        ctx.body = response({errorCode: '000'});
        return
      }
      if (!res) {
        ctx.status = 403;
        ctx.body = response({errorCode: '004'});
        return
      }
      if (res) {
        console.log(`User ${user} is allowed to ${method} ${url}`)
        await next();
      }
    })
  }
}
module.exports = aclMiddleware;
