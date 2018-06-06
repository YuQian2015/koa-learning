import React from 'react';

import {Scale} from './CSSTransition.jsx';
import {TransitionGroup} from 'react-transition-group';

import alertMusic from '../assest/music/bubble.mp3';

export default class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      music: new Audio(alertMusic)
    };
    this.hide = this.hide.bind(this);
  }


  componentWillMount() {}
  hide() {
    this.setState({show: false});
  }
  show() {
    this.setState({show: true});
    this.state.music.play();
  }

  render() {
    let {show} = this.state;
    let {titleText, contentText, buttonText} = this.props;
    return (<TransitionGroup className="CSSTransition">
      {
        show
          ? <Scale key="1">
              <div className="Alert">
                <audio src={alertMusic} ref="alertMusic">您的浏览器不支持 audio 标签。</audio>
                <div className="div_title">{
                    titleText
                      ? titleText
                      : '提示'
                  }</div>
                <div className="div_p">{
                    contentText
                      ? contentText
                      : ''
                  }</div>
                <div className="div_bottom">
                  <a href="javascript:;" onClick={this.hide}>{
                      buttonText
                        ? buttonText
                        : '确认'
                    }</a>
                </div>
              </div>
            </Scale>
          : null
      }
    </TransitionGroup>)
  }
}
