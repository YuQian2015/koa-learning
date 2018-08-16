import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';
import Refresher from '../components/Refresher.jsx';

import DietTableService from '../service/DietTableService.jsx';

import LocalDB from 'local-db';
const dietTableCollection = new LocalDB('dietTable');
const selectedDietTableCollection = new LocalDB('selectedDietTable');

export default class DietTablePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdd: false,
      inputName: "",
      dietTable: [],
      isSelect: false
    }
    this.handleAdd = this.handleAdd.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addTable = this.addTable.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.toDetail = this.toDetail.bind(this);
  }

  componentWillMount() {
    let state = this.props.location.state;
    if (state) {
      let isSelect = state.isSelect;
      this.setState({isSelect})
    }
    this.fetchData();
  }

  fetchData() {
    return DietTableService.findTable({}).then(res => {
      if (res.error) {
        console.log(res.msg);
        return
      }
      this.setState({dietTable: res.data});
      dietTableCollection.drop();
      res.data.map(item => {
        dietTableCollection.insert(item);
      })
    }).catch(error => {
      console.log(error);
    })
  }

  handleAdd() {
    this.setState({showAdd: true})
  }
  handleClose() {
    this.setState({showAdd: false})
  }
  handleChange(name) {
    this.setState({inputName: this.refs[name].value})
  }
  addTable() {
    const {inputName} = this.state;
    DietTableService.addTable({
      name: inputName
    }, (res) => {
      if (res.error) {
        console.log(res.msg);
        return
      }
      console.log(res);
      let dietTable = this.state.dietTable;
      dietTable.push(res.data);
      this.setState({dietTable, showAdd: false, inputName: ""});
      dietTableCollection.insert(res.data);
    }, (error) => {
      console.log(error);
    })
  }

  toDetail(item) {
    const {isSelect} = this.state;
    if(isSelect) {
      selectedDietTableCollection.drop();
      selectedDietTableCollection.insert({dietTableId: item._id, name: item.name});
      this.props.history.goBack();
      return
    }
    this.props.history.push({
      pathname: '/diet-table-detail',
      search: JSON.stringify({id: item._id, name: item.name}),
      state: item
    });
  }
  render() {
    const {dietTable, showAdd, inputName, isSelect} = this.state;
    let body = <Refresher onRefresh={this.fetchData}>
      <div className="DietTablePage">
        {
          showAdd
            ? <div className="add-cookbook-input">
                <input type="text" value={inputName} ref="inputName" onChange={() => this.handleChange("inputName")} placeholder="输入公示表名称"/>
                <div className="close" onClick={this.handleClose}>
                  <i className="hd-fail-fill"></i>
                </div>
                <button className="block" onClick={this.addTable}>确定</button>
              </div>
            : <div className="add-cookbook" onClick={this.handleAdd}>添加公示表</div>
        }
        <div className="list-box">
          {
            dietTable.map((item, i) => <div className="list-item" onClick={() => this.toDetail(item)} key={i}>
              <div className="list-item-header">
                {item.name}
              </div>
              <div className="list-item-body">
                {
                  item.creator && !isSelect
                    ? item.creator.name
                    : ""
                }</div>
              <div className="list-item-footer">
                {
                  isSelect
                    ? <i className="hd-radio"></i>
                    : <i className="hd-enter"></i>
                }
              </div>
            </div>)
          }
        </div>
      </div>
    </Refresher>;
    let tools = <div onClick={this.addDiet}>确定</div>;
    let header = <Header back="" title={isSelect
        ? "选择公示表"
        : "查看公示表"} tools={isSelect
        ? tools
        : null}/>
    return <PageContainer body={body} header={header}/>
  }
}
