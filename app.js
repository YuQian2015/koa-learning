const Koa = require('koa');
const app = new Koa();

global.config = require('./config/config');
global.process.env.PORT = config.PORT || 3000;
global.process.env.IP = config.SERVER || "127.0.0.1";

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

app.listen(process.env.PORT, process.env.IP, () => {
  console.log('Server running');
});
