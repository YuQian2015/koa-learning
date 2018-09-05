const ejsexcel = require("ejsexcel");
const Excel = require('exceljs');
const fs = require("fs");
const path = require('path');

const workbook = new Excel.Workbook();
const exlBuf = fs.readFileSync("./files/purchase.xlsx");
const dailyDietBuf = fs.readFileSync("./files/dailyDiet.xlsx");
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
              let base64Image = data[i].sign
                ? data[i].sign
                : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX///+nxBvIAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==";
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

  exportDailyDiet(name, data) {
    return new Promise((resolve, reject) => {
      const newData = data;

      ejsexcel.renderExcel(dailyDietBuf, newData).then(dailyDietBuf2 => {
        fs.writeFileSync(path.resolve('./files/test.xlsx'), dailyDietBuf2);
        workbook.xlsx.readFile(path.resolve('./files/test.xlsx')).then(() => {
          // use workbook
          let worksheet = workbook.getWorksheet('Sheet1');

          worksheet.mergeCells('G4:G6');
          worksheet.mergeCells('H4:H6');
          for (let i in data.cookbook) {
            const cell = worksheet.getCell(`G${ 6 + (1 + 3 * i)}`);
            const cell2 = worksheet.getCell(`H${ 6 + (1 + 3 * i)}`);
            cell.value = (i + 1).toString();
            cell2.value = data.cookbook[i].name;
            worksheet.mergeCells(`G${ 6 + (1 + 3 * i)}:G${ 8 + (1 + 3 * i)}`);
            worksheet.mergeCells(`H${ 6 + (1 + 3 * i)}:H${ 8 + (1 + 3 * i)}`);
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
