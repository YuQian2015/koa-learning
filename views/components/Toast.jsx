import React from 'react';

import {Scale} from './CSSTransition.jsx';
import {TransitionGroup} from 'react-transition-group';

export default class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.hide = this.hide.bind(this);
  }

  componentWillMount() {}
  hide() {
    this.setState({show: false});
  }
  show() {
    let time = this.state.time;
    this.setState({show: true});
    setTimeout(
      () => {
      this.setState({show: false});
    }, time
      ? time
      : 2000);
  }

  render() {
    let {show} = this.state;
    let {contentText, icon} = this.props;
    return (<TransitionGroup className="CSSTransition">
      {
        show
          ? <Scale key="1">
              <div className="Toast" onClick={this.hide}>

                <div className="toast-box">

                  {
                    icon
                      ? <i className={icon}></i>
                      : null
                  }
                  {
                    contentText
                      ? contentText
                      : ''
                  }</div>
              </div>
            </Scale>
          : null
      }
    </TransitionGroup>)
  }
}
