import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';
import Refresher from '../components/Refresher.jsx';

import MaterialService from '../service/MaterialService.jsx';

import LocalDB from 'local-db';
const materialCollection = new LocalDB('material');
const materialSelectCollection = new LocalDB('materialSelect');

export default class SelectMaterialPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      materialList: [],
      icons: [
        "hd-meat",
        "hd-vegetables",
        "hd-grains",
        "hd-dressing",
        "hd-drinks",
        "hd-snacks"
      ],
      tags: [
        '肉禽蛋',
        '果蔬菌',
        '五谷粮油',
        '调料',
        '饮料',
        '其它'
      ]
    };
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleChose = this.handleChose.bind(this);
    this.handleClick = this.handleClick.bind(this);

  }
  componentWillMount() {
    if (materialCollection.read().length) {
      console.log(materialCollection.read());
      this.setState({materialList: materialCollection.read()});
      return
    }
    this.fetchData();
  }

  fetchData() {
    MaterialService.find({
      pageSize: 10
    }, (res) => {
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
      MaterialService.find({
        pageSize: 10
      }, (data) => {
        if (data.error) {
          reject();
          return
        }
        this.setState({materialList: data.data});
        materialCollection.drop();
        data.data.map(item => {
          materialCollection.insert(item);
        });
        resolve();
      }, (error) => {
        reject();
      })
    });
  }
  handleChose(index) {
    let {materialList} = this.state;
    materialList[index].select = !materialList[index].select;
    this.setState({
        materialList
    })
  }

  handleClick() {
    let {materialList} = this.state;
      materialList.map(item => {
        if(item.select) {
          console.log(item);
          materialSelectCollection.insert({
              name: item.name,
              price: item.price,
              unit: item.unit,
              code: item.code,
              type: item.type,
              _id: item._id
          });
        }
      });
      this.props.history.goBack();
  }

  render() {
    const {materialList, icons, tags} = this.state;
    let body = <Refresher onRefresh={this.handleRefresh}>
      <div>
        {tags.map((item, i) => <div className="tag" key={i}>{item}</div>)}
      </div>
      <div className="SelectMaterialPage">
        {
          materialList.map((material, i) => (<div className="material" key={i}>
            <div className="icon">
              <i className={icons[material.type - 1]}></i>
            </div>
            <div className="name">{material.name}</div>
            <div className="price">{material.price}元/{material.unit}</div>
            <div className="select" onClick={() => this.handleChose(i)}>{material.select?<i className="hd-minus-fill"></i>:<i className="hd-plus"></i>}</div>
          </div>))
        }
      </div>
    </Refresher>;
    let tools = <div onClick={this.handleClick}>确定</div>;
    let header = <Header back="" title="选择食材" tools={tools} />;
    return <PageContainer body={body} header={header}/>
  }
}
