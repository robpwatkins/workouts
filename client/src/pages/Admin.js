import { useState } from 'react';

const Admin = () => {
  const [dates, setDates] = useState('');
  const [showFinalized, setShowFinalized] = useState(false);
  const [user, setUser] = useState('');
  const [showUser, setShowUser] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const activeUsers = [
    // { _id: '642b6e304c469cff2fd4af18', email: 'robpwatkins@gmail.com' },
    { _id: '65ff8c2ad8f1c29f44e381d0', email: 'r.watkins@zollege.com' },
    // { _id: '65fb6ffe8cb630c7c3b81b0e', email: 'kevinrossen@gmail.com' },
    // { _id: '65ff4b1c7e6073029db84bb1', email: 'irbytexan@yahoo.com' },
    // { _id: '65ff83827e6073029db84c92', email: 'tribefan6180@yahoo.com' },
    // { _id: '66044d5c0563647d7690dc8e', email: 'jmnewmyer11@gmail.com' },
    // { _id: '66047d700563647d7690dca1', email: 'theserieschallenge2022@gmail.com' },
    // { _id: '6604ad980563647d7690dcd5', email: 'sooner2001@hotmail.com' },
    // { _id: '6604da0d0563647d7690dcdf', email: 'crussell_44@hotmail.com' },
    // { _id: '6604db710563647d7690dced', email: 'vraymond8@hotmail.com' },
    // { _id: '6604ef070563647d7690dd02', email: 'boreed009@yahoo.com' },
  ];

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

    for await (const { _id } of users.filter(user => user.email === 'r.watkins@zollege.com')) {
      let wins = 0;
      let losses = 0;

      const userFinalizedPicks = picks
        .filter(pick => (
          pick.user_id === _id &&
          pick.finalized &&
          pick.user_id === '65ff8c2ad8f1c29f44e381d0'
        ));

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