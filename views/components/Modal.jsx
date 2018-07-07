import React from 'react';
import PropTypes from 'prop-types';

import {Scale} from './CSSTransition.jsx';
import {TransitionGroup} from 'react-transition-group';

export default class Modal extends React.Component {
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
    let {onHide} = this.props;
    if (onHide) {
      onHide();
    }
  }
  show() {
    this.setState({show: true});
  }

  render() {
    let {show} = this.state;
    let {content, title} = this.props;
    return (<TransitionGroup className="CSSTransition">
      {
        show
          ? <Scale key="1">
              <div className="Modal">
                <div className="modal-box">

                  <div className="modal-title">{title}</div>
                  {content}
                  <div className="modal-buttons">
                    <div className="modal-button" onClick={this.hide}>关闭</div>
                    <div className="modal-button">确定</div>
                  </div>
                </div>
              </div>
            </Scale>
          : null
      }
    </TransitionGroup>)
  }
}

Modal.propTypes = {
  onHide: PropTypes.func,
  content: PropTypes.element.isRequired,
  title: PropTypes.string
};
