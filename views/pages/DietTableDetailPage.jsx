import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';
import Moment from 'react-moment';

import DietTableService from '../service/DietTableService.jsx';

import LocalDB from 'local-db';
const selectedDietTableCollection = new LocalDB('selectedDietTable');
const selectedDietCollection = new LocalDB('selectedDiet');

import Swipeout from 'rc-swipeout';
import 'rc-swipeout/assets/index.css';

export default class DietTablePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dietTable: {},
      detailList: [],
      pageSize: 10
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
    this.fetchData({dietTableId: urlData.id, pageSize: this.state.pageSize});
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
  addDiet(isNew, id) {
    console.log(isNew);
    if (isNew) {
      const {dietTable} = this.state;
      selectedDietTableCollection.drop();
      selectedDietCollection.drop();
      selectedDietTableCollection.insert({dietTableId: dietTable.id, name: dietTable.name});

      if (id) {
        DietTableService.getDailyDiet(id).then(res => {
          if (!res.error && res.data) {
            console.log(res);
            this.props.history.push({
              pathname: '/add-diet',
              search: JSON.stringify({dietId: id}),
              state: res.data
            });
          }
        }).catch(err => {
          console.log(err);
          this.props.history.push({
            pathname: '/add-diet',
            // search: JSON.stringify({dietId: id}),
            // state: item
          });
        })
      }
      return
    }
    DietTableService.exportExcel({
      id: id,
      fileName: this.state.dietTable.name
    }, (res) => {
      console.log(res);
    }, (error) => {
      console.log(error);
    })
  }
  render() {
    let {dietTable, detailList} = this.state;
    let body = <div className="DietTableDetailPage">

      <div className="hint">每日公示，点击查看详情，左滑可以导出</div>

      <div className="list-box">
        {
          detailList.map(detail => <Swipeout key={detail._id} right={[{
                text: '导出excel',
                onPress: () => this.addDiet(false, detail._id),
                className: 'custom-class-1'
              }
            ]} onOpen={() => console.log('open')} onClose={() => console.log('close')}>
            <div className="list-item" onClick={() => {
                this.addDiet(true, detail._id)
              }}>
              <div className="list-item-header">
                <Moment format="YYYY-MM-DD  HH:mm">{detail.date}</Moment>
              </div>
              <div className="list-item-body"></div>
            </div>
          </Swipeout>)
        }
      </div>
    </div>
    let tools = <div onClick={() => this.addDiet(true)}>新增</div>;
    let header = <Header back="" title={dietTable.name
        ? dietTable.name
        : "公示表详情"} tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
