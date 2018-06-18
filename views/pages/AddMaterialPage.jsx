import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';

import MaterialService from '../service/MaterialService.jsx';
import Toast from '../components/Toast.jsx';

import LocalDB from 'local-db';
const materialCollection = new LocalDB('materialCollection');

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
        '肉禽蛋',
        '果蔬菌',
        '五谷粮油',
        '调料',
        '饮料',
        '其它'
      ],
      contentText:""
    }
    this.saveMaterial = this.saveMaterial.bind(this);
    this.hideToast = this.hideToast.bind(this);
  }
  saveMaterial() {
    let material = this.state.material;
    MaterialService.add(material, (data) => {
      if(data.error) {
        this.setState({
          contentText:data.msg
        },()=>{
          this.refs.toast.show();
        });
        return
      }
        this.setState({
          contentText:"保存成功"
        },()=>{

          materialCollection.insert(data.data);
          this.refs.toast.show();
        });
    }, (error) => {
      console.log(error);
    })
  }
  hideToast() {
    this.props.history.goBack();
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
    const {tags, material, contentText} = this.state;
    let body = <div className="AddMaterialPage">

        <Toast ref="toast" icon="hd-success-fill" contentText={contentText} onHide={this.hideToast}/>

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
