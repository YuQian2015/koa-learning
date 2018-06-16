import React from 'react';
import {withRouter} from "react-router-dom";

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    }
    this.goBack = this.goBack.bind(this);
  }
  goBack() {
    this.props.history.goBack();
  }
  render() {
    let {back, title, tools} = this.state;
    return (<div className="Header">
      {
        back != undefined
          ? <div className="back" onClick={this.goBack}>
              <i className="hd-return"></i>{back}</div>
          : null
      }
      {
        title
          ? <div className="title">{title}</div>
          : null
      }
      {
        tools
          ? <div className="tools">{tools}</div>
          : null
      }

    </div>)
  }
}

export default withRouter(Title);
