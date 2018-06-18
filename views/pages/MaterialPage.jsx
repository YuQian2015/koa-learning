import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';
import Material from '../components/Material.jsx';
import Refresher from '../components/Refresher.jsx';

import MaterialService from '../service/MaterialService.jsx';

import LocalDB from 'local-db';
const materialCollection = new LocalDB('materialCollection');

export default class MaterialPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      materialList: []
    }
    this.addMaterial = this.addMaterial.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  addMaterial() {
    this.props.history.push("/add-material");
  }

  componentWillMount() {
    if (materialCollection.read().length) {
      this.setState({materialList: materialCollection.read()})
      return
    }
    this.fetchData();
  }

  fetchData() {
    MaterialService.find({}, (res) => {
      if (res.error) {
        console.log(res.msg);
        return
      }
      this.setState({materialList: res.data});
      materialCollection.drop();
      res.data.map(item => {
        materialCollection.insert(item);
      })
    }, (error) => {
      console.log(error);
    })
  }

  handleRefresh() {
    return new Promise((resolve, reject) => {
      MaterialService.find({}, (data) => {
        if (data.error) {
          reject();
          return
        }
        this.setState({materialList: data.data});
        materialCollection.drop();
        data.data.map(item => {
          materialCollection.insert(item);
        })
        resolve();
      }, (error) => {
        reject();
      })
    });
  }

  render() {
    const {materialList} = this.state;

    let body = <Refresher onRefresh={this.handleRefresh}>
      <div className="MaterialPage">
        {materialList.map((material, i) => (<Material {...material} key={material.code}/>))}
      </div>
    </Refresher>

    let tools = <div onClick={this.addMaterial}>添加</div>;
    let header = <Header back="" title="食材" tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
