import React from 'react';
import {withRouter} from "react-router-dom";

import LocalDB from 'local-db';
const userCollection = new LocalDB('user');

class MainTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    const user = userCollection.query({});
    // if (user.length == 0) {
    //   this.props.history.replace("/register");
    //   console.log('登录失效，退回登录页面');
    // }
  }
  render() {
    let {body, footer, header} = this.props;
    let contentClass = ['content'];
    if (footer) {
      contentClass.push('has-footer');
    }
    if (header) {
      contentClass.push('has-header');
    }
    return (<div className="PageContainer UI">
      {
        header
          ? header
          : null
      }
      <div className={contentClass.join(" ")}>
        {
          body
            ? body
            : null
        }
      </div>
      {
        footer
          ? footer
          : null
      }
    </div>);
  }
}

export default withRouter(MainTab);
