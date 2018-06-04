// 新增一个Model class
class Model {
  constructor(model) {
    this.model = model;
    this.find = this.find.bind(this); // 绑定上下文
    this.create = this.create.bind(this);
    this.findOne = this.findOne.bind(this);
  }

  // 查询
  find(dataArr = {}) {
    return new Promise((resolve, reject) => {
      // 上面绑定了上下文，这里使用this.model
      this.model.find(dataArr, (err, docs) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(docs);
        }
      })
    })
  }

  // 查询单个
  findOne(dataArr) {
    return new Promise((resolve, reject) => {
      this.model.findOne(dataArr, (err, docs) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(docs);
        }
      })
    })
  }

  // 创建
  create(dataArr) {
    return new Promise((resolve, reject) => {
      let model = new this.model(dataArr);
      model.save((err, data) => {
        if (err) {
          console.log(err)
          reject(err);
          return
        }
        console.log('创建成功');
        resolve(data)
      });
    })
  }
}

module.exports = Model;
