import React from 'react';

import PageContainer from '../container/PageContainer.jsx';
import Header from '../components/Header.jsx';
import Toast from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';
import Refresher from '../components/Refresher.jsx';
import PurchaseCard from '../components/PurchaseCard.jsx';
import Moment from 'react-moment';

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
      purchaseOrderId: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.savePurchase = this.savePurchase.bind(this);
    this.addPurchase = this.addPurchase.bind(this);
    this.hideToast = this.hideToast.bind(this);
    this.showPurchaseDetail = this.showPurchaseDetail.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.selectMaterial = this.selectMaterial.bind(this);
    this.exportExcel = this.exportExcel.bind(this);
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
        "purchaserName": "采购人",
        "inspectorName": "收验货人",
        "supplierName": "供货人",
        "sign": "",
        "purchaseOrderId": urlData.id
      }

      this.showPurchaseDetail(dataList)
    }
    this.fetchData({purchaseOrderId: urlData.id});
  }

  fetchData(params = {}) {
    PurchaseService.find(params, (res) => {
      if (res.error) {
        console.log(res.msg);
        return
      }
      this.setState({purchaseList: res.data});
      materialListCollection.drop();
      res.data.map(item => {
        materialListCollection.insert(item);
      })
    }, (error) => {
      console.log(error);
    })
  }

  handleRefresh(params = {}) {
    return new Promise((resolve, reject) => {
      PurchaseService.find(params, (res) => {
        if (res.error) {
          console.log(res.msg);
          reject();
          return
        }
        this.setState({purchaseList: res.data});
        materialListCollection.drop();
        res.data.map(item => {
          materialListCollection.insert(item);
        })
        resolve();
      }, (error) => {
        console.log(error);
        reject();
      })
    });
  }

  exportExcel() {
    let {purchaseOrder} = this.state;
    PurchaseService.exportExcel(
      {purchaseOrderId: purchaseOrder.id, fileName:purchaseOrder.name}
    );
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

  hideToast() {
    this.setState({purchaseDetail: null})
    // this.props.history.goBack();
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
  savePurchase() {

    let {purchaseDetail} = this.state;
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
              contentText: "保存成功",
              purchaseDetail: null
            }, () => {
              this.refs.toast.show();
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
              contentText: "保存成功",
              purchaseDetail: null
            }, () => {
              this.refs.toast.show();
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
  render() {
    let {purchaseOrder, contentText, purchaseList, title, purchaseDetail} = this.state;
    let content = <PurchaseCard data={purchaseDetail} onChange={this.handleChange}/>
    const button = {
      text: "保存",
      callback: this.savePurchase
    }
    let body = <Refresher onRefresh={() => this.handleRefresh({purchaseOrderId: purchaseOrder.id})}>

      <div className="AddPurchasePage">
        <div className="export-excel" onClick={this.exportExcel}>导出</div>
        <Toast ref="toast" icon="hd-success-fill" contentText={contentText} onHide={this.hideToast}/>
        <Modal ref="modal" content={content} title={title} button={button}/> {
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
    </Refresher>;
    let tools = purchaseDetail && purchaseDetail.code
      ? <div onClick={this.savePurchase}>保存</div>
      : <div onClick={this.addPurchase}>新增</div>;
    let header = <Header back="" title={purchaseOrder.name
        ? purchaseOrder.name
        : "添加采购项目"} tools={tools}/>
    return <PageContainer body={body} header={header}/>
  }
}
