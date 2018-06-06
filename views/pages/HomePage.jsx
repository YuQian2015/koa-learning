import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Tabs from '../components/Tabs.jsx';

export default class HomePage extends React.Component {
  render() {
    let body = <div className="HomePage">
      <div className="todo">
        <div className="todo-title">
          <i className="healthyDiet hd-mail-fill"></i>
        </div>
        <div className="todo-content">今日待办今日待办今日待办</div>
      </div>
      <div className="menu">
        <div className="menu-item">
          <i className="healthyDiet hd-mail-fill"></i>
          <p>入库</p>
        </div>
        <div className="menu-item">
          <i className="healthyDiet hd-mail-fill"></i>
          <p>库存</p>
        </div>
        <div className="menu-item">
          <i className="healthyDiet hd-mail-fill"></i>
          <p>菜单</p>
        </div>
        <div className="menu-item">
          <i className="healthyDiet hd-mail-fill"></i>
          <p>材料管理</p>
        </div>
      </div>
      <div className="today-menu">
        <p>今日配菜</p>
        <div className="new-diet">点击添加</div>
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
    let footer = <Tabs/>;
    return <PageContainer body={body} footer={footer}/>
  }
}
