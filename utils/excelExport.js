const ejsexcel = require("ejsexcel");
const fs = require("fs");

const exportExcel = (data, origin, dist) => {
  const exlBuf = fs.readFileSync(origin);
  ejsexcel.renderExcel(exlBuf, data).then(result => {
    fs.writeFileSync(dist, result);
  }).catch(err => {
    console.error(err);
  });

}
module.exports = exportExcel;
