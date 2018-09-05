import HttpService from './HttpService.jsx';
import {CONFIG} from '../utils/Config.jsx';

class DietTableService {
  constructor() {}

  addDailyDiet(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/daily-diet/add`, params, success, error);
  }

  findDailyDiet(params) {
    return HttpService.get(`${CONFIG.apiUrl}/daily-diet`, params);
  }

  // 导出采购列表
  exportExcel(params, success, error) {
    HttpService.downloadFile(`${CONFIG.apiUrl}/daily-diet/export`, params, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', success, error);
  }

  addTable(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/diet-table/add`, params, success, error);
  }

  findTable(params) {
    return HttpService.get(`${CONFIG.apiUrl}/diet-table`, params);
  }

}

const DietTable = new DietTableService();
export default DietTable;
