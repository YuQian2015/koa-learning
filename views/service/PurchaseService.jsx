import HttpService from './HttpService.jsx';
import {CONFIG} from '../utils/Config.jsx';

class PurchaseService {
  constructor() {}

  add(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/purchase/add`, params, success, error);
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
