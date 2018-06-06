import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Tabs from '../components/Tabs.jsx';

export default class PurchasePage extends React.Component {
  render() {
    let body = <div>采购</div>;
    let footer = <Tabs />;
    return <PageContainer body = {body} footer={footer} />
  }
}
