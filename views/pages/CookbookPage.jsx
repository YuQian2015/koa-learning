import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';

import CookbookService from '../service/CookbookService.jsx';

const cookbookCollection = new LocalDB('cookbook');

export default class CookbookPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cookbookList: [],
      pageSize: 10,
      page: 1,
      name: ""
    }
    this.addCookbook = this.addCookbook.bind(this);
  }

  componentWillMount() {
    if (cookbookCollection.read().length) {
      this.setState({cookbookList: cookbookCollection.read()})
      return
    }
    this.fetchData();
  }

  fetchData() {

    let {pageSize, page, name} = this.state;
    let params = {
      pageSize,
      page
    }
    if (name) {
      params.name = name;
    }
    CookbookService.find(params, (res) => {
      if (res.error) {
        console.log(res.msg);
        return
      }
      this.setState({cookbookList: res.data});
      cookbookCollection.drop();
      res.data.map(item => {
        cookbookCollection.insert(item);
      })
    }, (error) => {
      console.log(error);
    })
  }

  addCookbook() {
    this.props.history.push("/add-cookbook");
  }

  render() {
    let {cookbookList} = this.state;
    let body = <div className="CookbookPage">
      {
        cookbookList.map(cookbook => (<div className="cookbook-container" key={cookbook._id}>
          <div className="cookbook">{cookbook.name}</div>
        </div>))
      }
    </div>;
    let tools = <div onClick={this.addCookbook}>添加菜名</div>;
    let header = <Header back="" title="菜谱管理" tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
