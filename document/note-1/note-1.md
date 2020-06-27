
# koa学习笔记——**application.js**

## 创建服务 - app
使用 koa 创建服务非常简单，只需要简单几行代码就可以了：
```js
const Koa = require('koa'); // 引入koa
const app = new Koa(); // 创建app应用
app.listen(3000); // 监听3000端口
```

在上面的代码中，使用 `app.listen(3000)`  来创建一个服务， `app.listen(…)` 实际上是`http.createServer(app.callback()).listen(…)`  方法的语法糖:

```js
  listen(...args) {
	debug('listen');
	const server = http.createServer(this.callback()); // 这里传入了koa的 callback()
	return server.listen(...args);
  }
```

## 处理请求 - callback

### callback

从上面的代码中，我们看到在创建服务时，koa使用了`this.callback()` ，这个 callback 具体做了什么呢？我们先来看源码：

```js

const compose = require('koa-compose');
// 省略部分源码
callback() {
    const fn = compose(this.middleware); // 合并中间件

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => { // 这里接收了node.js的原生请求和响应
      const ctx = this.createContext(req, res); // 在这里创建了上下文
      return this.handleRequest(ctx, fn); // 把上下文交由 handleRequest 处理
    };

    return handleRequest;
  }
```
首先是使用 `compose` 将应用的中间件进行了合并，然后返回一个方法 `handleRequest`  来处理node的http请求。在 `handleRequest`  中接收请求时，不仅创建了上下文 `ctx` ，而且还调用了应用本身的 `handleRequest` 函数来处理请求。这其中有几个我们需要关心的东西：

- `compose` ——  `koa-compose` 中间件，用来对中间件进行合并
- `createContext` —— 用来创建上下文
- `handleRequest`——用来处理请求

接下来会一一对其进行介绍。

### createContext

这里简要分析 `createContext` 创建上下文，后面对koa context.js 源码进行分析的的时候会详细介绍 context。

先上源码：

```js
  /**
   * Initialize a new context.
   *
   * @api private
   */

  createContext(req, res) {
      // 首先分别创建了 context request response三个对象
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
      // 然后对三个对象进行了相互的赋值
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req; // 从参数接收到node.js原生请求
    context.res = request.res = response.res = res; // 从参数接收到node.js原生响应
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.cookies = new Cookies(req, res, {
      keys: this.keys,
      secure: request.secure
    }); // 为context 创建cookie处理
    request.ip = request.ips[0] || req.socket.remoteAddress || '';
    context.accept = request.accept = accepts(req); // 把请求接收类型也赋值给了context，accept被用来处理HTTP内容协商
    context.state = {};
    return context; // 最后返回 context
  }
```

我们从前面介绍的 callback 中知道，`createContext` 是在 `handleRequest` 中被调用的，而  `handleRequest` 讲接收的请求和响应传递给了 `createContext` ，因此我们知道在context中， `context.req` 和 `context.res` 就是node.js 的请求和响应。而上面的源码中对context、request、response的属性相互赋值，也使得我们能够在其中任意一个对象访问到其它对象，`createContext`  对上下文、请求、响应进行处理之后，返回了创建好的 context 。

### handleRequest

下面是应用的 `handleRequest` 函数，它在 `callback` 方法中被调用，接收了由 `createContext` 创建的上下文 `ctx` 和 `compose` 压缩的中间件`fnMiddleware` ，然后把 `ctx` 作为`fnMiddleware` 的参数传递并调用`fnMiddleware` 。当中间件执行完毕之后，会调用应用的 `respond()` 接收 `ctx` ，然后对响应进行处理。

```js

  /**
   * Handle request in callback.
   *
   * @api private
   */

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err); // 这里调用了context的错误处理
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror); // 当请求被关闭、完成、出错是会调用onerror
    return fnMiddleware(ctx).then(handleResponse).catch(onerror); // 将创建的上下文传递给中间件，最终返回响应，如果出错，也会调用onerror
  }
```

> 分析



## 上下文 - context

从上面的介绍可知

> Koa Context 将 node 的 `request` 和 `response` 对象封装到单个对象中，为编写 Web 应用程序和 API 提供了许多有用的方法。 这些操作在 HTTP 服务器开发中频繁使用，它们被添加到此级别而不是更高级别的框架，这将强制中间件重新实现此通用功能。每个请求都将创建一个 `Context`，并在中间件中作为接收器引用，或者 `ctx` 标识符。

```js
app.use(async ctx => {
  ctx; // 这是 Context
  ctx.request; // 这是 koa Request
  ctx.response; // 这是 koa Response
});
```

> 详细介绍



## 中间件-Middleware

### 使用 - app.use(function)

`app.use(fn)` 将给定的中间件方法添加到此应用程序的 `middleware` 数组。

当我们执行` use()` 时，会先判断传递的中间件是否是一个函数，如果不是就报出错误，再判断中间件是否是旧版的生成器 `generator` ，如果是，就使用 `koa-convert ` 来转换成新的中间件，最后将中间件push到 `middleware` 数组里面。

```js
  /**
   * Use the given middleware `fn`.
   *
   * Old-style middleware will be converted.
   *
   * @param {Function} fn
   * @return {Application} self
   * @api public
   */

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn); // 中间件添加到数组
    return this;
  }
```

从上面的源码我们可以看出，当我们在应用里面使用多个中间件时，`koa` 都会将它们放在自身的一个数组中。

### 中间件合并 - koa-compose

前面的介绍我们已经知道，在调用 `use` 方法时，我们会吧所有的中间件都放到应用的一个数组里面，最终在执行 callback 时被调用。而在 callback 中，中间件被 `koa-compose` 进行了压缩。我们来看  `koa-compose` 到底做了什么。

