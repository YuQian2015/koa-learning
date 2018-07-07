import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";

import SignaturePad from 'react-signature-pad-wrapper'

import DatePicker from 'react-mobile-datepicker';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';

import Moment from 'react-moment';

class PurchaseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date(),
      isOpen: false,
      dateType: "",
      data: props.data,
      showSign: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.changeAmount = this.changeAmount.bind(this);
    this.changePrice = this.changePrice.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.selectMaterial = this.selectMaterial.bind(this);
    this.toggleSign = this.toggleSign.bind(this);
    this.clearPad = this.clearPad.bind(this);
    this.savePad = this.savePad.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  handleClick(type) {
    let time = this.state.data[type]
      ? new Date(this.state.data[type])
      : new Date()
    this.setState({isOpen: true, dateType: type, time});
  }

  handleCancel() {
    this.setState({isOpen: false});
  }

  handleSelect(date) {
    let {data} = this.props;
    let {dateType} = this.state;
    data[dateType] = date;
    this.setState({data, isOpen: false});
    this.props.onChange(dateType, date);
  }
  changeAmount(number) {
    if (!number) {
      number = 0;
    }
    let {data} = this.state;
    data.quantity = number;
    data.totalPrice = number * data.price;
    this.setState({data});
    this.props.onChange('quantity', number);

  }
  changePrice(number) {
    if (!number) {
      number = 0;
    }
    let {data} = this.state;
    data.price = number;
    data.totalPrice = number * data.quantity;
    this.setState({data});
    this.props.onChange('price', number);
  }
  handleChange(type) {
    let {data} = this.state;
    data[type] = this.refs[type].value;
    this.setState({data})
    this.props.onChange(type, data);
  }

  selectMaterial() {
    this.props.history.push("/select-material");
  }
  toggleSign() {
    let {showSign} = this.state;
    this.setState({
      showSign: !showSign
    })
  }
  onEnd() {
    this.savePad();
  }
  savePad() {
    let {data} = this.state;
    data.sign = this.signaturePad.toDataURL()
    this.setState({data})
  }
  clearPad() {
    this.signaturePad.clear();
  }
  render() {
    let {data, showSign} = this.state;
    return (<div className="PurchaseCard">
      <div className="select-material">
        <span onClick={this.selectMaterial}>{
            data.name
              ? data.name
              : "请选择食材"
          }&nbsp;&nbsp;<i className="hd-enter"></i>
        </span>
        <i className="hd-close"></i>
      </div>
      <div className="purchase-detail">
        <div className="date" ref="manufactureDate" onClick={() => this.handleClick("manufactureDate")}>
          {
            data.manufactureDate
              ? <Moment format="YYYY-MM-DD">{data.manufactureDate}</Moment>
              : '生产日期'
          }</div>
        <div className="date" ref="qualityPeriod" onClick={() => this.handleClick("qualityPeriod")}>{
            data.qualityPeriod
              ? <Moment format="YYYY-MM-DD">{data.qualityPeriod}</Moment>
              : '保质期'
          }</div>
      </div>
      <div className="purchase-price">
        <div className="price">
          <span>单价：<InputNumber min={0} onChange={this.changePrice} value={data.price} placeholder="输入数量"/></span>
        </div>
        <div className="amount">
          数量：
          <InputNumber min={0} onChange={this.changeAmount} value={data.quantity} placeholder="输入数量"/>
        </div>
      </div>
      <div className="purchase-price">
        <div className="total-price">
          总计:￥
          <span>{data.totalPrice}</span>
        </div>
        <div className="sign-name" onClick={this.toggleSign}>
          {
            showSign
              ? "保存签字"
              : "收起签字"
          }
        </div>
      </div>
      {
        showSign
          ? <div className="sign-box">
              <SignaturePad ref={ref => this.signaturePad = ref} options={{
                  onEnd:this.onEnd,
                  minWidth: 1,
                  maxWidth: 3,
                  dotSize: 2,
                  penColor: 'rgb(0, 0, 0)'
                }}/>
              <div className="sign-tools">
                <div onClick={this.clearPad}>重写</div>
                <div onClick={this.savePad}>保存生效</div>
              </div>
            </div>
          : null
      }

      <div className="sign">
        <input className="list-item-body" type="text" onChange={() => this.handleChange("purchaserName")} ref="purchaserName" value={data.purchaserName} placeholder="采购人"/>
        <input className="list-item-body" type="text" onChange={() => this.handleChange("inspectorName")} ref="inspectorName" value={data.inspectorName} placeholder="收验货人"/>
        <input className="list-item-body" type="text" onChange={() => this.handleChange("supplierName")} ref="supplierName" value={data.supplierName} placeholder="供货人"/>
      </div>

      <DatePicker theme="ios" value={this.state.time} isOpen={this.state.isOpen} onSelect={this.handleSelect} onCancel={this.handleCancel}/>
    </div>)
  }
}

PurchaseCard.propTypes = {
  onChange: PropTypes.func.isRequired,
  // 一个特定形式的对象
  data: PropTypes.shape({
    "code": PropTypes.number.isRequired,
    "purchasingDate": PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]).isRequired,
    "name": PropTypes.string.isRequired,
    "manufactureDate": PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    "qualityPeriod": PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    "quantity": PropTypes.number,
    "unit": PropTypes.string,
    "price": PropTypes.number,
    "totalPrice": PropTypes.number,
    "purchaserName": PropTypes.string,
    "inspectorName": PropTypes.string,
    "supplierName": PropTypes.string,
    "sign": PropTypes.string,
    "purchaseOrderId":  PropTypes.string
  }).isRequired
};

export default withRouter(PurchaseCard);
