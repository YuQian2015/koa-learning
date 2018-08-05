import HttpService from './HttpService.jsx';
import {CONFIG} from '../utils/Config.jsx';

class CookbookService {
  constructor() {}

  add(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/cookbook/add`, params, success, error);
  }

  find(params) {
    return HttpService.get(`${CONFIG.apiUrl}/cookbook`, params);
  }

}

const Cookbook = new CookbookService();
export default Cookbook;
