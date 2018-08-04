import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';
import CookbookService from '../service/CookbookService.jsx';
import {toast} from 'react-toastify';
const materialSelectCollection = new LocalDB('materialSelect');

export default class AddCookbookPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      materialList: [],
      dishName: ""
    }
    this.selectMaterial = this.selectMaterial.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveCookbook = this.saveCookbook.bind(this);
  }

  componentWillMount() {
    let list = materialSelectCollection.read();
    if (list.length) {
      this.setState({materialList: list});
    }
  }
  selectMaterial() {
    this.props.history.push({
      pathname: '/select-material',
      search: JSON.stringify({isMultiple: true}),
      // state: item
    });
  }

  saveCookbook() {
    const {materialList, dishName} = this.state;
    if(dishName == "") {
      toast.warn("请先输入菜名！");
      return
    }
    let idArray = [];
    for (let material of materialList) {
      idArray.push(material._id);
    }
    if(idArray.length == 0) {
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
      toast.error("保存失败！", {
        autoClose: 1000
      });
    });

  }

  handleChange() {
    this.setState({"dishName": this.refs.dishName.value});

  }

  render() {
    let {materialList, dishName} = this.state;
    let body = <div className="AddCookbookPage">
      <div className="input-box">
        <input type="text" onChange={this.handleChange} ref="dishName" value={dishName} placeholder="输入菜名"/>
      </div>
      <div className="add" onClick={this.selectMaterial}>选择食材</div>
      <div className="needMaterial">所需食材：</div>
      {
        materialList.map(material => (<div className="material" key={material._id}>
          <div className="code">编号：{material.code}</div>
          <div className="name">{material.name}</div>
          <div className="price">{material.price}/{material.unit}</div>
        </div>))
      }
    </div>;
    let tools = <div onClick={this.saveCookbook}>保存</div>;
    let header = <Header back="" title="菜谱管理" tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
