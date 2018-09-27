import React from 'react';
import {withRouter} from "react-router-dom";

class Material extends React.Component {
  constructor(props) {
    super(props);
    this.showMaterialDetail = this.showMaterialDetail.bind(this);
  }
  showMaterialDetail() {
    console.log(this.props);
      let {name, price, unit, _id, type} = this.props;
      this.props.history.push({
          pathname: "/add-material",
          state: {
            name,
            price,
            unit,
            type,
            _id
          }
      });
  }
  render() {
    let {name, price, unit, code, type} = this.props;
    const tags = [
      '粮食类',
      '油肉类',
      '蔬菜类',
      '调料类',
      '其它'
    ]
    return (<div className="Material" onClick={this.showMaterialDetail}>
      <div className="name">{name}</div>
      <div className="info">
        <div className="code">编号：{code}</div>
        <div className="type tag">{tags[type-1]}</div>
        <div className="price">{price}元/{unit}</div>
      </div>
    </div>)
  }
}

export default withRouter(Material);
