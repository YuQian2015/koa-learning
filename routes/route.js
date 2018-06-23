class Route {
  constructor() {
  }

  route() {
    /* Object.keys() 只能迭代（iterate）可枚举的对象属性（enumerable properties），ES6的方法不是，
    * 可以使用 getOwnPropertyNames()，并且由于方法是被定义在对象的prototype上，可以使用Object.getPrototypeOf()来获得
    * Please notice that if you use Symbols as method keys you'd need to use getOwnPropertySymbols() to iterate over them.
    */
    for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
        let method = this[name];
        // 跳过 constructor
        if (!(method instanceof Function) || name === 'constructor') continue;
        method();
    }
  }
}

module.exports = Route;
