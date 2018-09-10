import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';

import MaterialService from '../service/MaterialService.jsx';
import {toast} from 'react-toastify';

import LocalDB from 'local-db';
const materialCollection = new LocalDB('material');

export default class AddMaterialPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      material: {
        name: "",
        unit: "斤",
        price: "5",
        type: 1
      },
      tags: [
        '粮食类',
        '油肉类',
        '蔬菜类',
        '调料类',
        '其它'
      ]
    }
    this.saveMaterial = this.saveMaterial.bind(this);
  }
  saveMaterial() {
    let material = this.state.material;
    MaterialService.add(material, (data) => {
      if (data.error) {
        toast.error(data.msg);
        return
      }
      toast.success("保存成功！", {
        onClose: () => this.props.history.goBack(),
        autoClose: 2000
      });
      materialCollection.insert(data.data);
    }, (error) => {
      toast.error("保存出错");
      console.log(error);
    })
  }

  handleChange(type) {
    let material = this.state.material;
    material[type] = this.refs[type].value;
    this.setState({material});
  }
  changeTag(type) {
    let material = this.state.material;
    material.type = type + 1;
    this.setState({material});
  }

  render() {
    const {tags, material} = this.state;
    let body = <div className="AddMaterialPage">

      <div className="list-box">
        <div className="list-item">
          <div className="list-item-header">材料名称</div>
          <input className="list-item-body" type="text" onChange={() => this.handleChange("name")} ref="name" value={material.name} placeholder="请输入名称"/>
          <div className="list-item-footer">
            <i className="hd-enter"></i>
          </div>
        </div>
        <div className="list-item">
          <div className="list-item-header">单位</div>
          <input className="list-item-body" type="text" onChange={() => this.handleChange("unit")} ref="unit" value={material.unit} placeholder="请输入单位"/>
          <div className="list-item-footer">
            <i className="hd-enter"></i>
          </div>
        </div>
        <div className="list-item">
          <div className="list-item-header">单价</div>
          <input className="list-item-body" type="text" onChange={() => this.handleChange("price")} ref="price" value={material.price} placeholder="元"/>
          <div className="list-item-footer">
            <i className="hd-enter"></i>
          </div>
        </div>
        <div className="list-item">
          <div className="list-item-header">食品类型</div>
          <div className="list-item-body">
            {
              tags.map((item, i) => (<div key={i} onClick={() => {
                  this.changeTag(i)
                }} className={i + 1 == material.type
                  ? "tag active"
                  : "tag"}>{item}</div>))
            }
          </div>
        </div>
      </div>

    </div>;
    let tools = <div onClick={this.saveMaterial}>保存</div>;
    let header = <Header back="" title="添加食材" tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
