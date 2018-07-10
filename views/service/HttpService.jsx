// class HttpService {
//     static query(config) {
//         config = config || {};
//         var params = HttpService.formatParams(config.data);
//
//         var request = new XMLHttpRequest();
//         request.onreadystatechange = function () {
//             if (request.readyState == 4) {
//                 var status = request.status;
//                 if (status >= 200 && status < 300) {
//                     var res = JSON.parse(request.responseText);
//                     config.success && config.success(res);
//                 } else {
//                     return config.fail && config.fail(status);
//                 }
//             }
//         };
//         request.open('GET', config.url + "?" + params, true);
//         request.send(null);
//     }
//
//     static jsonp(config) {
//         config = config || {};
//
//         var params = HttpService.formatParams(config.data);
//         var Scrip=document.createElement('script');
//         Scrip.src = config.url + "?" + params + '&jsoncallback=' + 'HttpService.jsonpCallback';
//         this.callback = config.success;
//
//         document.body.appendChild(Scrip);
//     }
//
//     static jsonpCallback(e) {
//         this.callback(e);
//     }
//
//     static save(config) {
//         config = config || {};
//
//         var params = HttpService.formatParams(config.data);
//         var request = new XMLHttpRequest();
//         request.onreadystatechange = function () {
//             if (request.readyState == 4) {
//                 var status = request.status;
//                 if (status >= 200 && status < 300) {
//                     var res = JSON.parse(request.responseText);
//                     console.log(res);
//                     config.success && config.success(res);
//                 } else {
//                     config.fail && config.fail(status);
//                 }
//             }
//         };
//         request.open("POST", config.url, true);
//         request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//         request.send(params);
//     }
//
//     static uploadFile(cfg) {
//         var config = cfg || {};
//         var xhr;
//         var fileObj = config.file;  js 获取文件对象
//         var url = config.url;  接收上传文件的后台地址
//         var form = new FormData();  FormData 对象
//         form.append(config.name, fileObj);  文件对象
//         xhr = new XMLHttpRequest();   XMLHttpRequest 对象
//         xhr.open("post", url, true); post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState == 4) {
//                 var status = xhr.status;
//                 if (status >= 200 && status < 300) {
//                     var res = JSON.parse(xhr.responseText);
//                     console.log(res);
//                     config.success && config.success(res);
//                 } else {
//                     config.fail && config.fail(status);
//                 }
//             }
//         };
//         xhr.send(form); 开始上传，发送form数据
//     }
//
//     static formatParams(data) {
//         var arr = [];
//         for (var name in data) {
//             arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
//         }
//         arr.push(("v=" + Math.random()).replace(".", ""));
//         return arr.join("&");
//     }
// }

import LocalDB from 'local-db';
const userCollection = new LocalDB('user');

import FileSaver from 'file-saver';
import mime from 'mime-types';

import {toast} from 'react-toastify';

class HttpService {
  constructor() {}
  get(url, params, successCallback, errorCallback) {

    let Authorization = "";
    const user = userCollection.query({});
    if (user.length) {
      Authorization = user[0].token;
    }
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        const status = request.status;
        if (status >= 200 && status < 300) {
          try {
            const res = JSON.parse(request.responseText);
            successCallback && successCallback(res);
          } catch (e) {
            console.error(e);
          }
          return
        }
        if (status == 401) {
          window.location.replace("#/register");
          return
        }
        if (status == 400) {
          const error = JSON.parse(request.responseText);
          toast(error.msg, {
            position: toast.POSITION.BOTTOM_CENTER,
            closeButton: false
          });
        }
        errorCallback && errorCallback(status);
      }
    };
    let query = [];
    for (var key in params) {
      query.push(key + "=" + params[key]);
    }
    if (query) {
      url += "?" + query.join("&");
    }
    request.open("GET", url, true);
    request.withCredentials = true;
    if (Authorization) {
      request.setRequestHeader("Authorization", "Bearer " + Authorization);
    }
    request.send();
  }

  post(url, params, successCallback, errorCallback) {

    let Authorization = "";
    const user = userCollection.query({});
    if (user.length) {
      Authorization = user[0].token;
    }
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        const status = request.status;
        if (status >= 200 && status < 300) {
          const res = JSON.parse(request.responseText);
          successCallback && successCallback(res);
          return
        }
        if (status == 401) {
          window.location.replace("#/register");
          return
        }
        if (status == 400) {
          const error = JSON.parse(request.responseText);
          toast(error.msg, {
            position: toast.POSITION.BOTTOM_CENTER,
            closeButton: false
          });
        }
        errorCallback && errorCallback(status);
      }
    };
    request.open("POST", url, true);
    request.withCredentials = true;
    request.setRequestHeader("Content-Type", "application/json");
    if (Authorization) {
      request.setRequestHeader("Authorization", "Bearer " + Authorization);
    }
    request.send(JSON.stringify(params));
  }

  // 下载文件，默认是excel
  downloadFile(url, params, fileType, successCallback, errorCallback) {
    console.log(fileType);
    let Authorization = "";
    const user = userCollection.query({});
    if (user.length) {
      Authorization = user[0].token;
    }
    let request = new XMLHttpRequest();

    // 使用JavaScript类型数组接受二进制数据
    // 可以通过设置一个XMLHttpRequest对象的responseType属性来改变一个从服务器上返回的响应的数据类型。
    // 可用的属性值为空字符串 (默认), "arraybuffer", "blob", "document",和 "text"。
    // response属性的值会根据responseType属性的值的不同而不同,
    // 可能会是一个 ArrayBuffer, Blob, Document, string,或者为NULL(如果请求未完成或失败)
    // 下例读取了一个二进制图像文件,并且由该文件的二进制原生字节创建了一个8位无符号整数的数组。
    request.responseType = "blob";
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        const status = request.status;
        if (status >= 200 && status < 300) {
          const extensions = mime.extensions[fileType?fileType:"application/vnd.ms-excel"];
          FileSaver.saveAs(request.response, params.fileName+'.'+[extensions]);

          successCallback && successCallback();
          return
        }
        if (status == 401) {
          window.location.replace("#/register");
          return
        }
        if (status == 400) {
          const error = JSON.parse(request.responseText);
          toast(error.msg, {
            position: toast.POSITION.BOTTOM_CENTER,
            closeButton: false
          });
        }

        errorCallback && errorCallback(status);
      }
    };
    request.open("POST", url, true);
    request.withCredentials = true;
    request.setRequestHeader("Content-Type", "application/json");
    // request.setRequestHeader("responseType", "blob");
    if (Authorization) {
      request.setRequestHeader("Authorization", "Bearer " + Authorization);
    }
    request.send(JSON.stringify(params));
  }
}

let HTTP = new HttpService();

export default HTTP
