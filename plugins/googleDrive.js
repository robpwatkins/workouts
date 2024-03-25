const { getGoogleClient } = require('../utils/getAuthenticacatedGoogleClient');

const getAllSeries = async (spreadsheetId, range) => {
  const google = await getGoogleClient();
  const sheets = google.sheets('v4');
  const { values: rows } = (await sheets.spreadsheets.values.get({
    spreadsheetId,
    range
  })).data;
  const allSeries = [];
  let seriesGroup;
  rows.forEach((row, index) => {
    if (!row.length) return;
    if (row.length === 1 || index === rows.length - 1) {
      if (seriesGroup) allSeries.push(seriesGroup);
      if (row.length === 1) {
        seriesGroup = {};
        seriesGroup.dates = row[0];
      }
    } else {
      const [visitor, visitorWinStr, home, homeWinStr, record, gameCount] = row;
      const seriesId = `${seriesGroup.dates}:${visitor}@${home}`;
      const visitorWin = visitorWinStr === 'TRUE';
      const homeWin = homeWinStr === 'TRUE';
      if (!seriesGroup.series) seriesGroup.series = [{
        seriesId,
        seriesInfo: {
          visitor,
          visitorWin,
          home,
          homeWin,
          record,
          gameCount: gameCount || '3'
        }
      }];
      else seriesGroup.series.push({
        seriesId,
        seriesInfo: {
          visitor,
          visitorWin,
          home,
          homeWin,
          record,
          gameCount: gameCount || '3'
        }
      });
    }
  })
  return allSeries;
};

module.exports = { getAllSeries };