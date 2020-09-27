
# koa学习笔记——context.js

## inspect

context.js定义了Context的prototype，其中 `inspect()` 返回了content的JSON输出。

```js

  inspect() {
    if (this === proto) return this;
    return this.toJSON(); // 调用了本身的 toJSON 方法
  }
```
为了查看 `inspect()` 返回的数据，我们可以在app中使用中间件输出：

```js
app.use((ctx, next) => {
  console.log(ctx.inspect());
});

```

在浏览器访问启动的服务，我们可以看到后台输出了如下信息：

```shell
{ request:
   { method: 'GET',
     url: '/',
     header:
      { host: 'localhost:3000',
        connection: 'keep-alive',
        'cache-control': 'max-age=0',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7',
        cookie: 'optimizelyEndUserId=oeu1506485206327r0.22103516481550334; _ga=GA1.1.473428676.1503736781' } },
  response:
   { status: 404,
     message: 'Not Found',
     header:
      { 'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET,HEAD,PUT,POST,DELETE' } },
  app: { subdomainOffset: 2, proxy: false, env: 'development' },
  originalUrl: '/',
  req: '<original node req>',
  res: '<original node res>',
  socket: '<original node socket>' }
```

关于上面这些信息，我们可以在 `toJSON()` 找到，toJSON 方法会把 context 的request、response、app等返回出来：

```js

  toJSON() {
    return {
      request: this.request.toJSON(),
      response: this.response.toJSON(),
      app: this.app.toJSON(),
      originalUrl: this.originalUrl,
      req: '<original node req>',
      res: '<original node res>',
      socket: '<original node socket>'
    };
  }
```

我们再来看在 application.js 中创建上下文的方法，在每次请求的时候，koa 都会创建一个context给中间件使用，这个context中，`req `  和 `res` 是Node原生的对象。`request` 封装了 req 对象，`response   ` 封装了 res 对象，提供了nodejs原生`req `   `res`  没有的方法 ：

```js
  createContext(req, res) {
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
      // 下面的代码使得ctx、request、response都能够相互使用
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;

    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.cookies = new Cookies(req, res, {
      keys: this.keys,
      secure: request.secure
    });
    request.ip = request.ips[0] || req.socket.remoteAddress || '';
    context.accept = request.accept = accepts(req);
    context.state = {};
    return context;
  }
```

## 错误抛出

context 通过 throw 抛出错误，支持的写法有多种：

```js
this.throw(403)
this.throw('name required', 400)
this.throw(400, 'name required')
this.throw('something exploded')
this.throw(new Error('invalid'), 400);
this.throw(400, new Error('invalid'));
```

```js
const createError = require('http-errors');

throw(...args) {
    throw createError(...args);
},
```

assert使用了http-assert 模块来添加了声明，有点类似于throw ， 使用方法

```js
this.assert(this.user, 401, 'User not found. Please login!');
```



```js
const httpAssert = require('http-assert');

assert: httpAssert,
```

## 默认的错误处理

```js
// 通过接受错误来做出处理，如果没有错误则不做任何处理。

  onerror(err) {
    // don't do anything if there is no error.
    // this allows you to pass `this.onerror`
    // to node-style callbacks.
    if (null == err) return;

    if (!(err instanceof Error)) err = new Error(util.format('non-error thrown: %j', err));

    let headerSent = false;
    if (this.headerSent || !this.writable) {
      headerSent = err.headerSent = true;
    }

    // delegate
    this.app.emit('error', err, this);

    // nothing we can do here other
    // than delegate to the app-level
    // handler and log.
    if (headerSent) {
      return;
    }

    const { res } = this;

    // first unset all headers
    if (typeof res.getHeaderNames === 'function') {
      res.getHeaderNames().forEach(name => res.removeHeader(name));
    } else {
      res._headers = {}; // Node < 7.7
    }

    // then set those specified
    this.set(err.headers);

    // force text/plain
    this.type = 'text';

    // ENOENT support
    if ('ENOENT' == err.code) err.status = 404;

    // default to 500
    if ('number' != typeof err.status || !statuses[err.status]) err.status = 500;

    // respond
    const code = statuses[err.status];
    const msg = err.expose ? err.message : code;
    this.status = err.status;
    this.length = Buffer.byteLength(msg);
    this.res.end(msg);
  }
};

```

需要注意的是，`ctx.throw` 创建的错误，均为用户级别错误（标记为err.expose），会被返回到客户端。





## 代理属性和方法

在context.js中有一段如下的代码，把上下文的多数属性和方法委托代理到他的的 `request` 或 `response`，假如访问 `ctx.type` 和 `ctx.length` 将被代理到 `response` 对象，`ctx.path` 和 `ctx.method` 将被代理到 `request` 对象。 如：我们要获得请求路径需要执行 `ctx.request.path` ，但是由于代理过 `path` 这个属性，那么我们使用 `ctx.path` 也能够获得请求路径，即 `ctx.path === ctx.request.path` 。

```js
/**
 * Response delegation.
 */

delegate(proto, 'response')
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('set')
  .method('append')
  .method('flushHeaders')
  .access('status')
  .access('message')
  .access('body')
  .access('length')
  .access('type')
  .access('lastModified')
  .access('etag')
  .getter('headerSent')
  .getter('writable');

/**
 * Request delegation.
 */

delegate(proto, 'request')
  .method('acceptsLanguages')
  .method('acceptsEncodings')
  .method('acceptsCharsets')
  .method('accepts')
  .method('get')
  .method('is')
  .access('querystring')
  .access('idempotent')
  .access('socket')
  .access('search')
  .access('method')
  .access('query')
  .access('path')
  .access('url')
  .getter('origin')
  .getter('href')
  .getter('subdomains')
  .getter('protocol')
  .getter('host')
  .getter('hostname')
  .getter('URL')
  .getter('header')
  .getter('headers')
  .getter('secure')
  .getter('stale')
  .getter('fresh')
  .getter('ips')
  .getter('ip');
```

## 总结

通过上面的分析，我们知道content  上下文包含了以下内容

- ctx.req: Node.js 中的 request 对象
- ctx.res: Node.js 中的 response 对象，方法有:
- ctx.app: app 实例
- ctx.originalUrl
- ctx.request
- ctx.response
- ctx.socket

- ctx.throw(msg, [status]) 抛出常规错误的辅助方法，默认 status 为 500。
