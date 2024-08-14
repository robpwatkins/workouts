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
      const [
        visitor,
        visitorWinStr,
        home,
        homeWinStr,
        record,
        gameCount,
        sweep,
        split
      ] = row;
      const visitorWin = visitorWinStr === 'TRUE';
      const homeWin = homeWinStr === 'TRUE';
      const seriesInfo = {
        seriesId: `${seriesGroup.dates}:${visitor}@${home}`,
        seriesInfo: {
          winner: (visitorWin || homeWin) ? (visitorWin ? visitor : home) : '',
          visitor,
          visitorWin,
          home,
          homeWin,
          record,
          gameCount: gameCount || '3',
          sweep: sweep === 'Sweep',
          split: split === 'Split'
        }
      };
      
      if (!seriesGroup.series) seriesGroup.series = [seriesInfo];
      else seriesGroup.series.push(seriesInfo);
    }
  })
  return allSeries;
};

module.exports = { getAllSeries };