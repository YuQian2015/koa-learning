const fs = require('fs');
const cmd = require('node-cmd');

const DB_LOCATION = "F:\\MongoDB"; // MongoDB数据库位置

const CONFIG = {
  DB_CONFIG_FILE_NAME: "mongod.cfg", // 数据库配置文件名
  DB_PATH: DB_LOCATION+"\\db", // 数据存放目录
  DB_LOG_PATH: DB_LOCATION+"\\log", // 数据库日志目录
  DB_LOG_FILE_NAME: "mongod.log", // 数据库日志文件名称
  SERVICE_DISPLAY_NAME: "koa-learning"
}

if(!fs.existsSync(DB_LOCATION)) {
  fs.mkdirSync(DB_LOCATION);
}

if(!fs.existsSync(CONFIG.DB_PATH)) {
  fs.mkdirSync(CONFIG.DB_PATH);
}

if(!fs.existsSync(CONFIG.DB_LOG_PATH)) {
  fs.mkdirSync(CONFIG.DB_LOG_PATH);
}

let dbConfig = `systemLog:
 destination: file
 path: ${CONFIG.DB_LOG_PATH.replace(/\\/g,"\\\\")}\\\\mongod.log
 logAppend: true
net:
 bindIp: 127.0.0.1
 port: 3002
storage:
 dbPath: ${CONFIG.DB_PATH.replace(/\\/g,"\\\\")}
`
fs.writeFileSync(DB_LOCATION+"\\"+CONFIG.DB_CONFIG_FILE_NAME,dbConfig)
let cmdStr = `mongod --config ${DB_LOCATION.replace(/\\\\/g,"\\")}\\${CONFIG.DB_CONFIG_FILE_NAME}`;
console.log(cmdStr);
cmd.get(
  cmdStr,
  function(err, data, stderr){
  }
);
