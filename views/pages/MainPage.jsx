import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Tabs from '../components/Tabs.jsx';

import WelcomePage from './WelcomePage.jsx';

export default class MainPage extends React.Component {
  render() {
    let body = <WelcomePage />;
    let footer = <Tabs />;
    return <PageContainer body = {body} footer={footer} />
  }
}
