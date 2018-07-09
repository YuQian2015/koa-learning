import HttpService from './HttpService.jsx';
import {CONFIG} from '../utils/Config.jsx';

class PurchaseService {
  constructor() {}

  add(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/purchase/add`, params, success, error);
  }

  // 查询采购列表
  find(params, success, error) {
    HttpService.get(`${CONFIG.apiUrl}/purchase/`, params, success, error);
  }


  // 修改采购
  edit(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/purchase/edit`, params, success, error);
  }

  // 导出采购列表
  exportExcel(params, success, error) {
    HttpService.download(`${CONFIG.apiUrl}/purchase/export`, params, success, error);
  }

  // 获得采购单
  findOrder(params, success, error) {
    HttpService.get(`${CONFIG.apiUrl}/purchase-order/`, params, success, error);
  }
  // 添加采购单
  addOrder(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/purchase-order/add`, params, success, error);
  }
}

const Purchase = new PurchaseService();
export default Purchase;
