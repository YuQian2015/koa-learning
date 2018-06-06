import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Tabs from '../components/Tabs.jsx';

export default class StoragePage extends React.Component {
  render() {
    let body = <div>入库</div>;
    let footer = <Tabs />;
    return <PageContainer body = {body} footer={footer} />
  }
}
