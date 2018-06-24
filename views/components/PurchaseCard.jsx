import React from 'react';

import DatePicker from 'react-mobile-datepicker';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';

export default class PurchaseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date(),
      isOpen: false,
      dateType: "",
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
      }
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.changeAmount = this.changeAmount.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick(type) {
    let time = new Date(this.state.data[type])
    this.setState({isOpen: true, dateType: type, time});
  }

  handleCancel() {
    this.setState({isOpen: false});
  }

  handleSelect(date) {
    let {data, dateType} = this.state;
    data[dateType] = date;
    this.setState({data, isOpen: false});
  }
  changeAmount(number) {
    let {data} = this.state;
    data.quantity = number
    this.setState({data})
  }
  handleChange(type) {
    let {data} = this.state;
    data[type] = this.refs[type].value;
    this.setState({data})
  }
  render() {
    let {data} = this.state;
    return (<div className="PurchaseCard">
      <div className="select-material">
        <span>请选择食材&nbsp;&nbsp;<i className="hd-enter"></i>
        </span>
        <i className="hd-close"></i>
      </div>
      <div className="purchase-detail">
        <div className="date" ref="manufactureDate" onClick={() => this.handleClick("manufactureDate")}>{
            data.manufactureDate
              ? new Date(data.manufactureDate).getTime()
              : '生产日期'
          }</div>
        <div className="date" ref="qualityPeriod" onClick={() => this.handleClick("qualityPeriod")}>{
            data.qualityPeriod
              ? new Date(data.qualityPeriod).getTime()
              : '保质期'
          }</div>
        <div className="amount">
          <InputNumber min={1} onChange={this.changeAmount} value={data.quantity} placeholder="输入数量"/>
        </div>
      </div>
      <div className="purchase-price">
        <div className="price">
          <span>￥1</span>/斤
        </div>
        <div className="total-price">
          总计:￥
          <span>1</span>
        </div>
      </div>

      <div className="sign">
        <input className="list-item-body" type="text" onChange={() => this.handleChange("purchaserName")} ref="purchaserName" value={data.purchaserName} placeholder="采购人"/>
        <input className="list-item-body" type="text" onChange={() => this.handleChange("inspectorName")} ref="inspectorName" value={data.inspectorName} placeholder="收货人"/>
        <input className="list-item-body" type="text" onChange={() => this.handleChange("supplierName")} ref="supplierName" value={data.supplierName} placeholder="验货人"/>
      </div>

      <DatePicker theme="ios" value={this.state.time} isOpen={this.state.isOpen} onSelect={this.handleSelect} onCancel={this.handleCancel}/>
    </div>)
  }
}
