const Excel = require('exceljs');
const path = require('path');

// https://github.com/guyonroche/exceljs
// read from a file
var workbook = new Excel.Workbook();
workbook.xlsx.readFile(path.resolve('./files/test.xlsx'))
    .then(function() {
        // use workbook
        const worksheet = workbook.addWorksheet('My Sheet');
        workbook.xlsx.writeFile(path.resolve('./files/export.xlsx')).then(function() {
          // done
        });
    });




return
workbook.creator = 'Me';
workbook.lastModifiedBy = 'Her';
workbook.created = new Date(1985, 8, 30);
workbook.modified = new Date();
workbook.lastPrinted = new Date(2016, 9, 27);
// Set workbook dates to 1904 date system
workbook.properties.date1904 = true;

workbook.views = [
  {
    x: 0,
    y: 0,
    width: 10000,
    height: 20000,
    firstSheet: 0,
    activeTab: 1,
    visibility: 'visible'
  }
]

// create a sheet with red tab colour
const worksheet = workbook.addWorksheet('My Sheet');

// create a sheet where the grid lines are hidden
// var sheet = workbook.addWorksheet('My Sheet', {properties: {showGridLines: false}});

// create a sheet with the first row and column frozen
// var sheet = workbook.addWorksheet('My Sheet', {views:[{xSplit: 1, ySplit:1}]});


// 列
// Add column headers and define column keys and widths
// Note: these column structures are a workbook-building convenience only,
// apart from the column width, they will not be fully persisted.
worksheet.columns = [
    { header: 'Id', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 32 },
    // { header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 },
    { header: 'D.O.B.', key: 'DOB', width: 10 }
];

// Add an array of rows
var rows = [
    [5,'Bob',new Date()], // row by array
    {id:6, name: 'Barbara', dob: new Date()}
];
worksheet.addRows(rows);

// merge a range of cells
// worksheet.mergeCells('A4:B5');

// add image to workbook by base64
var myBase64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAABaCAYAAAARg3zAAAAEY0lEQVR4Xu2bO8ucVRCAn2i8ES+NhSISTArFCxZaSBCsLCysLG1S5x8oaVPE3tpSQVAEC7UxpU0iFnZBRCzEG6KiJlETBk7gI6x+u+Gdb847PAsfy2bPzpx55tksvPOeQ/iQQCMChxrVYikSQKGVoBUBhW7VTotRaB1oRUChW7XTYhRaB1oRUOhW7bQYhdaBVgQUulU7LUahdaAVAYVu1U6LUWgdaEVAoVu102IUWgdaEVDoVu20GIXWgVYEFLpVOy1GoXWgFQGFbtVOi1FoHWhFQKFbtdNiFFoHWhFQ6FbttBiF1oFWBBS6VTstRqF1oBUBhW7VTotRaB1oRUChW7XTYhRaB1oRUOhW7bQYhdaBVgQUulU7LWZWoZ8CHgc+Bn6xTRLYlsCsQl/dtoCx7gPg/X0+8wNwEfgW+GPH+JXL7wUeAh4FDgNHxvM9wF/Ac8BdQLy+Dbg86ov/COL1ycrNH3TuWYV+BXgNeOaggUya7zfgO+CnIfP3wC3A3+Pv+rZD7H+Au4GjQ/jHJq0pZVuzCr2p2E+Bh4HjG96MZn8J3Po/lEKGt4DPhhgpQA1aS2BNQteSMvsqCCj0KtrkJrcloNDbknLdKggo9Cra5Ca3JaDQ25Jy3SoIdBH6GPAGEJf7/h2XtPY24AvgxMquP69CoNk2uWahdx2+zMY+cz+3A1cyE8wae81CxyTsvh3AXgJ+Bh7c8JmPgPeAc2PStm3YiHnHPovjFyOmdzEEievkMb2Lid+mR8SLL2oMR2JN/G26th7vR7x4jvx718RtAx9uW0C3dWsWulsvrGcBAgq9AERDzENAoefphTtZgIBCLwDREPMQUOh5euFOFiCg0AtANMQ8BBR6nl64kwUIKPQCEA0xD4E1C/0mcGoHlDGwiCNLnwCfj8+dueHExw7hXDojgTULHdO3mLot+bgAvAv8Cfw6An8F3DkmcsErJn/xHOf84h6ROAkTo+YfgfvH9C7Wx7/FFC+mffFlisleTAK/HhPLOBsYOeK41O/A02NtTD+f2FNUTETjCNb5cY9K5InXPjYQWLPQN5YTh0hDikeAB8abMRp+BwgpY+wdI+KXgReAZ4Hni62I+y2W/FJGvWeBb4C393wpi8s8uPSdhD44avNlehF4FXhyn4PF8WsSJ+TjfGb0Pu5riVPlp+cr6eZ2pNA3x21tn3p9/Bq99B8bb+NBm0LWZpj7zSGg0DlcjVpEQKGLwJs2h4BC53A1ahEBhS4Cb9ocAgqdw9WoRQQUugi8aXMIKHQOV6MWEVDoIvCmzSGg0DlcjVpEQKGLwJs2h4BC53A1ahEBhS4Cb9ocAgqdw9WoRQQUugi8aXMIKHQOV6MWEVDoIvCmzSGg0DlcjVpEQKGLwJs2h4BC53A1ahEBhS4Cb9ocAgqdw9WoRQQUugi8aXMIKHQOV6MWEVDoIvCmzSGg0DlcjVpEQKGLwJs2h4BC53A1ahEBhS4Cb9ocAgqdw9WoRQQUugi8aXMIXANIXF5bs66i9AAAAABJRU5ErkJggg==";
var imageId2 = workbook.addImage({
  base64: myBase64Image,
  extension: 'png',
});

worksheet.addImage(imageId2, 'B2:D6');
// insert an image over part of B2:D6
worksheet.addImage(imageId2, {
  tl: { col: 1, row: 1 },
  br: { col: 2, row: 2 },
  editAs: undefined
});
workbook.xlsx.writeFile(path.resolve('./files/export.xlsx')).then(function() {
  // done
});
