import { useState } from 'react';
import activeUsers from '../activeUsers.json';

const Admin = () => {
  const [dates, setDates] = useState('');
  const [showFinalized, setShowFinalized] = useState(false);
  const [user, setUser] = useState('');
  const [showUser, setShowUser] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const updateUserPicks = async (e) => {
    e.preventDefault();

    const picks = await (await fetch(`${serverUrl}/api/picks/all`, {
      credentials: 'include'
    })).json();
    const picksToFinalize = picks.filter(pick => (
      activeUsers.some(user => user._id === pick.user_id)) &&
      !pick.finalized
    );
    const allSeries = await (await fetch(`${serverUrl}/all-series`)).json();

    let pickCount = 1;

    for await (const { _id: pickId, pick, series_id } of picksToFinalize) {
      const [dates] = series_id.split(':');
      const { series: seriesGroup } = allSeries.find(series => series.dates === dates);
      const { seriesInfo } = seriesGroup.find(series => series.seriesId === series_id);
      console.log({ seriesInfo });
      const { visitor, visitorWin, home, homeWin } = seriesInfo;

      if (visitorWin || homeWin) {
        const winner = visitorWin ? visitor : home;

        try {
          const response = await (await fetch(`${serverUrl}/api/picks/${pickId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              successful: pick === winner,
              finalized: true
            })
          })).json();

          console.log({ response });

          pickCount++;

          if (pickCount === picksToFinalize.length) setShowFinalized(true);
        } catch (error) {
          console.log('error: ', error);
        }
      }
    }
  };

  const updateUserRecords = async (e) => {
    e.preventDefault();

    const picks = await (await fetch(`${serverUrl}/api/picks/all`, {
      credentials: 'include'
    })).json();
    const users = await (await fetch(`${serverUrl}/users`, { credentials: 'include' })).json();

    for await (const { _id } of users) {
      let wins = 0;
      let losses = 0;

      const userFinalizedPicks = picks.filter(pick => (pick.user_id === _id && pick.finalized));

      for await (const pick of userFinalizedPicks) {
        pick.successful ? wins++ : losses++;
  
        if ((wins + losses) === userFinalizedPicks.length) {
          console.log({ wins, losses });
          const userResponse = await fetch(`${serverUrl}/user/update/${_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ total_wins: wins, total_losses: losses })
          });
          
          if (userResponse.ok) {
            const user = await userResponse.json();
            console.log({ user });

            setUser(user.username);
            setShowUser(true);
          }
        }  
      }
    }
  };

  return (
    <form className="admin">
      <button onClick={updateUserPicks}>Finalize picks</button>
      <p className={`picks-finalized${!showFinalized ? " d-none" : ""}`}>Picks finalized!</p>
      <button onClick={updateUserRecords}>Update user records</button>
      <p className={`records-updated${!showUser ? " d-none" : ""}`}>Records updated for {user}!</p>
    </form>
  )
};

export default Admin;