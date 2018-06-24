import HttpService from './HttpService.jsx';
import {CONFIG} from '../utils/Config.jsx';

class PurchaseService {
  constructor() {}

  add(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/purchase/add`, params, success, error);
  }
}

const Purchase = new PurchaseService();
export default Purchase;
