import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Tabs from '../components/Tabs.jsx';
import Header from '../components/Header.jsx';
import {Fade} from '../components/CSSTransition.jsx';

class FadeInAndOut extends React.Component {
  constructor(...args) {
    super(...args);
    console.log(...args);
    this.state = { show: false }
    this.changeDisplay = this.changeDisplay.bind(this);
  }
  changeDisplay() {
      this.setState({ show: !this.state.show })
  }
  render() {
    return (
      <div>
        <div onClick={this.changeDisplay}>切换显示</div>
        <Fade in={this.state.show} onEnter={() => {alert("onEnter")}} onEntering={() => {alert("onEntering")}} onEntered={() => {alert("onEntered")}}>
          <div className='greeting'>Hello world</div>
        </Fade>
      </div>
    )
  }
}

export default class SettingPage extends React.Component {

  constructor(props) {
    super(props);
    this.setData = this.setData.bind(this);
  }

  componentWillMount () {
  }
  setData() {

  }

  render() {
    let body = <div className="SettingPage" onClick={this.setData}>
      <input placeholder="输入姓名" />
      <FadeInAndOut />

    </div>;
    let footer = <Tabs />;
    let header = <Header title="设置" />
    return <PageContainer body = {body} footer={footer} header={header}/>
  }
}
