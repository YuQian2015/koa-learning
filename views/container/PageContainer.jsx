import React from 'react';
import {withRouter} from "react-router-dom";

import LocalDB from 'local-db';
const userCollection = new LocalDB('user');

// history objects typically have the following properties and methods:
//
// length - (number) The number of entries in the history stack
// action - (string) The current action (PUSH, REPLACE, or POP)
// location - (object) The current location. May have the following properties:
//
// pathname - (string) The path of the URL
// search - (string) The URL query string
// hash - (string) The URL hash fragment
// state - (string) location-specific state that was provided to e.g. push(path, state) when this location was pushed onto the stack. Only available in browser and memory history.
// push(path, [state]) - (function) Pushes a new entry onto the history stack
// replace(path, [state]) - (function) Replaces the current entry on the history stack
// go(n) - (function) Moves the pointer in the history stack by n entries
// goBack() - (function) Equivalent to go(-1)
// goForward() - (function) Equivalent to go(1)
// block(prompt) - (function) Prevents navigation

class MainTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    const user = userCollection.query({});
    if (user.length == 0) {
      this.props.history.replace("/register");
      console.log('登录失效，退回登录页面');
    }
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
