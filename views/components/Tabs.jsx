import React from 'react';

import { Link } from 'react-router-dom'

export default class Tabs extends React.Component {
  render() {
    return (
      <ul className="Tabs">
        <li className="tab"><Link className="hd-diet" to="/home" replace ></Link><p>配餐</p></li>
        <li className="tab"><Link className="hd-bill" to="/purchase" replace ></Link><p>采购单</p></li>
        <li className="tab"><Link className="hd-food" to="/storage" replace ></Link><p>入库</p></li>
        <li className="tab"><Link className="hd-calculat" to="/monthly" replace ></Link><p>月结算</p></li>
        <li className="tab"><Link className="hd-food" to="/setting" replace ></Link><p>设置</p></li>
      </ul>
    )
  }
}
