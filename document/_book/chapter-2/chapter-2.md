## koa原生路由实现

### 查看路由信息

首先，需要通过 ctx.request.url 获取到当前请求的地址，然后通过解析地址得知需要执行的操作，我们通过以下代码来实现查看路由：

```js
app.use( ( ctx ) => {
  let url = ctx.request.url
  ctx.body = url
})
```

启动服务之后我们在浏览器访问 http://localhost:3000 下的任何一个url即可在页面中看到返回的 路由信息。

### 使用内容协商

> 补充

### 设置不同路由

接下来我们通过对路由地址进行判断，从对应的地址取到html页面并返回到浏览器显示。

首先，要取到html的内容，我们需要读取HTML文件，假设我们的HTML文件都在 pages 目录：

pages/index.html

```html
<h1>Index Page</h1>
<a href="index">index</a>
<a href="me">me</a>
```

pages/me.html

```html
<h1>Me Page</h1>
<a href="index">index</a>
<a href="me">me</a>
```

我们需要从这个目录下读取页面，并且返回到浏览器显示。

app.js

```js
// 省略
const fs = require('fs'); // 引入fs

// 从pages目录读取HTML文件
function readPage( page ) {
  return new Promise(( resolve, reject ) => {
    let viewUrl = `./pages${page}.html`
    fs.readFile(viewUrl, "binary", ( err, data ) => {
      if ( err ) {
        reject( err )
      } else {
        resolve( data )
      }
    })
  })
}
app.use( async (ctx, next) => {
  let url = ctx.request.url
  ctx.response.type = 'html';
  ctx.body = await readPage(url);
});


```

然后我们启动服务，在浏览器访问 http://localhost:3000/index ，我们可以看到页面已经显示出来，点击里面的连接，就能够切换不同的页面。



## koa-router - 添加路由

### 安装和引入

> 待补充

考虑到使用原生路由处理请求会很繁琐，我们使用 [koa-router](https://github.com/alexmingoia/koa-router) 中间件来为项目添加路由，执行以下命令安装 koa-router：

```shell
npm install koa-router
```

修改 app.js 的代码为：

```js
const Koa = require('koa');
const app = new Koa();

const Router = require('koa-router');
const router = new Router();

const index = (ctx, next) => {
  ctx.response.body = 'Hello World';
};

const me = (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = '<a href="/">me</a>';
};

router.get('/', index);
router.get('/me', me);

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
```

在以上代码中，我们使用 `ctx.response.type` 来设置响应的类型，响应内容为 HTML 标签，执行 `npm start`，在浏览其中访问 http://localhost:3000/ 我们看到显示了"Hello World"，修改地址到 http://localhost:3000/me 则页面显示一个跳转链接。

### 单独管理路由

考虑到以后项目会复杂很多，我们把路由独立出来，新增 /routes 目录，在这个目录下面创建 index.js，将 app.js 中的路由代码放入 routes/index.js。

routes/index.js

```js
const Router = require('koa-router');
const router = new Router();

const index = (ctx, next) => {
  ctx.response.body = 'Hello World';
};

const me = (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = '<a href="/">me</a>';
};

router.get('/', index);
router.get('/me', me);

module.exports = router;
```

为了使新增的路由生效，我们还需要在 app.js 中引入刚刚新增的文件：

app.js

```js
const routes = require('./routes');

app
  .use(routes.routes())
  .use(routes.allowedMethods());
```

我们可以重新启动服务，访问 http://localhost:3000/me 看看是否生效。



### 路由模块化 模块+方法

为了细化路由，根据业务分开管理路由，在 routes/ 目录新增 users.js：

routes/users.js

```js
const router = require('koa-router')();

router.get('/', (ctx, next) => {
  ctx.response.body = 'users';
});

module.exports = router;
```

修改routes/index.js：

```js
const users = require('./users');

const Router = require('koa-router');
const router = new Router();

const index = (ctx, next) => {
  ctx.response.body = 'Hello World';
};

router.get('/', index);
router.use('/users', users.routes(), users.allowedMethods()); // 设置users的路由

module.exports = router;
```
> 代码描述 补充

重启服务，访问 http://localhost:3000 和 http://localhost:3000/users 即可看到新配置的路由。

### 路由前缀

在根目录新增文件夹config，在该文件夹下新增文件 config.js

config/config.js：

```js
const CONFIG = {
    "API_VERSION": "/v1" //配置了路由的版本
}

module.exports = CONFIG;
```

在 app.js 中引入并设置前缀

```js
global.config = require('./config/config');
const routes = require('./routes'); // 在设置了config之后引入路由
```

修改routes/index.js：

```js
const users = require('./users');

const Router = require('koa-router');
const router = new Router();
router.prefix(global.config.API_VERSION); // 设置路由前缀

const index = (ctx, next) => {
  ctx.response.body = 'Hello World';
};

router.get('/', index);
router.use('/users', users.routes(), users.allowedMethods());

module.exports = router;
```

重新启动服务，访问 http://localhost:3000/v1 和  http://localhost:3000/v1/users 即可看到新配置的路由。
