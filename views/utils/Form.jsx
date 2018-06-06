 class Form {
  constructor() {
    this.regBox = {
      regEmail: /^([a-z0 -9_\. -]+)@([\da -z\. -]+)\.([a -z\.]{2,6})$/, //邮箱
      regName: /^[a -z0 -9_ -]{3,16}$/, //用户名
      regMobile: /^0?1[3|4|5|8][0 -9]\d{8}$/, //手机
      regTel1: /^0[\d]{2,3} -[\d]{7,8}$/, //座机带区号
      regTel2: /^[0 -9]{7,8}$/, //座机不带区号
      //以下这个包括 手机 座机号 座机号带区号
      regAll: /(^[0-9]{3,4}\ -[0 -9]{3,8}$)|(^[0 -9]{3,8}$)|(^[0−9]3,4[0 -9]{3,8}$)|(^0{0,1}13[0 -9]{9}$)/
    };
    this.isTel = this.isTel.bind(this);
    this.isEmail = this.isEmail.bind(this);
  }
  isTel(str) {
    let mFlag = this.regBox.regMobile.test(str);
    return mFlag
      ? true
      : false;
  }

  isEmail(str) {
    let flag = this.regBox.regEmail.test(str);
    return flag
      ? true
      : false;
  }
}
const form = new Form;
export {form}
