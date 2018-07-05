require('babel-register');
require("babel-polyfill");
require('dotenv-safe').load();
const Koa = require('koa');
const app = new Koa();
const config = require('config');
const appConfig = config.get('App');
const dbConfig = config.get('Database');
// const fs = require('fs');
// console.log(dbConfig);
// console.log(appConfig);

const crypto = require('crypto');

const buf = Buffer.alloc(20);
console.log(crypto.randomFillSync(buf).toString('hex'));

const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 512}); //生成512位秘钥

var pubkey = key.exportKey('pkcs8-public');//导出公钥
var prikey = key.exportKey('pkcs8-private');//导出私钥
console.log(pubkey);
console.log(prikey);
var pubkeyR = new NodeRSA(pubkey,'pkcs8-public');//导入公钥
var prikeyR = new NodeRSA(prikey,'pkcs8-private');//导入私钥
console.log(pubkeyR);
console.log(prikeyR);


const text = 'Hello RSA!';
var encrypted = pubkeyR.encrypt(text, 'base64'); // 公钥加密(返回密文):
console.log("密文："+encrypted);

var decrypted = prikeyR.decrypt(encrypted, 'utf8'); // 公钥加密(返回密文):
console.log("明文："+decrypted);


const routes = require('./routes');
const db = require('./config/dbConfig');
const logger = require('./middleware/logger');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');

db.connect();
app.use(logger());
// https://github.com/brunoyang/blog/issues/11
// 需要了解 XMLHttpRequest.withCredentials  https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials
// https://segmentfault.com/q/1010000007435062
app.use(cors({
  credentials:true
}));
app.use(bodyParser());
// without koa-router
// function readPage( page ) {
//   return new Promise(( resolve, reject ) => {
//     let viewUrl = `./pages${page}.html`
//     fs.readFile(viewUrl, "binary", ( err, data ) => {
//       if ( err ) {
//         reject( err )
//       } else {
//         resolve( data )
//       }
//     })
//   })
// }
// app.use( async (ctx, next) => {
//   let url = ctx.request.url
//   ctx.response.type = 'html';
//   ctx.body = await readPage(url);
// });

app.use(routes.routes()).use(routes.allowedMethods());

app.listen(appConfig.port, appConfig.ip, () => {
  console.log('Server running');
});
