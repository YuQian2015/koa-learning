const CONFIG = {
  "API_VERSION": "/v1",
  // "SERVER":"127.0.0.1",  服务启动的地址
  "SERVER": "0.0.0.0", // 所有ip可以访问
  "PORT": 3000, // 端口

  "DB_USER": "Yuu", // MongoDB用户名
  "DB_PWD": "123456", // MongoDB密码
  "DB_IP": "127.0.0.1",
  "DB_NAME": "healthyDiet", // MongoDB数据库名
  "DB_PORT": 3001,


  "JWT_SECRET":"healthy-diet" // jwt 混淆
}
module.exports = CONFIG;
