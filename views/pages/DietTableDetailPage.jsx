import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';

export default class DietTablePage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}
  render() {
    let body = <div className="DietTableDetailPage">
      1231312312
    </div>
    let tools = <div>确定</div>;
    let header = <Header back="" title="公示表详情" tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
