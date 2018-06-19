import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Tabs from '../components/Tabs.jsx';
import Header from '../components/Header.jsx';

export default class StoragePage extends React.Component {
  render() {
    let body = <div>
      <div className="list-box">
        <div className="list-item">
          <div className="list-item-header">食材</div>
          <div className="list-item-body">请选择</div>
          <div className="list-item-footer">
            <i className="hd-enter"></i>
          </div>
        </div>
        <div className="list-item">
          <div className="list-item-header">数量</div>
          <input className="list-item-body" type="text" onChange={() => this.handleChange("unit")} ref="unit" placeholder="请输入数量"/>
          <div className="list-item-footer">
            <i className="hd-enter"></i>
          </div>
        </div>
        <div className="list-item">
          <div className="list-item-header">单价</div>
          <input className="list-item-body" type="text" onChange={() => this.handleChange("price")} ref="price" placeholder="元"/>
          <div className="list-item-footer">
            <i className="hd-enter"></i>
          </div>
        </div>
      </div>
        <div className="list-box">
          <div className="list-item">
            <div className="list-item-header">生产日期</div>
            <input className="list-item-body" type="text" onChange={() => this.handleChange("unit")} ref="unit" placeholder="请输入数量"/>
            <div className="list-item-footer">
              <i className="hd-enter"></i>
            </div>
          </div>
          <div className="list-item">
            <div className="list-item-header">保质期</div>
            <input className="list-item-body" type="text" onChange={() => this.handleChange("price")} ref="price" placeholder="元"/>
            <div className="list-item-footer">
              <i className="hd-enter"></i>
            </div>
          </div>
        </div>
          <div className="list-box">
            <div className="list-item">
              <div className="list-item-header">采购人</div>
              <input className="list-item-body" type="text" onChange={() => this.handleChange("unit")} ref="unit" placeholder="请输入数量"/>
              <div className="list-item-footer">
                <i className="hd-enter"></i>
              </div>
            </div>
            <div className="list-item">
              <div className="list-item-header">收货人</div>
              <input className="list-item-body" type="text" onChange={() => this.handleChange("price")} ref="price" placeholder="元"/>
              <div className="list-item-footer">
                <i className="hd-enter"></i>
              </div>
            </div>
            <div className="list-item">
              <div className="list-item-header">验货人</div>
              <input className="list-item-body" type="text" onChange={() => this.handleChange("price")} ref="price" placeholder="元"/>
              <div className="list-item-footer">
                <i className="hd-enter"></i>
              </div>
            </div>
          </div>

            <div className="list-box">
              <div className="list-item">
                <div className="list-item-header">采购单</div>
                <input className="list-item-body" type="text" onChange={() => this.handleChange("unit")} ref="unit" placeholder="请输入数量"/>
                <div className="list-item-footer">
                  <i className="hd-enter"></i>
                </div>
              </div>
            </div>
<button className="block">保存</button>
    </div>;
    let footer = <Tabs />;
    let tools = <div onClick={this.addMaterial}>查看历史</div>;
    let header = <Header title="入库" tools={tools}/>
    return <PageContainer body = {body} footer={footer} header={header}/>
  }
}
