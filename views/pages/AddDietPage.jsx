import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';

const selectedDietCollection = new LocalDB('selectedDiet');

import _ from 'lodash';

export default class AddDietPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDiet: []
    }
    this.saveDiet = this.saveDiet.bind(this);
    this.addDiet = this.addDiet.bind(this);
  }

  componentWillMount() {
    if (selectedDietCollection.read().length) {
      this.setState({selectedDiet: selectedDietCollection.read()})
      return
    }
  }
  saveDiet() {
    this.props.history.push("/add-material");
  }

  addDiet() {
    this.props.history.push({
      pathname: '/cookbook',
      state: {
        isSelect: true,
        fromState: '/add-diet'
      }
    });
  }

  render() {
    const {selectedDiet} = this.state;
    let materials = [];
    for (let diet of selectedDiet) {
      materials = materials.concat(diet.materials)
    }
    materials = _.uniqBy(materials, '_id');

    let body = <div className="AddDietPage">
      <div>今天要吃的菜</div>
      {selectedDiet.map(item => <div key={item._id}>{item.name}</div>)}
      <button className="block" onClick={this.addDiet}>
        点击添加菜品
      </button>
      <div>所需材料</div>
      {materials.map(material => <div key={material._id}>{material.name}</div>)}
    </div>;
    let tools = <div onClick={this.saveDiet}>保存</div>;
    let header = <Header back="" title="今日配菜" tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
