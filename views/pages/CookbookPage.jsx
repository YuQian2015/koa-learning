import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';

import CookbookService from '../service/CookbookService.jsx';

const cookbookCollection = new LocalDB('cookbook');
const selectedDietCollection = new LocalDB('selectedDiet');

export default class CookbookPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cookbookList: [],
      pageSize: 10,
      page: 1,
      name: "",
      isSelect: false,
      fromState: ''
    }
    this.addCookbook = this.addCookbook.bind(this);
    this.addDiet = this.addDiet.bind(this);
  }

  componentWillMount() {
    let state = this.props.location.state;
    if (state) {
      this.setState({
        ...state
      });
    }
    if (cookbookCollection.read().length) {
      this.setState({cookbookList: cookbookCollection.read()})
      return
    }
    this.fetchData();
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
      this.setState({cookbookList: res.data});
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

  addDiet() {
    selectedDietCollection.drop();
    const {cookbookList} = this.state;
    for (let cookbook of cookbookList) {
      if (cookbook.selected) {
        console.log(cookbook);
        selectedDietCollection.insert({materials: cookbook.materials, name: cookbook.name, _id: cookbook._id});
      }
    }
    this.props.history.goBack();
  }
  render() {
    let {cookbookList, isSelect, fromState} = this.state;
    let body = <div className="CookbookPage">
      {
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
    </div>;
    let tools = isSelect
      ? <div onClick={this.addDiet}>确定</div>
      : <div onClick={this.addCookbook}>添加菜名</div>;
    let header = <Header back="" title={isSelect
        ? "选择菜品"
        : "菜谱管理"} tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
