let mongoose = require('mongoose');

let { Material } = require('../models');

exports.connect = (request, response) => {
  mongoose.connect(`mongodb://${config.DB_USER}:${config.DB_PWD}@${config.DB_IP}:${config.DB_PORT}/${config.DB_NAME}?authSource=${config.DB_NAME}`);
  let db = mongoose.connection;
  db.on('error', () => {
    console.log('Mongoose连接错误: ' + err);
  });
  db.once('open', callback => {
    console.log(`Mongoose连接到${config.DB_NAME}`);
  });
}
