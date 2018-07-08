import React from 'react';
import {withRouter} from "react-router-dom";

import verification from 'verification-code';


import LocalDB from 'local-db';
const userCollection = new LocalDB('user');

import PageContainer from '../container/PageContainer.jsx';
import Alert from '../components/Alert.jsx';
import UserService from '../service/UserService.jsx';

import {form} from '../utils/Form.jsx';

let result = verification.create();

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vcode: result.code, // 随机生成的验证码
      imgDataURL: result.dataURL, // 验证码图片的 base64
      regForm: {
        email: "",
        name: "",
        imgcode: "",
        pwd: ""
      },
      contentText: "提示",
      isSignIn: false
    };
    this.changeRegister = this.changeRegister.bind(this);
    this.validate = this.validate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.doSubmit = this.doSubmit.bind(this);
    this.showAlert = this.showAlert.bind(this);
  }
  componentWillMount() {}

  validate() {
    result = verification.create();
    this.setState({vcode: result.code, imgDataURL: result.dataURL})
  }

  changeRegister() {
    // this.props.history.push("/login");
    this.setState({
      isSignIn: !this.state.isSignIn
    })
  }

  handleChange(type) {
    let regForm = this.state.regForm;
    regForm[type] = this.refs[type].value;
    this.setState({regForm});
  }

  showAlert(contentText) {
    this.setState({
      contentText: contentText
    }, () => {
      this.refs.alert.show();
    });
  }

  doSubmit() {
    let {regForm, isSignIn} = this.state;
    if (regForm.email.trim() === "" || !form.isEmail(regForm.email.trim())) {
      this.showAlert("请输入正确的邮箱");
      return
    }
    if (regForm.name.trim() === "" && !isSignIn) {
      this.showAlert("请输入用户名");
      return
    }
    // if(regForm.imgcode === "") {
    //   this.showAlert("请输入验证码");
    //   return
    // }
    if (regForm.pwd.trim().length < 6) {
      this.showAlert("请输入至少6位密码");
      return
    }

    if (isSignIn) {
      UserService.signIn({
        "email": regForm.email.trim(),
        "password": regForm.pwd.trim()
      }, (res) => {
        if (res.error) {
          this.showAlert(res.msg);
          return;
        }
        if (res.data) {
          userCollection.drop();
          userCollection.insert({
            time: new Date().getTime(),
            token:res.data.token
          })
          this.props.history.push("/home");
        }
      }, (error) => {})
      return
    }
    UserService.register({
      "email": regForm.email.trim(),
      "password": regForm.pwd.trim(),
      "name": regForm.name.trim()
    }, (res) => {
      if (res.error) {
        this.showAlert(res.msg);
        return;
      }
      this.showAlert('注册成功');
      this.setState({isSignIn: true})
    }, (error) => {})
  }

  render() {
    let {imgDataURL, contentText, isSignIn} = this.state;

    let body = <div className="UI RegisterPage">
      <Alert ref="alert" titleText="提示" contentText={contentText}/>

      <div className="main">
        <div className="input-box">
          <i className="hd-mail-fill"></i>
          <input type="text" onChange={() => this.handleChange("email")} ref="email" placeholder="邮箱"/>
        </div>
        {
          isSignIn
            ? null
            : <div className="input-box">
                <i className="hd-people-fill"></i>
                <input type="text" onChange={() => this.handleChange("name")} ref="name" placeholder="用户名"/>
              </div>
        }
        {/* <div className="input-box">
          <img onClick={this.validate} className="validate-image" src={imgDataURL}/>
          <input type="text" onChange={() => this.handleChange("imgcode")} ref="imgcode" placeholder="输入图形码" maxLength="4"/>
        </div> */
        }

        <div className="input-box">
          <i className="hd-lock-fill"></i>
          <input type="password" onChange={() => this.handleChange("pwd")} ref="pwd" placeholder="登录密码" maxLength="20"/>
        </div>
        <button className="block" onClick={this.doSubmit} type="button">{
            isSignIn
              ? '登录'
              : '注册'
          }</button>

      </div>
      <div className="go-login" onClick={this.changeRegister}>
        {
          isSignIn
            ? <a>去注册</a>
            : <a>去登录</a>
        }
      </div>
    </div>;
    return body
  }
}
export default withRouter(RegisterPage);
