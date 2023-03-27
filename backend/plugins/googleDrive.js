const { getGoogleClient } = require('../utils/getAuthenticacatedGoogleClient');

const getSheetData = async (spreadsheetId, range) => {
  const google = await getGoogleClient();
  const sheets = await google.sheets('v4');
  const { values: rows } = (await sheets.spreadsheets.values.get({
    spreadsheetId,
    range
  })).data;
  return console.log('rows: ', rows);
  const dataArr = [];
  const columnNames = rows[0];
  rows.forEach((row, index) => {
    if (index == 0) return;
    const rowObj = {};
    row.forEach((cell, index) => {
      rowObj[columnNames[index]] = cell;
    })
    dataArr.push(rowObj);
  })
  return dataArr;
};

getSheetData('1YJw6UclwKyGjdwns9vgU3VrivderKfpM3FPKIRR6uVE', 'Series')

module.exports = { getSheetData };