import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Tabs from '../components/Tabs.jsx';
import Header from '../components/Header.jsx';

export default class PurchasePage extends React.Component {

  constructor(props) {
    super(props);
    this.addPurchase = this.addPurchase.bind(this);
  }

  addPurchase() {
    this.props.history.push("/add-purchase");
  }
  render() {
    let body = <div>采购</div>;
    let tools = <div onClick={this.addPurchase}>添加采购</div>;
    let footer = <Tabs />;
    let header = <Header title="采购单" tools={tools} />
    return <PageContainer body={body} footer={footer} header={header} />
  }
}
