## 理解 Session 和 Cookie

### 为何需要 session 和 cookie？

首先来了解 HTTP （HyperText Transfer Protocol 超文本传输协议） 的几个特性：

- HTTP 遵循 client/server 模型，是一个客户端和服务器端请求和应答的标准
- HTTP 是无状态的（stateless）协议，每一次传输都是独立的，互不影响。
- HTTP 是一个应用层 (application layer) 协议，他在传输层(transfer layer)协议之上，基本上 HTTP 协议使用 (TCP) 作为它的传输层协议。
- 客户端请求服务端使用不同的请求方式（包括：get、post、delete、put等）。
- HTTP 定义了服务端状态码返回给客户端（包括：200、404、500等）。
- HTTP 支持设置头部 headers，（包括：Cache-Control、Content-type 等）。

HTTP 是无状态的，意味着每次页面加载、每次请求都是独立的事件，和前后的事件没有关联。客户端请求服务之后，服务端不能区分发起 HTTP 请求的用户以及用户在网站的状态等，Cookie 和 Session 使 HTTP 能够维持状态，让网站能够记住用户的一些信息。

### Session & Cookie

Cookie 通常是由 **浏览器** 保存在用户电脑的小文本文件，经过浏览器转换成包含用户网站上的信息的文本，在浏览器发送 HTTP 请求的时候会把这些信息加在请求头中发送给服务端，服务端再根据 Cookie 来判断不同用户的信息。

Session 是 **服务端** 存储的用来标识用户信息的数据，当用户访问网站时，服务器会为这个用户创建一个唯一的 session id，服务器会把这个id通过 cookie 的形式传给浏览器，浏览器接收 cookie 之后，请求就能携带这个 cookie 访问服务器，通过这个session id 服务端就能够对访问的用户进行辨别。

举个栗子：

商店发的会员卡（cookie），它记录了用户的信息（identification），并且是由商店（服务器）发给用户（浏览器），每次用户去商店消费都会携带着会员卡，由于商店管理了自己发布的会员卡信息，可以通过用户会员卡ID（session id）找到该用户的信息。


### Session cookies 和 Persistent cookies

- 会话 cookie (Session cookies) 在浏览网页时被创建，通常放在活动内存，会话结束时（浏览器关闭）会被删除。
- 持久化 cookie（Persistent cookies）浏览网页是被创建，并且没有失效之前，始终存在于浏览器的 cookie 存储目录，在到达失效日期时会被删除。

### Cookie 包含的内容

通常 cookie 都会包含以下内容：
- Cookie 来源的服务器名称
- Cookie 保存的时间
- 随机生成的唯一的数值

Cookie 是一个很小的文本文件，通常会被命名为类似 abc@example.com.txt 的文件，如果打开这些文件，可以看到类似如下的内容:

```
HMP1 1 example.com/ 0 4058205869
384749284 403847430 3449083948 *
```

Google Chrome 浏览器使用 SQLite 文件存储 cookie ，默认存储在：

```
C:\Users\<your_username>\AppData\Local\Google\Chrome\User Data\Default\
```
并且 Cookie 的值被加密了，因此无法直接打开。

### 如何使用 Cookie？

#### 服务端

服务器通过响应头 `Set-Cookie` 来告诉浏览器创建一个 cookie，`Set-Cookie` 头部是一个字符串，其格式如下：

```
Set-Cookie: <name>=<value>[; expires=<date>][; domain=<domain>][; path=<path>][; secure][; httponly]
```

上面的格式中，”[]“ 内部的都是可选值，他们分别有如下作用：

- `<name>=<value>` - 储存的字符串，会被浏览器携带发送回服务器，通常是一个 `name=value` 格式的字符串
- `expires` - Cookie 的过期时间，不设置的话，创建的 cookie 在会话结束后销毁，格式为 `DD-Mon-YYYY HH:MM:SS GMT` 
- `domain` - Cookie 被设置的域，只有向该域发送 HTTP 请求时才会携带对应的 cookie 
- `path` - Cookie 被设置的路径，之后想该路径发起请求才会携对应的 cookie 
- `secure` - 一个 boolean 标记 cookie 是否只能通过 HTTPS 请求发送至服务器。
- `httponly` - 告诉浏览器该 cookie 不能通过 JavaScript 访问，可以阻止跨站脚本攻击（XSS）窃用 cookie。

可以返回多个 `Set-Cookie` 头来设置多个 cookie：

```
Set-Cookie: name=moyufed; path=/; expires=Mon, 26 Jul 2021 11:10:02 GMT; domain=localhost
Set-Cookie: name2=moyufed2; path=/; expires=Mon, 26 Jul 2021 11:10:02 GMT; domain=localhost
```

#### 客户端

JavaScript 通过 `document.cookie` 进行 cookie 的操作，但是仅限于非 `httpOnly` 的情况：

获取 cookie：

```javascript
document.cookie
```

创建或修改 cookie：

```javascript
document.cookie="name="+username;
```

在浏览器发送请求时，会将 cookie 添加到请求头中，如果有多个 cookie，将以分号和空格分隔，cookie 的格式如下：

```
Cookie: name=moyufed; name2=moyufed2
```

### 在 koa 中使用 cookie

Koa 已经提供了从通过上下文（`ctx`）直接读写入 cookie 的方法，分别为：

