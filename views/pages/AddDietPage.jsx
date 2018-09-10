import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';

import InputNumber from 'rc-input-number';
import Moment from 'react-moment';
import DatePicker from 'react-mobile-datepicker';

import LocalDB from 'local-db';
const selectedDietCollection = new LocalDB('selectedDiet');
const selectedDietTableCollection = new LocalDB('selectedDietTable');
const userCollection = new LocalDB('user');

import {toast} from 'react-toastify';

import DietTableService from '../service/DietTableService.jsx';

import _ from 'lodash';

export default class AddDietPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDiet: [], // 选中的菜单
      selectedDietTable: {}, // 选中的公示表
      materials: [], // 计算出来的材料
      cookbook: [], // 计算出来的菜单ID
      user: {}, // 统计员
      date: new Date(),
      totalPrice: 0,
      totalCount: 0, // 总就餐人数
      actualCount: 0, // 实际就餐人数
      averagePrice: 0,
      isOpen: false,
      isView: false
    }
    this.saveDiet = this.saveDiet.bind(this);
    this.addDiet = this.addDiet.bind(this);
    this.selectDietTable = this.selectDietTable.bind(this);
    this.changeAmount = this.changeAmount.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.doCount = this.doCount.bind(this);
    this.changeCount = this.changeCount.bind(this);
    this.open = this.open.bind(this);
    this.changePrice = this.changePrice.bind(this);
    this.changeTotal = this.changeTotal.bind(this);
  }

  componentWillMount() {
    if (selectedDietTableCollection.read().length) {
      this.setState({
        selectedDietTable: selectedDietTableCollection.read()[0]
      })
    }
    let state = this.props.location.state;
    if (state) {
      console.log(state);
      this.setState({isView: true})
      for (let cookbook of state.cookbook) {
        selectedDietCollection.insert({materials: cookbook.materials, name: cookbook.name, _id: cookbook._id, selected: true});
      }
      this.setState({
        materials: state.materials,
        user: state.creator,
        date: new Date(state.date),
        totalPrice: state.totalPrice,
        totalCount: state.totalCount, // 总就餐人数
        actualCount: state.actualCount, // 实际就餐人数
        averagePrice: state.averagePrice
      }, () => {
        this.getCookbookId();
      });
      return
    }
    if (selectedDietCollection.read().length) {
      this.setState({
        selectedDiet: selectedDietCollection.read()
      }, () => {
        this.getMaterials();
        this.getCookbookId();
      })
    }
    if (userCollection.read().length) {
      this.setState({
        user: userCollection.read()[0]
      })
    }
  }
  saveDiet() {

    let {
      selectedDietTable,
      materials,
      date,
      cookbook,
      totalCount,
      actualCount,
      totalPrice,
      averagePrice
    } = this.state;
    let params = {
      ...selectedDietTable,
      materials,
      date,
      cookbook,
      totalCount,
      actualCount,
      totalPrice,
      averagePrice
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
    if (this.state.isView) {
      toast('开发中');
      return
    }
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
    this.setState({
      materials
    }, () => {
      this.doCount();
    })
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
    if (material.quantity) {
      material.totalPrice = number * material.quantity;
    }
    this.setState({
      materials
    }, () => {
      this.doCount();
    })
  }
  changeAmount(material, number) {
    let {materials} = this.state;
    material.totalPrice = number * material.price;
    material.quantity = number;
    this.setState({
      materials
    }, () => {
      this.doCount();
    });
  }
  changeTotal(material, number) {
    let {materials} = this.state;
    material.totalPrice = number;
    this.setState({
      materials
    }, () => {
      this.doCount();
    });
  }

  deleteDiet(item) {
    let {selectedDiet} = this.state;
    _.remove(selectedDiet, diet => item.id === diet.id);
    selectedDietCollection.delete({id: item.id});
    this.setState({
      selectedDiet
    }, () => {
      this.getMaterials();
    })
  }
  deleteMaterial(material) {
    console.log(material);
    let {materials} = this.state;
    _.remove(materials, item => item._id === material._id);
    this.setState({
      materials
    }, () => {
      this.doCount();
    })
  }

  handleNameChange() {
    let {user} = this.state;
    user.name = this.refs.name.value;
    this.setState({user})
  }

  changeCount(number, type) {
    this.setState({
      [type]: number
    }, () => {
      this.doCount();
    });
  }
  doCount() {
    let {materials} = this.state;
    let totalPrice = 0;
    _.forEach(materials, item => {
      totalPrice += item.totalPrice
        ? item.totalPrice
        : 0
    });
    const averagePrice = this.state.totalCount
      ? (totalPrice / this.state.totalCount).toFixed(2)
      : 0;
    this.setState({averagePrice, totalPrice});
  }

  handleSelect(date) {
    this.setState({date, isOpen: false});
  }
  handleCancel() {
    this.setState({isOpen: false});
  }
  open() {
    if (this.state.isView) {
      return
    }
    this.setState({isOpen: true});
  }
  render() {
    const {
      selectedDiet,
      selectedDietTable,
      materials,
      date,
      user,
      totalPrice,
      totalCount,
      actualCount,
      averagePrice,
      isView
    } = this.state;

    let body = <div className="AddDietPage">
      <DatePicker theme="ios" value={this.state.date} isOpen={this.state.isOpen} onSelect={this.handleSelect} onCancel={this.handleCancel}/>
      <div className="hint">统计员和统计时间设置</div>
      <div className="list-box">
        <div className="list-item">
          <div className="list-item-header">
            <input type="text" readOnly="readOnly" disabled={isView} onChange={this.handleNameChange} ref="name" value={user.name}/>
          </div>
          <div className="list-item-body">
            <Moment onClick={this.open} format="YYYY-MM-DD">{date}</Moment>
          </div>
          {
            isView
              ? null
              : <div className="list-item-footer">
                  <i className="hd-enter"></i>
                </div>
          }
        </div>
      </div>
      <div className="hint">选择所属的公示表</div>
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
          {
            isView
              ? null
              : <div className="list-item-footer">
                  <i className="hd-enter"></i>
                </div>
          }
        </div>
      </div>
      {
        selectedDiet.length
          ? <div className="hint">
              食谱公式
            </div>
          : null
      }
      <div className="food">
        {
          selectedDiet.map(item => <div className="item" key={item._id}>{item.name}
            {
              !isView
                ? null
                : <i onClick={() => this.deleteDiet(item)} className="delete-diet hd-close"></i>
            }

          </div>)
        }
      </div>
      {
        selectedDiet.length
          ? <div className="hint">
              配餐公示 合计：{totalPrice}
              元
            </div>
          : null
      }
      <div className="list-box">
        {
          materials.map(material => <div className="list-item" key={material._id}>
            <div className="list-item-heade">{material.name}</div>
            <div className="list-item-body">单价{
                isView
                  ? material.price
                  : <InputNumber style={{
                        width: 60
                      }} min={0} onChange={number => {
                        this.changePrice(material, number)
                      }} value={material.price} placeholder="单价"/>
              }元&nbsp;&nbsp;&nbsp;&nbsp;{
                isView
                  ? material.quantity
                  : <InputNumber style={{
                        width: 60
                      }} min={0} onChange={number => {
                        this.changeAmount(material, number)
                      }} value={material.quantity} placeholder="数量"/>
              }{material.unit}&nbsp;&nbsp;共{
                isView
                  ? material.totalPrice
                  : <InputNumber style={{
                        width: 60
                      }} min={0} onChange={number => {
                        this.changeTotal(material, number)
                      }} value={material.totalPrice} placeholder="总价"/>
              }</div>
            <div className="list-item-footer">
              {
                isView
                  ? null
                  : <i onClick={() => this.deleteMaterial(material)} className="delete-material hd-close"></i>
              }

            </div>
          </div>)
        }
      </div>
      <div className="hint">就餐人数</div>
      <div className="count">
        实际就餐人数&nbsp;&nbsp;{
          isView
            ? actualCount
            : <InputNumber style={{
                  width: 60
                }} min={0} onChange={number => {
                  this.changeCount(number, 'actualCount')
                }} value={actualCount} placeholder="实际就餐人数"/>
        }&nbsp;&nbsp;&nbsp;&nbsp; 应就餐人数&nbsp;&nbsp;{
          isView
            ? totalCount
            : <InputNumber style={{
                  width: 60
                }} min={0} onChange={number => {
                  this.changeCount(number, 'totalCount')
                }} value={totalCount} placeholder="应就餐人数"/>
        }&nbsp;&nbsp;&nbsp;&nbsp; 人均 {averagePrice}
        元
      </div>
      {
        isView
          ? null
          : <div className="submit-btn">
              <button className="block" onClick={this.saveDiet}>
                保存
              </button>
            </div>
      }
    </div>;
    let tools = <div onClick={this.addDiet}>{
        isView
          ? '编辑'
          : '选菜'
      }</div>
    let header = <Header back="" title="今日配菜" tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
