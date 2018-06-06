import React from 'react';

import {HashRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';

import { CSSTransitionGroup } from 'react-transition-group'


import WelcomePage from './pages/WelcomePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MainPage from './pages/MainPage.jsx';
import PurchasePage from './pages/PurchasePage.jsx';
import StoragePage from './pages/StoragePage.jsx';
import MonthlyPage from './pages/MonthlyPage.jsx';
import SettingPage from './pages/SettingPage.jsx';
import HomePage from './pages/HomePage.jsx';


export default class App extends React.Component {
  render() {
    return <Router>
      <Switch>
          {/* <Route exact path="/" component={MainPage}/> */}
          <Route exact path="/" render={() => (<Redirect to="/welcome"/>)}/>
          <Route exact path="/home" component={HomePage}/>
          <Route exact path="/welcome" component={WelcomePage}/>
          <Route exact path="/purchase" component={PurchasePage}/>
          <Route exact path="/storage" component={StoragePage}/>
          <Route exact path="/monthly" component={MonthlyPage}/>
          <Route path="/setting" component={SettingPage}/>
          <Route path="/register" component={RegisterPage}/>
      </Switch>
    </Router>
  }
}
