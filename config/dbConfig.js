let mongoose = require('mongoose');
const config = require('config');
const dbConfig = config.get('Database');
// 如果使用 mongodb
// var mongodb = require('mongodb');
// mongodb.connect(`mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}?authSource=${dbConfig.dbName}`, function(error, db) {
//   console.log(db.db(`${dbConfig.dbName}`));
//   var mongoBackend = new acl.mongodbBackend(db.db(`${dbConfig.dbName}`), 'acl_');
//   acl = new acl(mongoBackend);
//   acl.allow('guest', 'blogs', 'view')
// });

exports.connect = (request, response) => {
  mongoose.connect(`mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}?authSource=${dbConfig.dbName}`);
  let db = mongoose.connection;
  db.on('error', () => {
    console.log('Mongoose连接错误: ' + err);
  });
  db.once('open', (callback) => {
    console.log(`Mongoose连接到${dbConfig.dbName}`);
  });
}
