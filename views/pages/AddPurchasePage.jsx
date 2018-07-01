import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';
import PurchaseCard from '../components/PurchaseCard.jsx';

import PurchaseService from '../service/PurchaseService.jsx';

export default class AddPurchasePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        "code": 0,
        "purchasingDate": new Date(),
        "name": "string",
        "manufactureDate": new Date(),
        "qualityPeriod": new Date(),
        "quantity": 1,
        "unit": "string",
        "price": 0,
        "totalPrice": 0,
        "purchaserName": "",
        "inspectorName": "",
        "supplierName": "",
        "sign": "string"
      },
      purchaseOrder: {
        id: "",
        name: ""
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.savePurchase = this.savePurchase.bind(this);
  }

  componentWillMount() {
    console.log(this.props.location.state);
    if (this.props.location.search) {
      let search = decodeURI(this.props.location.search);
      let data = JSON.parse(search.split("?")[1]);
      this.setState({purchaseOrder: data})
    }
  }

  handleChange() {
    console.log(this.state.data);
  }

  savePurchase() {
    let {data} = this.state;
    data.purchaseOrderId = this.state.purchaseOrder.id;

    PurchaseService.add(data, (res) => {
      if (res.error) {
        this.setState({
          contentText: res.msg
        }, () => {
          this.refs.toast.show();
        });
        return
      }
      console.log(res);
    }, (error) => {
      console.log(error);
    })
  }
  render() {
    let {data, purchaseOrder} = this.state;
    let body = <div className="AddPurchasePage">
      <PurchaseCard data={data} onChange={this.handleChange}/>
      <div className="list-box">
        <div className="list-item">
          <div className="list-item-header">采购单</div>
          <input className="list-item-body" type="text" value={purchaseOrder.name} disabled="disabled" placeholder="选择采购单"/>
          <div className="list-item-footer">
            <i className="hd-enter"></i>
          </div>
        </div>
      </div>
    </div>;
    let tools = <div onClick={this.savePurchase}>保存</div>;
    let header = <Header back="" title={purchaseOrder.name?purchaseOrder.name:"添加采购项目"} tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
