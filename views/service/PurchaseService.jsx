import HttpService from './HttpService.jsx';
import {CONFIG} from '../utils/Config.jsx';

class PurchaseService {
  constructor() {}

  add(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/purchase/add`, params, success, error);
  }

  // 查询采购列表
  find(params, success, error) {
    return HttpService.get(`${CONFIG.apiUrl}/purchase/`, params);
  }

  // 修改采购
  edit(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/purchase/edit`, params, success, error);
  }
  // 删除采购
  delete(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/purchase/delete`, params, success, error);
  }

  // 导出采购列表
  exportExcel(params, success, error) {
    HttpService.downloadFile(`${CONFIG.apiUrl}/purchase/export`, params, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', success, error);
  }

  // 获得采购单
  findOrder(params) {
    return HttpService.get(`${CONFIG.apiUrl}/purchase-order/`, params);
  }
  // 添加采购单
  addOrder(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/purchase-order/add`, params, success, error);
  }
}

const Purchase = new PurchaseService();
export default Purchase;
