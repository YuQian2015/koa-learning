## session和cookie

### HTTP 的几个特性

HTTP (HyperText   Teansfer Protocol 超文本传输协议)  

- HTTP遵循 client/server 模型，是一个客户端和服务器端请求和应答的标准
- HTTP是无状态的(stateless) 协议，每一次传输都是独立的，互不影响。
- HTTP是一个应用层 (application layer) 协议，他在传输层(transfer layer)协议之上，99%以上的HTTP协议使用 (TCP) 作为它的传输层协议。
- 客户端请求服务端使用client action即是method，包括get、post、delete等。
- HTTP定义了服务端状态码返回给客户端，200、404、500等。
- HTTP支持 headers，Cache-Control、Content-type 等。

### Session& Cookie简介

由于HTTP是无状态的，客户端请求服务之后，服务端是不能判断HTTP请求是由那个用户发起的、用户在网站的状态等。cookie和session使HTTP能够维持状态。

cookie是由浏览器保存的一段文本，包含用户在网站上的必要的信息，在发送HTTP请求的时候会把这些信息加载请求头中发送给服务端。

session是服务端存储的用来标识用户信息的数据，当用户访问网站时，服务端会为这个用户创建一个唯一的session id，服务器会把这个id通过cookie的形式传给浏览器，浏览器接收cookie之后，以后的请求就能携带这个cookie发送，通过这个session id 服务端就能够对访问的用户进行辨别。类似于商店发的会员卡(cookie)，它记录了用户的信息 identification，并且是由商店(服务端)发给用户(客户端)，每当用户去商店消费，用户携带着会员卡，商店管理了自己发布的卡，通过卡的ID(session id)找到对应该用户的信息。

cookie分类：

会话 cookie (Session cookie) 在会话结束时（浏览器关闭）会被删除。

持久化 cookie（Persistent cookie）在到达失效日期时会被删除。

### cookie使用

客户端使用

服务端使用

### session使用



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
