// 使用 https://www.npmjs.com/package/joi-to-json-schema
const convert = require('joi-to-json-schema');
const convert2json = (data) => {
  const joi = data.body || data.params || data.query;
  let result = convert(joi);
  if (result.required) {
    for (let name of result.required) {
      result.properties[name].required = true;
    }
  }
  return result.properties;
}
module.exports = convert2json;
