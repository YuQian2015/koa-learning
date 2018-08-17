import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';

import Refresher from '../components/Refresher.jsx';
import SearchInput from 'react-search-input';

import _ from 'lodash';
import CookbookService from '../service/CookbookService.jsx';

const cookbookCollection = new LocalDB('cookbook');
const selectedDietCollection = new LocalDB('selectedDiet');

export default class CookbookPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cookbookList: [],
      pageSize: 20,
      page: 1,
      name: "",
      isSelect: false,
      fromState: ''
    }
    this.addCookbook = this.addCookbook.bind(this);
    this.addDiet = this.addDiet.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.searchChange = this.searchChange.bind(this);
  }

  componentWillMount() {
    let state = this.props.location.state;
    if (state) {
      this.setState({
        ...state
      });
      if (state.isSelect) {
        let list = _.uniqBy([
          ...selectedDietCollection.read(),
          ...cookbookCollection.read()
        ], '_id');
        console.log(list);
        this.setState({cookbookList: list})
      }
    } else if (cookbookCollection.read().length) {
      this.setState({cookbookList: cookbookCollection.read()})
    } else {
      this.fetchData();
    }
  }

  getQuery() {
    let {pageSize, page, name} = this.state;
    let params = {
      pageSize,
      page
    }
    if (name) {
      params.name = name;
    }
    return params;
  }
  fetchData() {
    return CookbookService.find(this.getQuery()).then(res => {
      if (res.error) {
        console.log(res.msg);
        return
      }
      this.setState({cookbookList: _.uniqBy([
        ...selectedDietCollection.read(),
        ...res.data
      ], '_id')});
      cookbookCollection.drop();
      res.data.map(item => {
        cookbookCollection.insert(item);
      })
    }).catch(error => {
      console.log(error);
    })
  }

  addCookbook() {
    this.props.history.push("/add-cookbook");
  }

  handleClick(cookbook) {
    const {isSelect, fromState, cookbookList} = this.state;
    if (isSelect) {
      cookbook.selected = !cookbook.selected;
    }
    this.setState({cookbookList})
  }

  handleRefresh() {
    return this.fetchData();
  }

  searchChange(keyword) {
    if (!keyword) {
      this.fetchData();
      return
    }
    return CookbookService.search({
      keyword: keyword
    }, (res) => {
      if (res.error) {
        console.log(res.msg);
        return
      }

      this.setState({cookbookList:  _.uniqBy([
        ...selectedDietCollection.read(),
        ...res.data
      ], '_id')});
    }, (error) => {
      console.log(error);
    })
  }

  addDiet() {
    selectedDietCollection.drop();
    const {cookbookList} = this.state;
    for (let cookbook of cookbookList) {
      if (cookbook.selected) {
        console.log(cookbook);
        selectedDietCollection.insert({materials: cookbook.materials, name: cookbook.name, _id: cookbook._id, selected: true});
      }
    }
    this.props.history.goBack();
  }
  render() {
    let {cookbookList, isSelect, fromState} = this.state;
    let body = <Refresher onRefresh={this.handleRefresh}>
      <div className="CookbookPage">
        <SearchInput className="search-box" onChange={this.searchChange} placeholder="输入食谱名称" throttle={400}/> {
          cookbookList.map(cookbook => (<div className="cookbook-container" key={cookbook._id}>
            <div onClick={() => this.handleClick(cookbook)} className={cookbook.selected
                ? "cookbook active"
                : "cookbook"}>{cookbook.name}</div>
            {
              isSelect
                ? cookbook.selected
                  ? <i className="icon hd-minus-fill"></i>
                  : <i className="icon hd-plus"></i>
                : null
            }
          </div>))
        }
      </div>
    </Refresher>;
    let tools = isSelect
      ? <div onClick={this.addDiet}>确定</div>
      : <div onClick={this.addCookbook}>添加菜名</div>;
    let header = <Header back="" title={isSelect
        ? "选择菜品"
        : "菜谱管理"} tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
