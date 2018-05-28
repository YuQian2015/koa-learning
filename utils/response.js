const errors = require('../config/errorCode');
module.exports = (response) => {
  console.log(response);
  const {errorCode, data, msg} = response;
  // 对响应数据进行规范，如果传递的对象有errorCode，返回报错信息
  if (errorCode) {
    return {
      "error": true,
      "msg": msg
        ? msg
        :  errors[response.errorCode],
      "data": {},
      "errorCode": errorCode
    }
  }
  if (data) {
    return {
      "error": false,
      "msg": msg
        ? msg
        : "",
      "data": data,
      "errorCode": ""
    }
  }
};
