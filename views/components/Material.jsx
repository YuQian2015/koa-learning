import React from 'react';
import {withRouter} from "react-router-dom";

class Material extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {name, price, unit, code, type} = this.props;
    const tags = [
      '肉禽蛋',
      '果蔬菌',
      '五谷粮油',
      '调料',
      '饮料',
      '其它'
    ]
    return (<div className="Material">
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
