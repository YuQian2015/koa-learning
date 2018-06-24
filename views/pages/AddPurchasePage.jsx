import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';
import PurchaseCard from '../components/PurchaseCard.jsx';

import DatePicker from 'react-mobile-datepicker';

export default class AddPurchasePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let body = <div className="AddPurchasePage">
      <PurchaseCard/>
      <PurchaseCard/>
      <PurchaseCard/>
      <PurchaseCard/>
      <PurchaseCard/>
      <div className="list-box">
        <div className="list-item">
          <div className="list-item-header">采购单</div>
          <input className="list-item-body" type="text" onChange={() => this.handleChange("unit")} ref="unit" placeholder="选择采购单"/>
          <div className="list-item-footer">
            <i className="hd-enter"></i>
          </div>
        </div>
      </div>

      <button className="block">保存</button>
    </div>;
    let tools = <div onClick={this.saveMaterial}>保存</div>;
    let header = <Header back="" title="添加采购项目" tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
