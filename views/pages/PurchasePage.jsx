import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Tabs from '../components/Tabs.jsx';
import Header from '../components/Header.jsx';

export default class PurchasePage extends React.Component {
  render() {
    let body = <div>采购</div>;
    let footer = <Tabs />;
    let header = <Header title="采购单" />
    return <PageContainer body = {body} footer={footer} header={header} />
  }
}
