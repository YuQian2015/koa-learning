import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';

export default class CookbookPage extends React.Component {
  constructor(props) {
    super(props);
    this.addCookbook = this.addCookbook.bind(this);
  }
  addCookbook() {
    this.props.history.push("/add-cookbook");
  }

  render() {
    let body = <div className="AddDietPage">
      <div className="">去添加菜谱</div>
    </div>;
    let tools = <div onClick={this.addCookbook}>添加食材</div>;
    let header = <Header back="" title="菜谱管理" tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
