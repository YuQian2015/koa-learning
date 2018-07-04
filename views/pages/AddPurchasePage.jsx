import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';
import PurchaseCard from '../components/PurchaseCard.jsx';

import PurchaseService from '../service/PurchaseService.jsx';

import LocalDB from 'local-db';
const materialSelectCollection = new LocalDB('materialSelectCollection');

export default class AddPurchasePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      purchaseOrder: {
        id: "",
        name: ""
      }
    };
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
    let selectMaterial = materialSelectCollection.read();
    let dataList = [];
    if(selectMaterial.length) {
      for(let item of selectMaterial) {
          dataList.push(
              {
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
              }
          )

      }
      console.log(dataList)
    }
    this.setState({
        dataList
    });
    console.log(selectMaterial);
  }

  handleChange() {
    console.log(123213);
  }

  savePurchase() {
    let {dataList} = this.state;
    for ( let item of dataList) {
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
      console.log(res);
    }, (error) => {
      console.log(error);
    })
  }
  render() {
    let {purchaseOrder, dataList} = this.state;
    let body = <div className="AddPurchasePage">
        {
            dataList.map((item,i) => <PurchaseCard key={i} data={item} onChange={this.handleChange}/>)
        }
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
