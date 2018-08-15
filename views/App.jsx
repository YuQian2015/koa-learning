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
import AddDietPage from './pages/AddDietPage.jsx';
import AddMaterialPage from './pages/AddMaterialPage.jsx';
import AddPurchasePage from './pages/AddPurchasePage.jsx';
import MaterialPage from './pages/MaterialPage.jsx';
import CookbookPage from './pages/CookbookPage.jsx';
import DietTablePage from './pages/DietTablePage.jsx';
import DietTableDetailPage from './pages/DietTableDetailPage.jsx';
import AddCookbookPage from './pages/AddCookbookPage.jsx';
import SelectMaterialPage from './pages/SelectMaterialPage.jsx';




export default class App extends React.Component {
  render() {
    return (<Router>
      <Switch>
          {/* <Route exact path="/" component={MainPage}/> */}
          <Route exact path="/" render={() => (<Redirect to="/welcome"/>)}/>
          <Route exact path="/home" component={HomePage}/>
          <Route exact path="/welcome" component={WelcomePage}/>
          <Route exact path="/purchase" component={PurchasePage}/>
          <Route exact path="/storage" component={StoragePage}/>
          <Route exact path="/monthly" component={MonthlyPage}/>
          <Route exact path="/add-diet" component={AddDietPage}/>
          <Route exact path="/add-material" component={AddMaterialPage}/>
          <Route exact path="/add-purchase" component={AddPurchasePage}/>
          <Route exact path="/material" component={MaterialPage}/>
          <Route exact path="/cookbook" component={CookbookPage}/>
          <Route exact path="/diet-table" component={DietTablePage}/>
          <Route exact path="/diet-table-detail" component={DietTableDetailPage}/>
          <Route exact path="/add-cookbook" component={AddCookbookPage}/>
          <Route exact path="/select-material" component={SelectMaterialPage}/>
          <Route path="/setting" component={SettingPage}/>
          <Route path="/register" component={RegisterPage}/>
      </Switch>
    </Router>)
  }
}
