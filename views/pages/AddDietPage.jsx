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
    this.selectDietTable = this.selectDietTable.bind(this);
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

  selectDietTable() {
    this.props.history.push({
      pathname: '/diet-table',
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
    console.log(selectedDiet);
    console.log(materials);

    let body = <div className="AddDietPage">
      <div className="hint">今天要吃的菜</div>
      <div className="list-box" onClick={this.selectDietTable}>
        <div className="list-item">
          <div className="list-item-header">
            选择公示表
          </div>
          <div className="list-item-body">123123</div>
          <div className="list-item-footer">
            <i className="hd-enter"></i>
          </div>
        </div>
      </div>
      {
        selectedDiet.length
          ? <div className="hint">
              已选择
            </div>
          : null
      }
      <div className="food">
        {
          selectedDiet.map(item => <div className="item" key={item._id}>{item.name}</div>)
        }
      </div>
      {
        selectedDiet.length
          ? <div className="hint">
              所需材料
            </div>
          : null
      }
      <div className="list-box">
        {
          materials.map(material => <div className="list-item" key={material._id}>
            <div className="list-item-heade">{material.name}</div>
            <div className="list-item-body">{material.name}</div>
            <div className="list-item-footer">
            </div>
          </div>)
        }
      </div>
      <button className="block" onClick={this.saveDiet}>
        保存
      </button>
    </div>;
    let tools = <div onClick={this.addDiet}>加菜</div>;
    let header = <Header back="" title="今日配菜" tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
