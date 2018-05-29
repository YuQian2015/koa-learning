require('dotenv-safe').load();
const Koa = require('koa');
const app = new Koa();
const config = require('config');
const appConfig = config.get('App');
const dbConfig = config.get('Database');
console.log(dbConfig); 
console.log(appConfig);

const routes = require('./routes');
const db = require('./config/dbConfig');
const logger = require('./middleware/logger');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');

db.connect();
app.use(logger());
app.use(cors());
app.use(bodyParser());
app.use(routes.routes()).use(routes.allowedMethods());

app.listen(appConfig.port, appConfig.ip, () => {
  console.log('Server running');
});