源码：

```js
'use strict'

/**
 * Expose compositor.
 */

module.exports = compose

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

解析：首先compose会先检测我们的中间件是否是一个数组，然后再开始遍历，并且对每一项都做了判断，看是否是一个函数。

dispatch 会返回一个Promise， 一开始执行dispatch()时，传递参数0，那么就会执行第一个中间件：

```js
Promise.resolve(function(context, next){ // 这里的next指向了dispatch.bind(null, i + 1)，也就是dispatch(1)
    // 中间件1的代码
}());
```

加入中间件里面写了next():

```js
Promise.resolve(function(context, next){
    // 中间件1的代码
    next()
    // 中间件1的后半部分代码
}());


// 结果
Promise.resolve(function(context, 中间件2){
    // 中间件1的代码
    Promise.resolve(function(context, next){ // 这里的next同样是指向下一个中间件的
        // 中间件2的代码
    }())
    // 中间件一第二部分代码
}());
```

以此类推，如果需要执行第三个中间件，我们也需要在第二个中间件里面添加next()

```js
Promise.resolve(function(context, 中间件2){
	//中间件一第一部分代码
	Promise.resolve(function(context, 中间件3){
		//中间件二第一部分代码
		Promise(function(context){
			//中间件三代码
		}());
		//中间件二第二部分代码
	})
	//中间件一第二部分代码
}());
```

执行到最后一个中间件时，dispatch 会调用这个Promise的next()，接着代码会从中间件三开始，再执行中间件二的第二部分代码，执行完毕，开始执行中间一第二部分代码，执行完毕，所有中间件加载完成。

 可以看到，Koa2.x是从第一个中间件开始，遇到await/yield next，就中断本中间件的代码执行，跳转到对应的下一个中间件执行，一直到最后一个中间件，中间件代码执行完成之后又执行上一个中间件await/yield next之后的代码，直到全部执行结束。

最终在调用app.listen()时，`koa` 放在 `middleware`  数组里面的中间件将会被合并，在处理响应的时候被调用。

### 转换中间件

我们来对比一下旧的和新的中间件，旧的中间件是一个传统的 generator  ，我们都是通过调用它的 next 来执行中间件的 `next` ，新的中间件是一个 promise 。

```js
function * legacyMiddleware (next) {
  // before
  yield next
  // after
}

function modernMiddleware (ctx, next) {
  // before
  return next().then(() => {
    // after
  })
}
```

> 待补充

### 写法

koa2用采用了es6，7的新特性，因为后端的很多操作方法，比如文件，数据库，都是异步的，所以这种将异步写法变为同步写法，是代码的可读性大大提高。

以前采用callback：

```js
exports.getUserList = function() {
	user.find({
	 _id: id,
	}, arr, function(e, numberAffected, raw) {
	  if(e){
		  respondata={
		    "code":"000",
		    "message":"error"
		  };
	  }else{
		  respondata={
		    "code":"200",
		    "message":"success"
		  };
	  }
	});
}

```

现在可以用 async await：

```js
exports.getUserList = async (ctx, next) => {
    try {
        let list = await user.find();
        let respon = {
            code: '200',
            message: 'success',
            data: list
        }
        return respon;
    } catch (err) {
        let respon = {
            code: '000',
            message: 'error',
            data: err
        }
        return respon;
    }
}
```

### 总结

中间件类似于一个过滤器，在客户端和应用程序之间处理请求和响应。

```js
.middleware1 {
  // (1) do some stuff
  .middleware2 {
    // (2) do some other stuff
    .middleware3 {
      // (3) NO next yield !
      // this.body = 'hello world'
    }
    // (4) do some other stuff later
  }
  // (5) do some stuff lastest and return
}
```

中间件的执行很像一个洋葱，但并不是一层一层的执行，而是以next为分界，先执行本层中next以前的部分，当下一层中间件执行完后，再执行本层next以后的部分。

![koa-middleware](koa-middleware.png)

```js
let koa = require('koa');
let app = new koa();

app.use((ctx, next) => {
  console.log(1)
  next(); // next不写会报错
  console.log(5)
});

app.use((ctx, next) => {
  console.log(2)
  next();
  console.log(4)
});

app.use((ctx, next) => {
  console.log(3)
  ctx.body = 'Hello World';
});

app.listen(3000);
// 打印出1、2、3、4、5
```

上述简单的应用打印出1、2、3、4、5，这就是一个洋葱结构，从上往下一层一层进来，再从下往上一层一层回去，解决复杂应用中频繁的回调而设计的级联代码，并不直接把控制权完全交给下一个中间件，而是碰到next去下一个中间件，等下面都执行完了，还会执行next以下的内容。



## Response处理

在前面的介绍之后可以看到，在请求经过中间件的处理完成之后，就会调用 callback 函数里面的 `handleResponse ` 来处理响应，`handleResponse ` 调了应用本身的 `respond`



koa处理响应的实现：

```js
/**
 * Response helper.
 */

function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  const res = ctx.res;
  if (!ctx.writable) return;  // 判断是否是context是否是可写的。

  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) { // 如果状态码是不需要返回body的类型，如果不希望返回body，statuses.empty 返回true
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ('HEAD' == ctx.method) {
    if (!res.headersSent && isJSON(body)) {
      ctx.length = Buffer.byteLength(JSON.stringify(body));
    }
    return res.end();
  }

  // status body
  if (null == body) {
    body = ctx.message || String(code);
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
```

> 待补充
