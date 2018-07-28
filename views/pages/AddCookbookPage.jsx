import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';

export default class AddCookbookPage extends React.Component {
  constructor(props) {
    super(props);
    this.selectMaterial = this.selectMaterial.bind(this);
  }

  selectMaterial() {
    this.props.history.push({
      pathname: '/select-material',
      search: JSON.stringify({isMultiple: true}),
      // state: item
    });
  }

  saveCookbook() {

  }

  render() {
    let body = <div className="AddDietPage">
      <div className="input-box">
        <input type="text" placeholder="输入菜名"/>
      </div>
      <div className="add" onClick={this.selectMaterial}>输入需要的食材</div>
    </div>;
    let tools = <div onClick={this.save}>保存</div>;
    let header = <Header back="" title="菜谱管理" tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
