const ejsexcel = require("ejsexcel");
const Excel = require('exceljs');
const fs = require("fs");
const path = require('path');

const workbook = new Excel.Workbook();
const exlBuf = fs.readFileSync("./files/purchase.xlsx");
class ExportExcel {
  constructor() {}
  exportPurchase(name, data) {
    return new Promise((resolve, reject) => {
      const newData = [
        [
          {
            name: name
          }
        ],
        data
      ];

      ejsexcel.renderExcel(exlBuf, newData).then(exlBuf2 => {
        fs.writeFileSync(path.resolve('./files/test.xlsx'), exlBuf2);

        workbook.xlsx.readFile(path.resolve('./files/test.xlsx')).then(() => {
          // use workbook

          let worksheet = workbook.getWorksheet('Sheet1');
          console.log("添加签名");
          for (let i in data) {
            if (data[i].sign) {
              let base64Image = data[i].sign?data[i].sign:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX///+nxBvIAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==";
              // add image to workbook by base64
              let imageId = workbook.addImage({base64: base64Image, extension: 'png'});
              let startRow = parseInt(i) + 3;
              let endRow = startRow + 1;
              worksheet.addImage(imageId, {
                tl: {
                  col: 11,
                  row: startRow
                },
                br: {
                  col: 12,
                  row: endRow
                },
                editAs: undefined
              });
            }
          }

          workbook.xlsx.writeFile(path.resolve(`./files/${name}.xlsx`)).then(() => {
            // done
            resolve(path.resolve(`./files/${name}.xlsx`));
          }).catch(err => {
            reject(err);
          });
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }
}

const exportExcel = new ExportExcel();

module.exports = exportExcel;
