import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';
import Toast from '../components/Toast.jsx';
import PurchaseCard from '../components/PurchaseCard.jsx';

import PurchaseService from '../service/PurchaseService.jsx';

import LocalDB from 'local-db';
const materialSelectCollection = new LocalDB('materialSelect');
const userCollection = new LocalDB('user');
const materialListCollection = new LocalDB('materialList');

export default class AddPurchasePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      purchaseOrder: {
        id: "",
        name: ""
      },
      purchaseList:[]
    };
    this.handleChange = this.handleChange.bind(this);
    this.savePurchase = this.savePurchase.bind(this);
    this.addPurchase = this.addPurchase.bind(this);
    this.hideToast = this.hideToast.bind(this);
  }

  componentWillMount() {
    console.log(this.props.location.state);
    if (this.props.location.search) {
      let search = decodeURI(this.props.location.search);
      let data = JSON.parse(search.split("?")[1]);
      this.setState({purchaseOrder: data})
    }
    let selectMaterial = materialSelectCollection.read();
    let user = userCollection.read()[0];
    console.log(user);
    let dataList = [];
    if (selectMaterial.length) {
      for (let item of selectMaterial) {
        dataList.push({
          "code": item.code,
          "purchasingDate": new Date(),
          "name": item.name,
          "manufactureDate": new Date(),
          "qualityPeriod": new Date(),
          "quantity": 1,
          "unit": item.unit,
          "price": item.price,
          "totalPrice": item.price,
          "purchaserName": "123",
          "inspectorName": "123",
          "supplierName": "123",
          "sign": "string"
        })

      }
      console.log(dataList)
    }
    this.setState({dataList});
    console.log(selectMaterial);
    this.fetchData();
  }

  fetchData() {
    PurchaseService.find({}, (res) => {
        if (res.error) {
          console.log(res.msg);
          return
        }
        this.setState({purchaseList: res.data});
        materialListCollection.drop();
        res.data.map(item => {
          materialListCollection.insert(item);
        })
      }, (error) => {
        console.log(error);
      })
  }

  handleChange() {
    console.log(123213);
  }

  addPurchase() {
    this.props.history.push("/select-material");
  }

  hideToast() {
    this.props.history.goBack();
  }

  savePurchase() {
    let {dataList} = this.state;
    for (let item of dataList) {
      item.purchaseOrderId = this.state.purchaseOrder.id;
    }
    console.log(dataList);

    PurchaseService.add(dataList[0], (res) => {
      if (res.error) {
        this.setState({
          contentText: res.msg
        }, () => {
          this.refs.toast.show();
        });
        return
      }
      materialSelectCollection.drop();
      this.setState({
        contentText: "保存成功"
      }, () => {
        this.refs.toast.show();
      });
    }, (error) => {
      console.log(error);
    })
  }
  render() {
    let {purchaseOrder, dataList, contentText, purchaseList} = this.state;
    let body = <div className="AddPurchasePage">
      <Toast ref="toast" icon="hd-success-fill" contentText={contentText} onHide={this.hideToast}/> {
        dataList.length
          ? dataList.map((item, i) => <PurchaseCard key={i} data={item} onChange={this.handleChange}/>)
          : null
      }
      {
        purchaseList.map((item, i) => (<div className="purchase" key={i}>
          <div className="name">{item.name}</div>
          <div className="price">{item.totalPrice}元</div>
        </div>))
      }
      {/* <div className="list-box">
        <div className="list-item">
          <div className="list-item-header">采购单</div>
          <input className="list-item-body" type="text" value={purchaseOrder.name} disabled="disabled" placeholder="选择采购单"/>
          <div className="list-item-footer">
            <i className="hd-enter"></i>
          </div>
        </div>
      </div> */}
    </div>;
    let tools = dataList.length?<div onClick={this.savePurchase}>保存</div>:<div onClick={this.addPurchase}>新增</div>;
    let header = <Header back="" title={purchaseOrder.name
        ? purchaseOrder.name
        : "添加采购项目"} tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
