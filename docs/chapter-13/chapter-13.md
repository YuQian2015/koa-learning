## 理解 Session 和 Cookie

### HTTP 的几个特性

HTTP(HyperText Transfer Protocol 超文本传输协议)  

- HTTP 遵循 client/server 模型，是一个客户端和服务器端请求和应答的标准
- HTTP 是无状态的(stateless) 协议，每一次传输都是独立的，互不影响。
- HTTP 是一个应用层 (application layer) 协议，他在传输层(transfer layer)协议之上，基本上 HTTP 协议使用 (TCP) 作为它的传输层协议。
- 客户端请求服务端使用不同的请求方式（包括：get、post、delete、put等）。
- HTTP 定义了服务端状态码返回给客户端（包括：200、404、500等）。
- HTTP 支持设置头部 headers，（包括：Cache-Control、Content-type 等）。

### Session & Cookie 简介

由于 HTTP 是无状态的，客户端请求服务之后，服务端不能判断发起 HTTP 请求的是谁以及用户在网站的状态等，Cookie 和 Session 使 HTTP 能够维持状态，让网站能够记住用户的一些信息。

Cookie 通常是由**浏览器**保存在用户电脑的小文本文件，经过浏览器转换成一段包含用户在网站上的信息的文本，在浏览器发送 HTTP 请求的时候会把这些信息加在请求头中发送给服务端，服务端再根据 Cookie 来判断不同用户的信息。

Session 是**服务端**存储的用来标识用户信息的数据，当用户访问网站时，服务端会为这个用户创建一个唯一的 session id，服务器会把这个id通过cookie的形式传给浏览器，浏览器接收cookie之后，以后的请求就能携带这个cookie发送，通过这个session id 服务端就能够对访问的用户进行辨别。类似于商店发的会员卡(cookie)，它记录了用户的信息 identification，并且是由商店(服务端)发给用户(客户端)，每当用户去商店消费，用户携带着会员卡，商店管理了自己发布的卡，通过卡的ID(session id)找到对应该用户的信息。


### Cookie 分类

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

### 如何创建 Cookie？

#### 服务端

服务器通过响应头 `Set-Cookie` 来告诉浏览器创建一个 cookie，`Set-Cookie` 头部是一个字符串，其格式如下：

```
Set-Cookie: value[; expires=date][; domain=domain][; path=path][; secure]
```

上面的格式中，”[]“内部的都是可选值，他们分别有如下作用：

- `value` - 示例储存的字符串，会被浏览器携带发送回服务器，通常是一个 `name=value` 格式的字符串
- `expires` - Cookie的过期时间，不设置的话，创建的cookie在会话结束后销毁，格式为 `DD-Mon-YYYY HH:MM:SS GMT` 
- `domain` - Cookie 被设置的域名，只有向该域名HTTP发送请求时才会携带对应的 cookie 
- `path` - Cookie 被设置的路径，之后想该路径发起请求才会携对应的 cookie 
- `secure` - 标记，通过 SSL 或 HTTPS 创建的请求只有包含 secure 标记的 cookie 才能被发送至服务器。

#### 客户端

JavaScript 操作 cookie

在 JavaScript 中通过 document.cookie 属性，可以创建、维护和删除 cookie。创建 cookie 时该属性等同于 Set-Cookie 消息头，而在读取 cookie 时则等同于 Cookie 消息头。

发送回服务器的cookie只包含cookie设置的值，而不包含cookie的其他可选项,而且浏览器不会对cookie做任何更改，会原封不动的发送回服务器。当存在多个cookie时，用分号和空格隔开：

Cookie: name=value; name1=value1; name2=value2/pre>

cookie过期时间

如果不设置cookie过期时间，cookie会在会话结束后销毁，称为会话cookie。如果想将会话cookie设置为持久cookie，只需设置一下cookie的过期时间即可，该选项的值是一个 Wdy, DD-Mon-YYYY HH:MM:SS GMT 日期格式的值。注意这个失效日期则关联了以 name-domain-path-secure 为标识的 cookie。要改变一个 cookie 的失效日期，你必须指定同样的组合。

持久cookie是无法改成会话cookie，除非删除这个cookie，然后重新建立这个cookie。

domain 选项

domian选项设置了cookie的域，只有发向这个域的http请求才能携带这些cookie。一般情况下domain会被设置为创建该cookie的页面所在的域名。

像 Yahoo! 这种大型网站，都会有许多 name.yahoo.com 形式的站点（例如：my.yahoo.com, finance.yahoo.com 等等）。将一个 cookie 的 domain 选项设置为 yahoo.com，就可以将该 cookie 的值发送至所有这些站点。浏览器会把 domain 的值与请求的域名做一个尾部比较（即从字符串的尾部开始比较），并将匹配的 cookie 发送至服务器。

path 选项

path选项和domain选项类似，只有包含指定path的http请求才能携带这些cookie。这个比较通常是将 path 选项的值与请求的 URL 从头开始逐字符比较完成的。如果字符匹配，则发送 Cookie 消息头，例如：

set-cookie:namevalue;path=/blog

所以包含/blog的http请求都会携带cookie信息。

secure 选项

该选项只是一个标记而没有值。只有当一个请求通过 SSL 或 HTTPS 创建时，包含 secure 选项的 cookie 才能被发送至服务器。这种 cookie 的内容具有很高的价值，如果以纯文本形式传递很有可能被篡改。

事实上,机密且敏感的信息绝不应该在 cookie 中存储或传输，因为 cookie 的整个机制原本都是不安全的。默认情况下，在 HTTPS 链接上传输的 cookie 都会被自动添加上 secure 选项。

### HTTP-Only

HTTP-Only 的意思是告之浏览器该 cookie 绝不能通过 JavaScript 的 document.cookie 属性访问。设计该特征意在提供一个安全措施来帮助阻止通过 JavaScript 发起的跨站脚本攻击 (XSS) 窃取 cookie 的行为。


删除cookie

会话 cooke (Session cookie) 在会话结束时（浏览器关闭）会被删除。

持久化 cookie（Persistent cookie）在到达失效日期时会被删除。

如果浏览器中的 cookie 数量达到限制，那么 cookie 会被删除以为新建的 cookie 创建空间。

session

session的作用和cookie差不多，也是用来解决Http协议不能维持状态的问题。但是session只存储在服务器端的，不会在网络中进行传输，所以较cookie来说，session相对安全一些。但是session是依赖cookie的，当用户访问某一站点时，服务器会为这个用户产生唯一的session_id,并把这个session_id以cookie的形式发送到客户端，以后的客户端的所有请求都会自动携带这个cookie（前提是浏览器支持并且没有禁用cookie）。

用下面这个图来了解下session的工作原理:

禁用cookie时如何使用session

有些时候,为了安全浏览器会禁用cookie,这时可以用传参的方式将session_id发送到服务器,session可以照常工作.

删除session

会话关闭后，session会自动失效，如果想手动删除session，可以在服务器端编程实现。如PHP是这样做的

$_SESSION = array();

session_destory();

### cookie使用


### session使用







































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
