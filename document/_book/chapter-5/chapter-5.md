

## Config-项目设置



在项目开发中，我们希望有多个环境配置，如开发环境、生产环境、测试环境等。不同的环境可能需要不同的配置，如数据库、日志、端口等。此外，不同的开发者也有不同的设置。为了解决这些问题，我们使用以下两个包：

- [config ](https://www.npmjs.com/package/config)  - 用来管理不同的运行环境
- [dotenv-safe](https://www.npmjs.com/package/dotenv-safe) - 用来定义一些需要保密的环境变量。

### 配置运行环境

首先，我们来安装这两个包：

```shell
npm i config dotenv-safe
```

`config` 会默认去查看项目根目录的 config 文件夹，所以我们需要创建一个 config  目录，这个在之前的实战已经做了。

然后来创建一个默认的配置文件 default.json ，其中包含了我们的数据库设置。以本项目为例，配置如下：

config/default.json

```js
{
  "App": {
    "apiVersion": "/v1",
    "server": "0.0.0.0", // 所有ip可以访问
    "port": 3000 // 端口
  },
  "Database": {
    "user": "Yuu", // MongoDB用户名
    "password": "123456", // MongoDB密码
    "host": "127.0.0.1",
    "dbName": "healthyDiet", // MongoDB数据库名
    "port": 3001
  }
}
```

在上面的代码中，我们配置了应用的设置 `App` 以及数据库连接配置 `Database` 然后，在项目的任何地方需要使用这些配置时，我们只需要引用 config 就可以了，如：

app.js

```js
const Koa = require('koa');
const app = new Koa();
const appConfig = config.get('App');
console.log(appConfig);

// 省略

app.listen(appConfig.port, appConfig.ip, () => {
  console.log('Server running');
});

```

启动服务之后，我们就能看到命令行能够打印出config.json里面的App配置信息。

```shell
{ apiVersion: '/v1', server: '0.0.0.0', port: 3000 }
Server running
```

### 配置多个环境

经过上面的介绍，我们已经通过config来配置运行环境了，但如果仅是这样，我们并不能实现多个环境的配置，因此，现在我们来配置一个新的环境。

配置一个生产环境 *production*  ，为了配置生产环境，我们需要在 config   目录新建一个 production.json

config/production.json

```js
{
  "App": {
    "port": 8000
  }
}
```

我们并没有配置所有的变量，我们希望一些变量保持和默认配置一样，如服务启动的地址、服务器名称等等，

为了验证配置是否生效，我们来切换到production环境：

```shell
'export NODE_ENV=production'  // Linux
'set NODE_ENV=production'. // Windows

```

接下来我们启动服务就能够看到输出的环境配置已经改变，端口变成了8000。我们来访问 http://localhost:8000/v1 ，浏览器显示了 “Hello World” 。

```shell
Administrator@DESKTOP-0E9E0N3 G:\koa-learning
> set NODE_ENV=production

Administrator@DESKTOP-0E9E0N3 G:\koa-learning
> npm start

> koa-learning@1.0.0 start G:\koa-learning
> node app.js

{ apiVersion: '/v1', server: '0.0.0.0', port: 8000 }
Server running
```

事实上，当我们调用 `config.get('App') ` 时，会从对应环境的json文件去取值替换 default.json 对应的值。需要支持更多的运行环境，我们只需要新增其它的文件就行，如 staging.json 、 qa.json  等。



### 配置环境变量

上面的配置中，我们的数据库密码是写在 config 里面的，我们不希望如此，为了安全起见，我们希望把密码配置在本地而不是提交到代码库或者仓库。因此，我们需要用到 dotenv-safe 。



dotenv-safe  让我们可以定义私有的变量，这是node进程运行的变量而不是上面配置的环境变量。dotenv-safe 默认会从项目根目录的 *.env* 文件中加载配置。我们新建一个  .env  文件：

 .env

```js
DB_PASSWORD=123456
```

我们把数据库密码拿了出来，并且我们会在 *.gitignore*  忽略掉这个文件，这样就不会提交了，接下来我们新建一个

.env.example 文件用来提交到代码库，这个文件会没有对变量进行赋值，但是能够表明项目使用的配置。并且，如果这个文件里面定义了 .env  没有的值，程序将停止执行。

.env.example

```js
DB_PASSWORD=
```

然后我们在app.js里面优先引入：

```js
require('dotenv-safe').load(); // 只需要引入一次
const Koa = require('koa');
const app = new Koa();
const appConfig = config.get('App');
console.log(process.env.DB_PASSWORD); // 123456
console.log(appConfig);

// 省略

app.listen(appConfig.port, appConfig.ip, () => {
  console.log('Server running');
});

```

启动服务查看：

```
> npm start

> koa-learning@1.0.0 start G:\koa-learning
> node app.js

123456
{ apiVersion: '/v1', server: '0.0.0.0', port: 8000 }
Server running
```

### 使用环境变量

接下来，我们将使用定义好的变量来替换 config 里面的配置。我们在 config 目录新增一个文件 custom-environment-variables.json

```js
{
  "Database": {
    "password": "DB_PASSWORD"
  }
}
```

这个 json 文件里面我们队数据库的密码进行了定义，当我们执行调用 `config.get('Database.password')`, `config` 将去查询一个叫 “DB_PASSWORD” 的环境变量。如果查询不到就会使用匹配当前环境的 json 文件的只来带起，如果当前环境的值任然没有，就会去查询 default.json 。

我们再看修改app.js 验证是否有效：

```js
require('dotenv-safe').load(); // 只需要引入一次
const Koa = require('koa');
const app = new Koa();
const appConfig = config.get('App');
const dbConfig = config.get('Database');
console.log(dbConfig);
console.log(appConfig);

// 省略

app.listen(appConfig.port, appConfig.ip, () => {
  console.log('Server running');
});
```

我们修改 .env 里面的值来启动服务查看是否生效

```
DB_PASSWORD=12345678
```

结果：

```shell
Administrator@DESKTOP-0E9E0N3 G:\koa-learning
> npm start

> koa-learning@1.0.0 start G:\koa-learning
> node app.js

{ user: 'Yuu',
  password: '12345678',
  host: '127.0.0.1',
  dbName: 'healthyDiet',
  port: 3001 }
{ apiVersion: '/v1', server: '0.0.0.0', port: 8000 }
Server running
```

### 修改之前的代码

路由前缀

```js

const config = require('config');
const apiVersion = config.get('App.apiVersion');

// 省略
const Router = require('koa-router');
const router = new Router();
router.prefix(apiVersion); // 设置路由前缀
// 省略

module.exports = router;

```

移除 app.js 中引入的旧的config

移除config里面的密码设置



参考资料：[Maintain Multiple Environment Configurations and Secrets in Node.js Apps](https://blog.stvmlbrn.com/2018/01/13/maintain-multiple-configurations-and-secrets-in-node-apps.html)
