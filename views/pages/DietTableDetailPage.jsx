import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';
import Moment from 'react-moment';

import DietTableService from '../service/DietTableService.jsx';

export default class DietTablePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dietTable: {},
      detailList: []
    }
    this.addDiet = this.addDiet.bind(this);
  }

  componentWillMount() {
    let urlData;
    if (this.props.location.search) {
      let search = decodeURI(this.props.location.search);
      urlData = JSON.parse(search.split("?")[1]);
      console.log(urlData);
      this.setState({dietTable: urlData})
    }
    this.fetchData({dietTableId: urlData.id});
  }
  fetchData(params) {
    console.log(params);
    return DietTableService.findDailyDiet(params).then(res => {
      if (res.error) {
        console.log(res.msg);
        return
      }
      this.setState({detailList: res.data})
      console.log(res);
    }).catch(error => {
      console.log(error);
    })
  }
  addDiet() {
    this.props.history.push("/add-diet");
  }
  render() {
    let {dietTable, detailList} = this.state;
    let body = <div className="DietTableDetailPage">
      <div className="list-box">
        {
          detailList.map(detail => <div className="list-item" key={detail._id} onClick={this.addDiet}>
            <div className="list-item-header">
              <Moment format="YYYY-MM-DD  HH:mm">{detail.date}</Moment>
            </div>
            <div className="list-item-body"></div>
          </div>)
        }
      </div>
    </div>
    let tools = <div>确定</div>;
    let header = <Header back="" title={dietTable.name
        ? dietTable.name
        : "公示表详情"} tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
