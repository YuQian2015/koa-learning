import LocalDB from 'local-db';
const UserTable = new LocalDB('users');
const LoginUserTable = new LocalDB('user');

import HttpService from './HttpService.jsx';
import {CONFIG} from '../utils/Config.jsx';

class UserService {
  constructor() {
    this.register = this.register.bind(this);
  }

  register(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/public/register`, params, success, error);
  }
  signIn(params, success, error) {
    HttpService.post(`${CONFIG.apiUrl}/public/signin`, params, success, error);
  }
}

const User = new UserService();
export default User;
