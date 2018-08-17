import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';
import CookbookService from '../service/CookbookService.jsx';
import {toast} from 'react-toastify';
const materialSelectCollection = new LocalDB('materialSelect');
const addCookbookCollection = new LocalDB('addCookbook');

import _ from 'lodash';

export default class AddCookbookPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      materialList: [],
      dishName: "",
      types: [
        {
          name: '荤菜',
          type: 1
        }, {
          name: '素菜',
          type: 2
        }, {
          name: '汤',
          type: 3
        }, {
          name: '小吃',
          type: 4
        }, {
          name: '其它',
          type: 5
        }
      ],
      activeCode: 1
    }
    this.selectMaterial = this.selectMaterial.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveCookbook = this.saveCookbook.bind(this);
    this.removeMaterial = this.removeMaterial.bind(this);
  }

  componentWillMount() {
    const list = materialSelectCollection.read();
    const cookbook = addCookbookCollection.read();
    if (list.length) {
      this.setState({materialList: list});
    }
    if (cookbook.length) {
      const {dishName, activeCode} = cookbook[0];
      this.setState({dishName, activeCode});
    }
  }
  selectMaterial() {
    let {dishName, activeCode} = this.state;
    addCookbookCollection.drop();
    addCookbookCollection.insert({dishName, activeCode})
    this.props.history.push({
      pathname: '/select-material',
      search: JSON.stringify({isMultiple: true}),
      // state: item
    });
  }

  saveCookbook() {
    const {materialList, dishName} = this.state;
    if (dishName == "") {
      toast.warn("请先输入菜名！");
      return
    }
    let idArray = [];
    for (let material of materialList) {
      idArray.push(material._id);
    }
    if (idArray.length == 0) {
      toast.warn("选择至少一种食材！");
      return
    }
    let cookbook = {
      "name": dishName,
      "materials": idArray
    }
    CookbookService.add(cookbook, result => {
      console.log(result);
      toast.success("保存成功！", {
        onClose: () => this.props.history.goBack(),
        autoClose: 1000
      });
      materialSelectCollection.drop();
    }, error => {
      console.log(error);
      toast.error("保存失败！", {autoClose: 1000});
    });

  }

  handleChange() {
    this.setState({"dishName": this.refs.dishName.value});
  }

  removeMaterial(material) {
    const {materialList} = this.state;
    materialSelectCollection.delete({code: material.code})
    _.remove(materialList, item => item.code === material.code);
    this.setState({materialList});
  }

  handleType(type) {
    this.setState({activeCode: type})
  }

  render() {
    let {materialList, dishName, types, activeCode} = this.state;
    let body = <div className="AddCookbookPage">
      <div className="input-box dish-name">
        <input type="text" onChange={this.handleChange} ref="dishName" value={dishName} placeholder="输入菜名"/>
      </div>
      <div className="dish-type">
        {
          types.map(item => <div onClick={() => this.handleType(item.type)} className={activeCode == item.type
              ? "active"
              : ""} key={item.type}>{item.name}</div>)
        }
      </div>
      <div className="needMaterial">所需食材：</div>
      <div className="add" onClick={this.selectMaterial}>选择食材</div>
      {
        materialList.map(material => (<div className="material" key={material._id}>
          <div className="code">编号{material.code}：</div>
          <div className="name">{material.name}</div>
          <div className="price">{material.price}/{material.unit}</div>
          <i className="delete-material hd-close" onClick={() => this.removeMaterial(material)}></i>
        </div>))
      }
    </div>;
    let tools = <div onClick={this.saveCookbook}>保存</div>;
    let header = <Header back="" title="菜谱管理" tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