- `ctx.cookies.get(name, [options])` -  通过上下文读取 cookie
- `ctx.cookies.set(name, value, [options])` - 通过上下文写入 cookie

```javascript
ctx.cookies.set(
    'name', 
    'moyufed',
    {
        domain: 'localhost', // 设置 cookie 的域
        path: '/', // 设置 cookie 的路径
        maxAge: 24 * 60 * 60 * 1000, // cookie 的有效时间 ms
        expires: new Date('2020-10-10'), // cookie 的失效日期，如果设置了 maxAge，expires 将没有作用
        httpOnly: false, // 是否要设置 httpOnly
        overwrite: false // 是否要覆盖已有的 cookie 设置
    }
)
```

上面的代码没有设置 httpOnly，通过 `document.cookie` 可以获取到 `"name=moyufed"`，在访问 `'/'` 路径时，可以看到请求头里面携带了设置的 cookie。事实上 koa2 使用了 npm 的 [cookies](https://github.com/pillarjs/cookies) 模块来读写 cookie，上面的配置都可以从  cookies 源码查看。

### Cookie 相关

- 不设置 cookie 过期时间，cookie 会在会话结束后销毁
- 持久 cookie 无法改成会话 cookie，除非删除这个 cookie，然后重新建立这个 cookie
- 将 cookie 的 `domain` 选项设置为主域名，子域名可以携带该 cookie 的发送到服务器


### session使用

session

session的作用和cookie差不多，也是用来解决Http协议不能维持状态的问题。但是session只存储在服务器端的，不会在网络中进行传输，所以较cookie来说，session相对安全一些。但是session是依赖cookie的，当用户访问某一站点时，服务器会为这个用户产生唯一的session_id,并把这个session_id以cookie的形式发送到客户端，以后的客户端的所有请求都会自动携带这个cookie（前提是浏览器支持并且没有禁用cookie）。

用下面这个图来了解下session的工作原理:

禁用cookie时如何使用session

有些时候,为了安全浏览器会禁用cookie,这时可以用传参的方式将session_id发送到服务器,session可以照常工作.

删除session

会话关闭后，session会自动失效，如果想手动删除session，可以在服务器端编程实现。如PHP是这样做的

$_SESSION = array();

session_destory();



## 前言

koa2原生功能只提供了cookie的操作，但是没有提供session操作。session就只用自己实现或者通过第三方中间件实现。在koa2中实现session的方案有一下几种

- 如果session数据量很小，可以直接存在内存中
- 如果session数据量很大，则需要存储介质存放session数据

## 数据库存储方案

- 将session存放在MySQL数据库中
- 需要用到中间件
  - koa-session-minimal 适用于koa2 的session中间件，提供存储介质的读写接口 。
  - koa-mysql-session 为koa-session-minimal中间件提供MySQL数据库的session数据读写操作。
  - 将sessionId和对于的数据存到数据库
- 将数据库的存储的sessionId存到页面的cookie中
- 根据cookie的sessionId去获取对于的session信息

## 快速使用

demo源码

https://github.com/ChenShenhai/koa2-note/blob/master/demo/session/index.js

### 例子代码

```js
const Koa = require('koa')
const session = require('koa-session-minimal')
const MysqlSession = require('koa-mysql-session')

const app = new Koa()

// 配置存储session信息的mysql
let store = new MysqlSession({
  user: 'root',
  password: 'abc123',
  database: 'koa_demo',
  host: '127.0.0.1',
})

// 存放sessionId的cookie配置
let cookie = {
  maxAge: '', // cookie有效时长
  expires: '',  // cookie失效时间
  path: '', // 写cookie所在的路径
  domain: '', // 写cookie所在的域名
  httpOnly: '', // 是否只用于http请求中获取
  overwrite: '',  // 是否允许重写
  secure: '',
  sameSite: '',
  signed: '',

}

// 使用session中间件
app.use(session({
  key: 'SESSION_ID',
  store: store,
  cookie: cookie
}))

app.use( async ( ctx ) => {

  // 设置session
  if ( ctx.url === '/set' ) {
    ctx.session = {
      user_id: Math.random().toString(36).substr(2),
      count: 0
    }
    ctx.body = ctx.session
  } else if ( ctx.url === '/' ) {

    // 读取session信息
    ctx.session.count = ctx.session.count + 1
    ctx.body = ctx.session
  } 

})

app.listen(3000)
console.log('[demo] session is starting at port 3000')
```





































参考资料：https://www.allaboutcookies.org/cookies/
https://www.privacypolicies.com/blog/browser-cookies-guide/
https://stackoverflow.com/questions/31021764/where-does-chrome-store-cookies
https://blog.csdn.net/u011816231/article/details/69372208













## excel导出

>  待补充





### 浏览器不能下载response输出的excel

用ajax提交是不行的，因为ajax基于XMLHttpRequest ，XMLHttpRequest 的定义就是：可以同步或异步返回 Web 服务器的响应，并且能**以文本或者一个 DOM 文档**形式返回内容。而我们的Excel是二进制流。所以Excel会被强转成文本，就像乱码一样。（**效果类同你用记事本打开Excel文件**）

在浏览器直接访问下载的URL，如果能自动下载。ok，代码没问题。

### 前端请求方式

form提交

window.open/location.href等

a标签

iframe





## 文件上传

> 待整理
