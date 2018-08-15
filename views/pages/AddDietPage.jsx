import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';

import InputNumber from 'rc-input-number';

import LocalDB from 'local-db';
const selectedDietCollection = new LocalDB('selectedDiet');
const selectedDietTableCollection = new LocalDB('selectedDietTable');

import {toast} from 'react-toastify';

import DietTableService from '../service/DietTableService.jsx';

import _ from 'lodash';

export default class AddDietPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDiet: [],
      selectedDietTable: {},
      materials: [],
      cookbook: []
    }
    this.saveDiet = this.saveDiet.bind(this);
    this.addDiet = this.addDiet.bind(this);
    this.selectDietTable = this.selectDietTable.bind(this);
    this.changeAmount = this.changeAmount.bind(this);
    this.changePrice = this.changePrice.bind(this);
  }

  componentWillMount() {
    if (selectedDietCollection.read().length) {
      this.setState({
        selectedDiet: selectedDietCollection.read()
      }, () => {
        this.getMaterials();
        this.getCookbookId();
      })
    }
    if (selectedDietTableCollection.read().length) {
      this.setState({
        selectedDietTable: selectedDietTableCollection.read()[0]
      })
    }
  }
  saveDiet() {
    let {selectedDietTable, materials, cookbook} = this.state;
    let params = {
      ...selectedDietTable,
      materials,
      cookbook,
      date: new Date()
    }
    console.log(params);
    DietTableService.addDailyDiet(params, (res) => {
      if (res.error) {
        console.log(res.msg);
        return
      }
      console.log(res);
      selectedDietCollection.drop();
      selectedDietTableCollection.drop();
      toast.success('保存成功', {
        onClose: () => this.props.history.goBack(),
        autoClose: 1000
      });
    }, (error) => {
      console.log(error);
    })
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

  getMaterials() {
    const {selectedDiet} = this.state;
    let materials = [];
    for (let diet of selectedDiet) {
      materials = materials.concat(diet.materials)
    }
    materials = _.uniqBy(materials, '_id');
    this.setState({materials})
  }
  getCookbookId() {
    const {selectedDiet} = this.state;
    let cookbook = [];
    for (let diet of selectedDiet) {
      cookbook.push(diet._id);
    }
    this.setState({cookbook})
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

  changePrice(material, number) {
    let {materials} = this.state;
    material.price = number;
    this.setState({materials})
  }
  changeAmount(material, number) {
    let {materials} = this.state;
    material.quantity = number;
    this.setState({materials})
  }

  render() {
    const {selectedDiet, selectedDietTable, materials} = this.state;
    console.log(selectedDiet);
    console.log(materials);
    console.log(selectedDietTable);

    let body = <div className="AddDietPage">
      <div className="hint">今天要吃的菜</div>
      <div className="list-box" onClick={this.selectDietTable}>
        <div className="list-item">
          <div className="list-item-header">
            选择公示表
          </div>
          <div className="list-item-body">{
              selectedDietTable
                ? selectedDietTable.name
                : '请选择'
            }</div>
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
        {selectedDiet.map(item => <div className="item" key={item._id}>{item.name}</div>)}
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
            <div className="list-item-body">单价<InputNumber style={{
              width: 60
            }} min={0} onChange={number => {
              this.changePrice(material, number)
            }} value={material.price} placeholder="单价"/>元&nbsp;&nbsp;&nbsp;&nbsp; <InputNumber style={{
              width: 60
            }} min={0} onChange={number => {
              this.changeAmount(material, number)
            }} value={material.quantity} placeholder="数量"/>{material.unit}&nbsp;&nbsp;</div>
            <div className="list-item-footer"></div>
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
