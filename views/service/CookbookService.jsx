import HttpService from './HttpService.jsx';
import {CONFIG} from '../utils/Config.jsx';

class CookbookService {
  constructor() {}

  add(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/cookbook/add`, params, success, error);
  }

  find(params, success, error) {
    HttpService.get(`${CONFIG.apiUrl}/cookbook`, params, success, error);
  }

}

const Cookbook = new CookbookService();
export default Cookbook;
