*我们使用路由，将URL解析到对应的处理程序。这里我们将使用 [koa-router](https://github.com/alexmingoia/koa-router) 来处理请求，将请求解析到对应的控制器（controller）上，实现访问不同地址获得不同的结果。下面会先介绍使用原生koa实现路由的方式。*

## koa原生路由实现


### 查看路由信息

首先，需要通过 `ctx.request.url` 获取到当前请求的地址，然后通过解析地址得知需要执行的操作，我们通过以下代码来实现查看路由：

```js
const Koa = require('koa');
const app = new Koa();

// response
app.use( ( ctx ) => {
  let url = ctx.request.url
  ctx.body = url
})

app.listen(3000);
```

启动服务之后我们在浏览器访问 http://localhost:3000 下的任何一个地址即可在页面中看到返回的url信息。

### 使用内容协商

Koa使用的内容协商（content negotiation）为 [accepts](https://www.npmjs.com/package/accepts) , 默认的返回类型是 `text/plain` ，若要返回其他类型的内容则用 `ctx.request.accepts` 在请求头部附带信息并告诉服务端，然后用 `ctx.response.type` 指定返回类型：

```js
const main = ctx => {
  if (ctx.request.accepts('xml')) {
    ctx.response.type = 'xml';
    ctx.response.body = '<data>Hello World</data>';
  } else if (ctx.request.accepts('json')) {
    ctx.response.type = 'json';
    ctx.response.body = { data: 'Hello World' };
  } else if (ctx.request.accepts('html')) {
    ctx.response.type = 'html';
    ctx.response.body = '<p>Hello World</p>';
  } else {
    ctx.response.type = 'text';
    ctx.response.body = 'Hello World';
  }
};
```

*可以使用 `acceptsEncodings` 设置接收返回的编码，`acceptsCharsets` 设置接收返回的字符集，`acceptsLanguages` 设置接收返回的语言。*


### 设置不同路由

接下来我们通过对路由地址进行判断，并取到对应的HTML页面返回到浏览器显示。首先，要取到HTML的内容，我们需要读取HTML文件，新建一个“pages”，假设我们的HTML文件都在该目录，新建两个HTML文件如下：

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

我们需要从这个“pages”目录下读取页面，并且返回到浏览器显示：

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
  ctx.response.type = 'html'; // 这里设置返回的类型
  ctx.body = await readPage(url);
});


```

然后我们启动服务，在浏览器访问 http://localhost:3000/index ，我们可以看到页面已经显示出来，点击里面的连接，就能够切换不同的页面。



## koa-router - 添加路由

### 安装和引入

从上面的例子我可以看到，如果需要针对不同的访问返回不同的内容，我们需要先获取请求的url，以及请求的类型，再进行相应的处理，最后返回结果。考虑到使用原生路由处理请求会很繁琐，我们使用 [koa-router](https://github.com/alexmingoia/koa-router) 中间件来为项目添加路由，执行以下命令安装koa-router：

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

在以上代码中，我们使用 `ctx.response.type` 来设置响应的类型，响应内容为 HTML 标签，并且通过中间件添加路由，执行 `npm start`，在浏览其中访问 http://localhost:3000/ 我们看到显示了"Hello World"，修改地址到 http://localhost:3000/me 则页面显示一个跳转链接。

### 单独管理路由

考虑到以后项目会复杂很多，我们把路由独立出来，新增“routes”目录，在这个目录下面创建“index.js”，将“app.js”中的路由代码放入“routes/index.js”：

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

为了使新增的路由生效，我们还需要在“app.js”中引入刚刚新增的文件：

app.js

```js
// 省略
const routes = require('./routes');

app
  .use(routes.routes())
  .use(routes.allowedMethods());
// 省略
```

我们可以重新启动服务，访问 http://localhost:3000/me 看看是否生效。



### 路由模块化 模块+方法

为了细化路由，根据业务分开管理路由，在“routes/”目录新增“users.js”：

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
上面的例子中，我们将用户相关的业务放到了“routes/users.js”文件中进行管理，并且在“routes/index.js”中引入了这个文件，为users分配了一个路径“/users”，以后就通过分配的这个路由增加用户相关的功能，重启服务，访问 http://localhost:3000 和 http://localhost:3000/users 即可看到新配置的路由。

### 路由前缀

为了管理路由版本，我们在根目录新增文件夹“config”，在该文件夹下新增文件“config.js”

config/config.js：

```js
const CONFIG = {
    "API_VERSION": "/v1" //配置了路由的版本
}

module.exports = CONFIG;
```

在“app.js”中引入并设置前缀：

```js
global.config = require('./config/config');
const routes = require('./routes'); // 在设置了config之后引入路由
```

修改“routes/index.js”：

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
