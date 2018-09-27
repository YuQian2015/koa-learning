import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';
import Modal from '../components/Modal.jsx';
import Refresher from '../components/Refresher.jsx';
import PurchaseCard from '../components/PurchaseCard.jsx';
import Moment from 'react-moment';

import {toast} from 'react-toastify';

import DatePicker from 'react-mobile-datepicker';

import ImageCompressor from 'image-compressor.js';
const imageCompressor = new ImageCompressor();
import {file} from '../utils/File.jsx';

import PurchaseService from '../service/PurchaseService.jsx';

import LocalDB from 'local-db';
const materialSelectCollection = new LocalDB('materialSelect');
const userCollection = new LocalDB('user');
const materialListCollection = new LocalDB('materialList');

export default class AddPurchasePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      purchaseOrder: {
        id: "",
        name: ""
      },
      purchaseList: [],
      purchaseDetail: {},
      purchaseOrderId: "",
      isOpen: false,
      time: new Date(),
      fromDate: new Date(),
      toDate: new Date(),
      dateType: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.savePurchase = this.savePurchase.bind(this);
    this.addPurchase = this.addPurchase.bind(this);
    this.showPurchaseDetail = this.showPurchaseDetail.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.selectMaterial = this.selectMaterial.bind(this);
    this.exportExcel = this.exportExcel.bind(this);
    this.showExportFunc = this.showExportFunc.bind(this);
    this.deletePurchase = this.deletePurchase.bind(this);
    this.openTimeSelect = this.openTimeSelect.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillMount() {
    console.log(this.props.location.state);
    let urlData;
    if (this.props.location.search) {
      let search = decodeURI(this.props.location.search);
      urlData = JSON.parse(search.split("?")[1]);
      this.setState({purchaseOrder: urlData})
    }
    let selectMaterial = materialSelectCollection.read();
    let user = userCollection.read()[0];
    console.log(user);
    if (selectMaterial.length) {
      console.log(selectMaterial);
      const item = selectMaterial[0];
      let dataList = {
        "code": item.code,
        "purchasingDate": new Date(),
        "name": item.name,
        "manufactureDate": undefined,
        "qualityPeriod": undefined,
        "quantity": 1,
        "unit": item.unit,
        "price": item.price,
        "totalPrice": item.price,
        "purchaserName": user?user.name:'',
        "inspectorName": "",
        "supplierName": "",
        "sign": "",
        "purchaseOrderId": urlData.id
      }

      this.showPurchaseDetail(dataList)
    }
    this.fetchData({purchaseOrderId: urlData.id});
  }

  fetchData(params = {}) {
    return PurchaseService.find(params).then(res => {
      if (res.error) {
        console.log(res.msg);
        return
      }
      this.setState({purchaseList: res.data});
      materialListCollection.drop();
      res.data.map(item => {
        materialListCollection.insert(item);
      })
    }).catch(error => {
      console.log(error);
    })
  }


  exportExcel() {
    let {purchaseOrder, fromDate, toDate} = this.state;
    PurchaseService.exportExcel({purchaseOrderId: purchaseOrder.id, fileName: purchaseOrder.name, fromDate, toDate});
  }
  showExportFunc() {
    this.setState({
      showExport: !this.state.showExport
    })
  }

  handleChange() {
    console.log("change");
  }

  handleChangeDetail() {
    console.log("change");
  }

  addPurchase() {
    this.props.history.push("/select-material");
  }

  showPurchaseDetail(item) {
    console.log(item);
    this.setState({
      title: "采购详情",
      purchaseDetail: item
    }, () => {
      this.refs.modal.show();
    })
  }

  selectMaterial() {
    this.props.history.push("/select-material");
  }

  deletePurchase(id) {
    PurchaseService.delete({
      id: id
    }, (res) => {
      if (res.error) {
        console.log(res.msg);
        return
      }
      let {purchaseList} = this.state;
      for (let i in purchaseList) {
        if (purchaseList[i]._id == id) {
          purchaseList.splice(i, 1)
        }
      }
      this.setState({purchaseList});
      toast.success("删除成功");
      this.refs.modal.hide();
    }, (error) => {
      console.log(error);
    })
  }
  savePurchase() {

    let {purchaseDetail} = this.state;
    if (!purchaseDetail.supplierName) {
      toast("输入供货人。");
      return
    }

    let blob = file.dataURLtoBlob(purchaseDetail.sign)
    console.log(blob);
    imageCompressor.compress(blob, {
      quality: 0,
      maxWidth: 180
    }).then(result => {
      file.blobToDataURL(result).then(image => {
        console.log(image);
        purchaseDetail.sign = image;

        console.log(purchaseDetail);

        if (purchaseDetail._id) {

          purchaseDetail.id = purchaseDetail._id;
          PurchaseService.edit(purchaseDetail, (res) => {
            if (res.error) {
              alert(res.msg)
              return
            }
            materialSelectCollection.drop();
            this.setState({
              purchaseDetail: null
            }, () => {
              toast.info("保存采购信息成功,你也可以对采购信息进行修改！");
              this.refs.modal.hide();
            });
          }, (error) => {
            console.log(error);
          })
        } else {

          PurchaseService.add(purchaseDetail, (res) => {
            if (res.error) {
              alert(res.msg)
              return
            }
            materialSelectCollection.drop();
            this.setState({
              purchaseDetail: null
            }, () => {
              toast.info("保存采购信息成功！");
              this.refs.modal.hide();
            });
          }, (error) => {
            console.log(error);
          })
        }
      }).catch(e => {
        console.log(e);
      });
      console.log(result);
    }).catch(e => {
      alert(e.message)
    });
  }

  // 选择时间

  handleSelect(date) {
    const {dateType, fromDate, toDate} = this.state;
    if (dateType == 'fromDate' && toDate && date > toDate || dateType == 'toDate' && fromDate && date < fromDate) {
      toast.error("开始时间不能大于结束时间。");
      return
    }
    this.setState({[dateType]: date, time: date, isOpen: false});
  }

  // 取消选择时间
  handleCancel() {
    this.setState({isOpen: false});
  }

  handleCancelModal() {
    materialSelectCollection.drop();
  }

  openTimeSelect(type) {
    const date = this.state[type];
    this.setState({
      dateType: type,
      time: date
        ? date
        : new Date(),
      isOpen: true
    })
  }
  render() {
    let {
      purchaseOrder,
      purchaseList,
      title,
      purchaseDetail,
      fromDate,
      toDate,
      showExport
    } = this.state;
    let content = <PurchaseCard data={purchaseDetail} onChange={this.handleChange} onDelete={this.deletePurchase}/>
    const button = {
      text: "保存",
      callback: this.savePurchase
    }
    let body = <Refresher onRefresh={() => this.fetchData({purchaseOrderId: purchaseOrder.id})}>

      <div className="AddPurchasePage">
        {
          purchaseList.length
            ? showExport
              ? <div className="export-select">从
                  <div className="time" onClick={() => this.openTimeSelect('fromDate')}>
                    <Moment format="YYYY-MM-DD">{fromDate}</Moment>
                  </div>到
                  <div className="time" onClick={() => this.openTimeSelect('toDate')}>
                    <Moment format="YYYY-MM-DD">{toDate}</Moment>
                  </div>
                  <div className="button cancel" onClick={this.showExportFunc}>取消</div>
                  <div className="button export" onClick={this.exportExcel}>导出</div>
                </div>
              : <div className="export-excel" onClick={this.showExportFunc}>
                  <div className="time">导出excel文档</div>
                  <i className="hd-excel"></i>
                </div>
            : null
        }
        <Modal ref="modal" content={content} title={title} onHide={this.handleCancelModal} button={button}/> {
          purchaseList.map((item, i) => (<div className="purchase" key={i} onClick={() => this.showPurchaseDetail(item)}>
            <div className="date">
              <Moment format="YYYY-MM-DD  HH:mm">{item.purchasingDate}</Moment>
            </div>
            <div className="action">采购</div>
            <div className="name">{item.name}</div>
            <div>{item.quantity}{item.unit}</div>
            <div className="price">共{item.totalPrice}元</div>
          </div>))
        }
      </div>

      <DatePicker theme="ios" value={this.state.time} isOpen={this.state.isOpen} onSelect={this.handleSelect} onCancel={this.handleCancel}/>
    </Refresher>;
    let tools = <div onClick={this.addPurchase}>新增</div>;
    let header = <Header back="" title={purchaseOrder.name
        ? purchaseOrder.name
        : "添加采购项目"} tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
