import HttpService from './HttpService.jsx';
import {CONFIG} from '../utils/Config.jsx';

class MaterialService {
  constructor() {}

  add(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/material/add`, params, success, error);
  }

  find(params, success, error) {
    return HttpService.get(`${CONFIG.apiUrl}/material`, params);
  }

  search(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/material/search`, params, success, error);
  }
}

const Material = new MaterialService();
export default Material;
