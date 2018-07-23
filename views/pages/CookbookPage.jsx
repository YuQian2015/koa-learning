import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';

export default class CookbookPage extends React.Component {
  constructor(props) {
    super(props);
    this.addMaterial = this.addMaterial.bind(this);
  }
  addMaterial() {
    this.props.history.push("/add-material");
  }

  render() {
    let body = <div className="AddDietPage">
      添加
      <button className="block" onClick={this.doAdd}>
        保存
      </button>
    </div>;
    let tools = <div onClick={this.addMaterial}>添加食材</div>;
    let header = <Header back="" title="菜谱管理" tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
