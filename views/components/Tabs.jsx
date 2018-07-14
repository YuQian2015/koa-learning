import React from 'react';

import {NavLink} from 'react-router-dom'

export default class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {
          tabName: "配餐",
          linkUrl: "/home",
          normalIcon: "hd-diet",
          activeIcon: "hd-diet-fill"
        }, {
          tabName: "采购单",
          linkUrl: "/purchase",
          normalIcon: "hd-bill",
          activeIcon: "hd-bill-fill"
        }, {
          tabName: "出入库",
          linkUrl: "/storage",
          normalIcon: "hd-food",
          activeIcon: "hd-food-fill"
        }, {
          tabName: "月结算",
          linkUrl: "/monthly",
          normalIcon: "hd-calculat",
          activeIcon: "hd-calculat-fill"
        }, {
          tabName: "设置",
          linkUrl: "/setting",
          normalIcon: "hd-setting",
          activeIcon: "hd-setting-fill"
        }
      ]
    }
  }
  render() {
    let {tabs} = this.state;
    return (<ul className="Tabs">
      {
        tabs.map((item, i) => (<li className="tab" key={i}>
          <NavLink to={item.linkUrl} activeClassName="active" replace={true}>
            <i className={item.normalIcon}></i>
            <i className={item.activeIcon + ' active'}></i>
            <p>{item.tabName}</p>
          </NavLink>
        </li>))
      }
    </ul>)
  }
}
