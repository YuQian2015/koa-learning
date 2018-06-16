import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Tabs from '../components/Tabs.jsx';
import Header from '../components/Header.jsx';

export default class HomePage extends React.Component {
  constructor(props){
    super(props);
    this.addDiet = this.addDiet.bind(this);
  }
  addDiet() {
    this.props.history.push("/add-diet");
  }
  render() {
    let body = <div className="HomePage">
      <div className="todo">
        <div className="todo-title">
          <i className="hd-mail-fill"></i>
        </div>
        <div className="todo-content">今日待办今日待办今日待办</div>
      </div>
      <div className="menu">
        <div className="menu-item">
          <i className="hd-mail-fill material-in"></i>
          <p>食材入库</p>
        </div>
        <div className="menu-item">
          <i className="hd-mail-fill"></i>
          <p>库存查询</p>
        </div>
        <div className="menu-item">
          <i className="hd-mail-fill"></i>
          <p>菜单管理</p>
        </div>
        <div className="menu-item">
          <i className="hd-mail-fill"></i>
          <p>材料管理</p>
        </div>
      </div>
      <div className="today-menu">
        <p>今日配菜</p>
        <div className="new-diet" onClick={this.addDiet}><i className="hd-add"></i></div>
      </div>
      <div className="news">
        <p>消息动态</p>
        <div className="news-box">
          <div className="news-item">
            <span className="hd-mail-fill icon"></span>
            <p>采购五斤西红柿，共计35元。</p>
            <span className="new-time">2018-05-30</span>
          </div>
        </div>
        <div className="news-box">
          <div className="news-item">
            <span className="hd-mail-fill icon"></span>
            <p>采购五斤西红柿，共计35元。</p>
            <span className="new-time">2018-05-30</span>
          </div>
        </div>
        <div className="news-box">
          <div className="news-item">
            <span className="hd-mail-fill icon"></span>
            <p>采购五斤西红柿，共计35元。</p>
            <span className="new-time">2018-05-30</span>
          </div>
        </div>
        <div className="news-box">
          <div className="news-item">
            <span className="hd-mail-fill icon"></span>
            <p>采购五斤西红柿，共计35元。</p>
            <span className="new-time">2018-05-30</span>
          </div>
        </div>
        <div className="news-box">
          <div className="news-item">
            <span className="hd-mail-fill icon"></span>
            <p>采购五斤西红柿，共计35元。</p>
            <span className="new-time">2018-05-30</span>
          </div>
        </div>
        <div className="news-box">
          <div className="news-item">
            <span className="hd-mail-fill icon"></span>
            <p>采购五斤西红柿，共计35元。</p>
            <span className="new-time">2018-05-30</span>
          </div>
        </div>
        <div className="news-box">
          <div className="news-item">
            <span className="hd-mail-fill icon"></span>
            <p>采购五斤西红柿，共计35元。</p>
            <span className="new-time">2018-05-30</span>
          </div>
        </div>
        <div className="news-box">
          <div className="news-item">
            <span className="hd-mail-fill icon"></span>
            <p>采购五斤西红柿，共计35元。</p>
            <span className="new-time">2018-05-30</span>
          </div>
        </div>
        <div className="news-box">
          <div className="news-item">
            <span className="hd-mail-fill icon"></span>
            <p>采购五斤西红柿，共计35元。</p>
            <span className="new-time">2018-05-30</span>
          </div>
        </div>
      </div>

    </div>;
    let footer = <Tabs />;
    let header = <Header title="健康饮食" />
    return <PageContainer body={body} footer={footer} header={header}/>
  }
}
