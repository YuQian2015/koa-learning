import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Tabs from '../components/Tabs.jsx';
import Header from '../components/Header.jsx';
import Refresher from '../components/Refresher.jsx';

import LocalDB from 'local-db';
const materialOrderCollection = new LocalDB('materialOrderCollection');

import PurchaseService from '../service/PurchaseService.jsx';

export default class PurchasePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      materialOrder: [],
      showAdd: false,
      inputName: ""
    }
    this.addPurchase = this.addPurchase.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addOrder = this.addOrder.bind(this);
    this.toDetail = this.toDetail.bind(this);
  }

  componentWillMount() {
    // 从本地取
    if (materialOrderCollection.read().length) {
      this.setState({materialOrder: materialOrderCollection.read()})
      return
    }
    this.fetchData();
  }

  fetchData() {
    PurchaseService.findOrder({}, (res) => {
      if (res.error) {
        console.log(res.msg);
        return
      }
      this.setState({materialOrder: res.data});
      materialOrderCollection.drop();
      res.data.map(item => {
        materialOrderCollection.insert(item);
      })
    }, (error) => {
      console.log(error);
    })
  }

  addOrder() {
    const {inputName} = this.state;
    PurchaseService.addOrder({
      name: inputName
    }, (res) => {
      if (res.error) {
        console.log(res.msg);
        return
      }
      let materialOrder = this.state.materialOrder;
      materialOrder.push(res.data);
      this.setState({materialOrder, showAdd: false, inputName: ""});
      materialOrderCollection.insert(res.data);
    }, (error) => {
      console.log(error);
    })
  }

  handleRefresh() {
    return new Promise((resolve, reject) => {
      PurchaseService.findOrder({}, (res) => {
        if (res.error) {
          reject();
          return
        }
        console.log(res);
        this.setState({materialOrder: res.data});
        materialOrderCollection.drop();
        res.data.map(item => {
          materialOrderCollection.insert(item);
        })
        resolve();
      }, (error) => {
        reject();
      })
    });
  }

  addPurchase() {
    this.props.history.push("/add-purchase");
  }
  handleAdd() {
    this.setState({showAdd: true})
  }
  handleClose() {
    this.setState({showAdd: false})
  }
  // 前往采购单详情添加采购项目
  toDetail(item) {
    this.props.history.push({
      pathname: '/add-purchase',
      search: JSON.stringify({id: item._id, name: item.name}),
      state: item
    });

  }
  handleChange(name) {
    this.setState({inputName: this.refs[name].value})
  }
  render() {
    const {materialOrder, showAdd, inputName} = this.state;
    let body = <Refresher onRefresh={this.handleRefresh}>
      <div className="PurchasePage">
        {
          showAdd
            ? <div className="add-purchase-order-input">
                <input type="text" value={inputName} ref="inputName" onChange={() => this.handleChange("inputName")} placeholder="输入采购单名称"/>
                <div className="close" onClick={this.handleClose}>
                  <i className="hd-fail-fill"></i>
                </div>
                <button className="block" onClick={this.addOrder}>确定</button>
              </div>
            : <div className="add-purchase-order" onClick={this.handleAdd}>添加采购单</div>
        }

        <div className="list-box">
          {
            materialOrder.map((item, i) => <div className="list-item" onClick={() => this.toDetail(item)} key={i}>
              <div className="list-item-header">{item.name}</div>
              <div className="list-item-body"></div>
              <div className="list-item-footer">
                <i className="hd-enter"></i>
              </div>
            </div>)
          }
        </div>
      </div>
    </Refresher>;
    let tools = <div onClick={this.addPurchase}>添加采购</div>;
    let footer = <Tabs/>;
    let header = <Header title="采购单" tools={tools}/>
    return <PageContainer body={body} footer={footer} header={header}/>
  }
}
