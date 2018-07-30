let mongoose = require('mongoose');
const config = require('config');
const dbConfig = config.get('Database');
let acl = require('acl');
var mongodb = require('mongodb');
// mongodb.connect(`mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}?authSource=${dbConfig.dbName}`, function(error, db) {
//   console.log(error);
//   var mongoBackend = new acl.mongodbBackend(db, 'acl_');
//
//   acl = new acl(mongoBackend);
//   acl.allow('guest', 'blogs', 'view')
//
//   // allow function accepts arrays as any parameter
//   acl.allow('member', 'blogs', ['edit', 'view', 'delete'])
//
//   acl.addUserRoles('joed', 'guest')
//
//   acl.addRoleParents('baz', ['foo', 'bar'])
//
//   // acl.isAllowed('joed', 'blogs', 'view', function(err, res){
//   //   console.log(123132131);
//   //     if(res){
//   //         console.log("User joed is allowed to view blogs")
//   //     }
//   // })
// });

exports.connect = (request, response) => {
  mongoose.connect(`mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}?authSource=${dbConfig.dbName}`);
  let db = mongoose.connection;
  db.on('error', () => {
    console.log('Mongoose连接错误: ' + err);
  });
  db.once('open', (callback) => {
    console.log(`Mongoose连接到${dbConfig.dbName}`);


    // const mongoBackend = new acl.mongodbBackend(db, 'acl_', {
    //   useSingle: true
    // });
    // console.log("___________________________");
    // acl = new acl(mongoBackend);


    // acl = new acl(new acl.memoryBackend());
    // guest is allowed to view blogs


    // acl.allow('guest', 'blogs', 'view')
    //
    // // allow function accepts arrays as any parameter
    // acl.allow('member', 'blogs', ['edit', 'view', 'delete'])
    //
    // acl.addUserRoles('joed', 'guest')
    //
    // acl.addRoleParents('baz', ['foo', 'bar'])
    //
    // acl.isAllowed('joed', 'blogs', 'view', function(err, res){
    //   console.log(123132131);
    //     if(res){
    //         console.log("User joed is allowed to view blogs")
    //     }
    // })
  });
}
