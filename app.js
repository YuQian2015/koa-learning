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

const routes = require('./routes');
const db = require('./config/dbConfig');
const logger = require('./middleware/logger');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');

db.connect();
app.use(logger());
app.use(cors());
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
