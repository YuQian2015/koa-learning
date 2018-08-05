import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';
import Material from '../components/Material.jsx';
import Refresher from '../components/Refresher.jsx';

import MaterialService from '../service/MaterialService.jsx';

import SearchInput from 'react-search-input';

import LocalDB from 'local-db';
const materialCollection = new LocalDB('material');

export default class MaterialPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      materialList: [],
      pageSize: 10,
      page: 1,
      tags: [
        '肉禽蛋',
        '果蔬菌',
        '五谷粮油',
        '调料',
        '饮料',
        '其它'
      ]
    }
    this.addMaterial = this.addMaterial.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  addMaterial() {
    this.props.history.push("/add-material");
  }

  componentWillMount() {
    if (materialCollection.read().length) {
      this.setState({materialList: materialCollection.read()})
      return
    }
    this.fetchData();
  }

  fetchData() {
    let {pageSize, page, tagIndex} = this.state;
    let params = {
      pageSize,
      page
    }
    if (this.state.tagIndex) {
      params.type = tagIndex;
    }
    MaterialService.find(params).then(res => {
      debugger;
      if (res.error) {
        console.log(res.msg);
        return
      }
      this.setState({materialList: res.data});
      materialCollection.drop();
      res.data.map(item => {
        materialCollection.insert(item);
      })
    }).catch(error => {
      console.log(error);
    })
  }

  searchChange(keyword) {
    if (!keyword) {
      this.fetchData()
      return
    }
    MaterialService.search({
      keyword: keyword
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
    let {pageSize, page, tagIndex} = this.state;
    page = 1;
    this.setState({page})
    let params = {
      pageSize,
      page
    }
    if (this.state.tagIndex) {
      params.type = tagIndex;
    }
    return MaterialService.find(params).then(res => {
      if (res.error) {
        return
      }
      if (res.data.length < pageSize) {
        this.setState({hasMore: false});
      } else {
        this.setState({hasMore: true});
      }
      this.setState({materialList: res.data});
      materialCollection.drop();
      res.data.map(item => {
        materialCollection.insert(item);
      })
    }).catch(error => {})
  }

  handleLoadMore() {
    let {pageSize, page, materialList, tagIndex} = this.state;
    page++;
    this.setState({page})
    let params = {
      pageSize,
      page
    }
    if (this.state.tagIndex) {
      params.type = tagIndex;
    }

    return MaterialService.find(params).then(res => {
      if (res.error) {
        reject();
        return
      }
      materialList = materialList.concat(res.data);
      if (res.data.length < pageSize) {
        this.setState({hasMore: false});
      } else {
        this.setState({hasMore: true});
      }
      this.setState({materialList});
      res.data.map(item => {
        materialCollection.insert(item);
      })
    }).catch(error => {})
  }

  setTag(idnex) {
    if (idnex + 1 != this.state.tagIndex) {
      this.setState({
        tagIndex: idnex + 1
      }, () => {
        this.fetchData();
      })
    }
  }

  render() {
    const {materialList, hasMore, tags, tagIndex} = this.state;
    let body = <Refresher hasMore={hasMore} onRefresh={this.handleRefresh} onLoadMore={this.handleLoadMore}>
      <div className="MaterialPage">
        <SearchInput className="search-box" onChange={this.searchChange} placeholder="输入食材名称" throttle={400}/>

        <div>
          {
            tags.map((item, i) => <div className={tagIndex - 1 == i
                ? "tag active"
                : "tag"} onClick={() => this.setTag(i)} key={i}>{item}</div>)
          }
        </div>

        {materialList.map((material, i) => (<Material {...material} key={i}/>))}
      </div>
    </Refresher>

    let tools = <div onClick={this.addMaterial}>添加</div>;
    let header = <Header back="" title="食材管理" tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
