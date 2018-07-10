import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Tabs from '../components/Tabs.jsx';
import Header from '../components/Header.jsx';

export default class StoragePage extends React.Component {
  render() {
    let body = <div>
    12312
    </div>;
    let footer = <Tabs />;
    let tools = <div onClick={this.addMaterial}>查看历史</div>;
    let header = <Header title="入库" tools={tools}/>
    return <PageContainer body = {body} footer={footer} header={header}/>
  }
}
