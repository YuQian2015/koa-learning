import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Tabs from '../components/Tabs.jsx';
import Header from '../components/Header.jsx';
import Swipeout from 'rc-swipeout';
import 'rc-swipeout/assets/index.css';
export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.addDiet = this.addDiet.bind(this);
  }
  addDiet() {
    this.props.history.push("/add-diet");
  }
  goToPage(page) {
    this.props.history.push(page);
  }
  render() {
    let body = <div className="HomePage">
      {/* <div className="todo">
        <div className="todo-title">
          <i className="hd-mail-fill"></i>
        </div>
        <div className="todo-content">今日待办今日待办今日待办</div>
      </div> */}
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
        <div className="menu-item" onClick={() => {
            this.goToPage("/material")
          }}>
          <i className="hd-mail-fill"></i>
          <p>食材管理</p>
        </div>
      </div>
      <div className="today-menu">
        <p>今日配菜</p>
        <div className="new-diet" onClick={this.addDiet}>
          <i className="hd-add"></i>
        </div>
      </div>
      <div className="news">
        <p>消息动态（左滑删除）</p>

        <Swipeout right={[

            {
              text: '查看',
              onPress: () => console.log('reply'),
              style: {
                backgroundColor: 'orange',
                color: 'white'
              },
              className: 'custom-class-1'
            }, {
              text: '删除',
              onPress: () => console.log('delete'),
              style: {
                backgroundColor: 'red',
                color: 'white'
              },
              className: 'custom-class-2'
            }
          ]} onOpen={() => console.log('open')} onClose={() => console.log('close')}>
          <div className="news-item">
            <i className="hd-mail-fill icon"></i>
            <p>采购五斤西红柿，共计35元。</p>
            <span className="new-time">2018-05-30</span>
          </div>
        </Swipeout>

        <Swipeout right={[

            {
              text: '查看',
              onPress: () => console.log('reply'),
              style: {
                backgroundColor: 'orange',
                color: 'white'
              },
              className: 'custom-class-1'
            }, {
              text: '删除',
              onPress: () => console.log('delete'),
              style: {
                backgroundColor: 'red',
                color: 'white'
              },
              className: 'custom-class-2'
            }
          ]} onOpen={() => console.log('open')} onClose={() => console.log('close')}>
          <div className="news-item">
            <i className="hd-mail-fill icon"></i>
            <p>采购五斤西红柿，共计35元。</p>
            <span className="new-time">2018-05-30</span>
          </div>
        </Swipeout>
      </div>

    </div>;
    let footer = <Tabs/>;
    let header = <Header title="健康饮食"/>
    return <PageContainer body={body} footer={footer} header={header}/>
  }
}
