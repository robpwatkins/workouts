import { useState } from 'react';

const Admin = () => {
  const [dates, setDates] = useState('');
  const [showDates, setShowDates] = useState(false);
  const [user, setUser] = useState('');
  const [showUser, setShowUser] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const updateUserPicks = async (e) => {
    e.preventDefault();

    const seriesResponse = await fetch(`${serverUrl}/all-series`);
    const allSeries = await seriesResponse.json();
    const picksResponse = await fetch(`${serverUrl}/api/picks/all`, { credentials: 'include' });
    const picks = await picksResponse.json();

    for await (const { dates: seriesDates, series: seriesGroup } of allSeries) {
      for await (const singleSeries of seriesGroup) {
        const { seriesId, seriesInfo } = singleSeries;
        const { visitor, visitorWin, home, homeWin } = seriesInfo;
        if (visitorWin || homeWin) {
          const winner = visitorWin ? visitor : home;
          const seriesPicks = picks.filter(pick => (pick.series_id === seriesId && !pick.finalized));

          let wins = 0;
          let losses = 0;

          for await (const { _id, pick } of seriesPicks) {
            const successful = pick === winner;
            
            try {
              await fetch(`${serverUrl}/api/picks/${_id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  successful: pick === winner,
                  finalized: true
                })
              });
  
              successful ? wins++ : losses++;

              if (wins + losses === seriesPicks.length) {
                setDates(seriesDates);
                setShowDates(true);
              }
            } catch (error) {
              console.log('error: ', error);
            }
          }
        }
      }
    }
  };

  const updateUserRecords = async (e) => {
    e.preventDefault();

    const picksResponse = await fetch(`${serverUrl}/api/picks/all`, { credentials: 'include' });
    const picks = await picksResponse.json();
    const usersResponse = await fetch(`${serverUrl}/users`, { credentials: 'include' });
    const users = await usersResponse.json();

    for await (const { _id } of users) {
      let wins = 0;
      let losses = 0;

      const userPicks = picks.filter(pick => (pick.user_id === _id && pick.finalized));

      for await (const pick of userPicks) {
        pick.successful ? wins++ : losses++;
  
        if ((wins + losses) === userPicks.length) {
          const userResponse = await fetch(`${serverUrl}/user/update/${_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ total_wins: wins, total_losses: losses })
          });
          const json = await userResponse.json();
  
          if (userResponse.ok) {
            setUser(json.username);
            setShowUser(true);
          }
        }  
      }
    }
  };

  return (
    <form className="admin">
      <button onClick={updateUserPicks}>Finalize picks</button>
      <p className={`picks-finalized${!showDates ? " d-none" : ""}`}>Picks finalized for {dates}!</p>
      <button onClick={updateUserRecords}>Update user records</button>
      <p className={`records-updated${!showUser ? " d-none" : ""}`}>Records updated for {user}!</p>
    </form>
  )
};

export default Admin;