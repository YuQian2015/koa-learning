let {user} = require('../models');
const response = require('../utils/response');
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('Token.jwtSecret');
const convert = require('joi-to-json-schema');
const {validation} = require('../routes/config');

const {
  request,
  summary,
  query,
  path,
  body,
  tags
} = require('koa-swagger-decorator');
let userSchema = {
  email: {
    type: 'string',
    required: true
  },
  name: {
    type: 'string',
    required: true,
    example: 'Yuu'
  },
  password: {
    type: 'string',
    required: true
  }
}

// for test
console.log(convert(validation.addMaterial.body));
userSchema = convert(validation.addMaterial.body).properties;
class UserController {
  constructor() {}
  // 定义一个一部函数register用来注册用户，接收请求传过来的body
  @request('post', '/register')
  @summary('注册用户接口')
  @tags(['注册'])
  @body(userSchema)
  async register(reqBody) {
    let dataArr = { // 展开运算
      ...reqBody
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

  // 注册
  async signin(reqBody) {
    let dataArr = {
      ...reqBody
    }
    try {
      let result = await user.findOne(dataArr); // 查询该用户
      let respon = {};

      let userToken = {
        email: result.email
      }
      const token = jwt.sign(userToken, jwtSecret, {expiresIn: '3h'}) //token签名 有效期为3小时
      const res = {
        result: '登录成功！',
        token: token
      }
      respon = response({data: res});

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
