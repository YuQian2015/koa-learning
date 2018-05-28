let {user} = require('../models');
const response = require('../utils/response');

class UserController {
  constructor() {}
  // 定义一个一部函数register用来注册用户，接收请求传过来的body
  async register(reqBody) {
    let dataArr = { // 展开运算，并添加创建时间
      ...reqBody,
      createDate: new Date()
    }
    try {
      let list = await user.find({email: dataArr.email}); // 先查询是否存在该用户
      let respon = {};
      if (list && list.length > 0) {
        respon = response({errorCode: '002'});
      } else {
        let newUser = await user.create(dataArr); // 如果没有注册过就进行注册
        respon = response({data: newUser});
      }
      return respon;
    } catch (err) {
      console.log(err)
      throw new Error(err);
      return err;
    }
  }
}

const userController = new UserController();

module.exports = userController;

//
// User.find({email: req.body.email}).lean().exec(function(error, userData) {
//   if (error) {
//     return res.json(response({"errorCode": "000"}));
//   }
//   if (userData.length) {
//     return res.json(response({"errorCode": "003"}));
//   }
//   let user = new User({email: req.body.email, password: req.body.password, name: req.body.name, createDate: new Date()});
//   user.save(function(err, data) {
//     if (err) {
//       return res.json(response({"errorCode": "000"}));
//     }
//     res.json(response({
//       "data": {
//         result: "注册成功"
//       }
//     }));
//   })
// })
