import { useState, useEffect, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import teams from '../teams.json';
import activeUsers from '../activeUsers.json';

const Admin = () => {
  const [dates, setDates] = useState('');
  const [showFinalized, setShowFinalized] = useState(false);
  const [user, setUser] = useState('');
  const [showUser, setShowUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [picks, setPicks] = useState([]);
  const [finalizedSeries, setFinalizedSeries] = useState([]);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`${serverUrl}/users`, { credentials: 'include' });
      const users = await response.json();
      const sortedUsers = users.sort((a, b) => a.total_wins + b.total_wins);
      // const activeUsers = ['robpwatkins@gmail.com', 'r.watkins@zollege.com'];
      
      setUsers(
        sortedUsers.filter(user => activeUsers.some(activeUser => activeUser.email === user.email))
      );
    };

    const fetchPicks = async () => {
      const response = await fetch(`${serverUrl}/api/picks/all`, { credentials: 'include' });
      const json = await response.json();

      if (response.ok) setPicks(json);
    };

    fetchUsers();
    fetchPicks();
  }, [serverUrl]);

  useEffect(() => {
    const getSeriesData = async () => {
      const allSeries = await (await fetch(`${serverUrl}/all-series`)).json();

      setFinalizedSeries(
        allSeries.filter(seriesGroup => seriesGroup.series.some(singleSeries => {
          const { finalized } = picks.find(pick => pick.series_id === singleSeries.seriesId) || {};

          return finalized ? singleSeries : null;
        }))
      );
    };

    getSeriesData();
  }, [picks, serverUrl]);

  const updateUserPicks = async (e) => {
    e.preventDefault();

    const picks = await (await fetch(`${serverUrl}/api/picks/all`, {
      credentials: 'include'
    })).json();
    // const picksToFinalize = picks.filter(pick => (
    //   activeUsers.some(user => user._id === pick.user_id)) &&
    //   !pick.finalized
    // );
    const picksToFinalize = picks;
    const allSeries = await (await fetch(`${serverUrl}/all-series`)).json();

    let pickCount = 1;

    for await (const { _id: pickId, pick, series_id } of picksToFinalize) {
      const [dates] = series_id.split(':');
      const { series: seriesGroup } = allSeries.find(series => series.dates === dates);
      const { seriesInfo } = seriesGroup.find(series => series.seriesId === series_id);
      const { visitor, visitorWin, home, homeWin, sweep, split } = seriesInfo;

      if (visitorWin || homeWin || split) {
        const winner = (visitorWin || homeWin) ? (visitorWin ? visitor : home) : '';

        try {
          const response = await (await fetch(`${serverUrl}/api/picks/${pickId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              successful: pick === winner,
              finalized: true,
              sweep,
              split
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
    let users = await (await fetch(`${serverUrl}/users`, { credentials: 'include' })).json();

    users = users
      .filter(user => activeUsers.some(activeUser => activeUser.email === user.email));

    for await (const { _id } of users) {
      let wins = 0;
      let losses = 0;
      let sweeps = 0;

      const userFinalizedPicks = picks.filter(pick => (pick.user_id === _id && pick.finalized));

      for await (const pick of userFinalizedPicks) {
        if (pick.successful) {
          if (pick.sweep) sweeps++;

          wins++;
        } else losses++;
  
        if ((wins + losses) === userFinalizedPicks.length) {
          const userResponse = await fetch(`${serverUrl}/user/update/${_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              total_wins: wins,
              total_losses: losses,
              win_pct: (wins / (wins + losses)).toFixed(3),
              sweeps
            })
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
    <div className="admin">
      <form>
        <button onClick={updateUserPicks}>Finalize picks</button>
        <p className={`picks-finalized${!showFinalized ? " d-none" : ""}`}>Picks finalized!</p>
        <button onClick={updateUserRecords}>Update user records</button>
        <p className={`records-updated${!showUser ? " d-none" : ""}`}>Records updated for {user}!</p>
      </form>
      {/* <table className="picks">
        <thead>
          <tr>
            <th className="game-count-column"></th>
            {users.map(user => (
              <th className="username" key={user.username}>{user.username}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {finalizedSeries.map(seriesGroup => {
            const { dates, series } = seriesGroup;
            return (
              <Fragment key={dates}>
                <tr className="dates">
                  <td>{dates}</td>
                  {users.map((_, idx) => <td key={idx}></td>)}
                </tr>
                {series.map(singleSeries => {
                  const { seriesId, seriesInfo } = singleSeries;
                  const { visitor, visitorWin, home, homeWin } = seriesInfo;
                  const { logo: visitorLogo } = teams
                    .find(team => team.abbreviation === visitor);
                  const { logo: homeLogo } = teams
                    .find(team => team.abbreviation === home);

                  return (
                    <tr key={seriesId}>
                      <td className="series-td">
                        <img src={visitorLogo} alt={`${visitor} logo`} />
                        <span className={visitorWin ? "winner": ""}>{visitor}</span>
                        <span>@</span>
                        <span className={homeWin ? "winner" : ""}>{home}</span>
                        <img src={homeLogo} alt={`${home} logo`} />
                      </td>
                      {users.map(user => {
                        const { successful } = picks
                          .find(pick => (pick.series_id === seriesId && pick.user_id === user._id)) || {};

                        return (
                          <td key={`${user.username}:${seriesId}`}>
                            {successful
                              ? <FontAwesomeIcon icon={faCheck} />
                              : <FontAwesomeIcon icon={faXmark} />}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </Fragment>
            )
          })}
        </tbody>
      </table> */}
    </div>
  )
};

export default Admin;