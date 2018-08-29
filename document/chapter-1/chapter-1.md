## 前期准备

安装node.js，检查 Node 版本。

```shell
node -v
v8.9.1
```

新建一个文件夹 koa-learning ，在命令行进入该文件夹，执行新建一个项目:

```shell
npm init -y
```

当然，我们还得安装 Koa：

```shell
npm install koa
```



## 项目入口

我们在 koa-learning 目录下新建一个 app.js 文件，用来架设一个 HTTP 服务，实现 Hello World：

```js
const Koa = require('koa');
const app = new Koa();

// response
app.use(ctx => {
  ctx.response.body = 'Hello World';
});

app.listen(3000);
```

在上面的代码中，`app.use()` 指定了一个中间件方法，这个中间件接收 Koa 创建的上下文(Context)，并且修改了 `response.body` 表示发送给用户的内容。

Koa 上下文 将 node 的 `request` 和 `response` 对象封装到单个对象中，为编写 Web 应用程序和 API 提供了许多有用的方法。

接下来就是启动服务，执行：

```shell
node app.js
```

浏览器访问 http://localhost:3000/ , 我们可以看到显示 "Hello World"，证明我们服务已经搭建好。

为了方便，我们将这个命令配置在 `package.js` 中，下次只要在命令行执行 `npm start` 即可启动服务：

```js
{

  // 省略
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
	"start": "node app.js"
  },
  // 省略
}

```
