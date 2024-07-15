const { writeFileSync } = require('fs');
const activeUsers = [
  // { _id: '642b6e304c469cff2fd4af18', email: 'robpwatkins@gmail.com' },
  // { _id: '65ff8c2ad8f1c29f44e381d0', email: 'r.watkins@zollege.com' },
  { _id: '65fb6ffe8cb630c7c3b81b0e', email: 'kevinrossen@gmail.com' },
  { _id: '65ff4b1c7e6073029db84bb1', email: 'irbytexan@yahoo.com' },
  { _id: '65ff83827e6073029db84c92', email: 'tribefan6180@yahoo.com' },
  { _id: '66044d5c0563647d7690dc8e', email: 'jmnewmyer11@gmail.com' },
  { _id: '66047d700563647d7690dca1', email: 'theserieschallenge2022@gmail.com' },
  { _id: '6604ad980563647d7690dcd5', email: 'sooner2001@hotmail.com' },
  { _id: '6604da0d0563647d7690dcdf', email: 'crussell_44@hotmail.com' },
  { _id: '6604db710563647d7690dced', email: 'vraymond8@hotmail.com' },
  { _id: '6604ef070563647d7690dd02', email: 'boreed009@yahoo.com' },
];
const serverUrl = 'http://localhost:4001';

(async () => {
  const seriesResponse = await fetch(`${serverUrl}/all-series`);
  const allSeries = await seriesResponse.json();
  const picksResponse = await fetch(`${serverUrl}/api/picks/all`, { credentials: 'include' });
  const picks = await picksResponse.json();
  const usersResponse = await fetch(`${serverUrl}/users`, { credentials: 'include' });
  const users = await usersResponse.json();
  const picksToUpdate = picks
    .filter(pick => (
      activeUsers.some(user => user._id === pick.user_id)) &&
      !pick.finalized &&
      (pick.series_id !== 'bar' && pick.series_id !== 'record')
    );
  const userPickData = [];

  for await (const { _id, user_id, series_id, pick } of picksToUpdate) {
    const user = users.find(user => user._id === user_id);
    const { _id: userId, username, email } = user;
    const [dates] = series_id.split(':');
    const { series: seriesGroup } = allSeries.find(series => series.dates === dates);
    const currentSeries = seriesGroup.find(series => series.seriesId === series_id);
    const { seriesInfo: { visitor, visitorWin, home, homeWin } } = currentSeries;
    const winner = visitorWin ? visitor : home;
    const successful = pick === winner;

    userPickData.push({
      pick_id: _id,
      pick,
      successful,
      user_id: userId,
      username,
      email,
    });
  }

  writeFileSync('data/userPickData.json', JSON.stringify(userPickData, null, 2));
})();