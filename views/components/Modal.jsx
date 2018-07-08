import React from 'react';
import PropTypes from 'prop-types';

import Dialog from 'rmc-dialog';
import 'rmc-dialog/assets/index.css';

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
    let {content, title, button} = this.props;
    return (<Dialog animation="zoom" onClose={this.hide} visible={show} bodyStyle={{
        padding: 0
      }} closable={false} maskClosable={false}>
      <div className="UI">

        <div className="Modal">

          <div className="modal-title">{title}</div>
          {content}
          <div className="modal-buttons">
            <div className="modal-button" onClick={this.hide}>关闭</div>
            {
              button
                ? <div className="modal-button" onClick={button.callback}>{button.text}</div>
                : null
            }

          </div>
        </div>

      </div>
    </Dialog>)
  }
}

Modal.propTypes = {
  onHide: PropTypes.func,
  content: PropTypes.element.isRequired,
  title: PropTypes.string,
  button: PropTypes.shape({"text": PropTypes.string, "callback": PropTypes.func})
};
