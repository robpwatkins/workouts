import { useEffect, useState } from 'react';
import Picks from '../components/Picks';
import Snapshot from '../components/Snapshot';

const Standings = () => {
  const [users, setUsers] = useState([]);
  const [picks, setPicks] = useState([]);
  const [finalizedSeries, setFinalizedSeries] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:4001/users', { credentials: 'include' });
      const users = await response.json();
      const sortedUsers = users.sort((a, b) => a.total_wins + b.total_wins);
      setUsers(sortedUsers);
    }

    const fetchPicks = async () => {
      const response = await fetch('http://localhost:4001/api/picks/all', { credentials: 'include' });
      const json = await response.json();
      if (response.ok) setPicks(json);
    };

    fetchUsers();
    fetchPicks();
  }, []);

  useEffect(() => {
    const getFinalizedSeries = async () => {
      const response = await fetch('http://localhost:4001/all-series');
      const json = await response.json();

      const _finalizedSeries = json.filter(seriesGroup => {
        const groupFinalized = seriesGroup.series.every(singleSeries => {
          const { finalized } = picks.find(pick => pick.series_id === singleSeries.seriesId) || {};
          return finalized ? singleSeries : null;
        })
        return groupFinalized ? seriesGroup : null;
      })
      setFinalizedSeries(_finalizedSeries);
    };

    getFinalizedSeries();
  }, [picks]);

  return (
    <div className="standings">
      <Snapshot users={users} />
      <div className="all-picks">
        {users.length ? (users.map(user => {
          return (
            <div key={user.username} className="picks">
              <div className="username-and-record">
                <h3 className="username">{user.username}</h3>
                <h5 className="d-block">{`${user.total_wins}-${user.total_losses}`}</h5>
              </div>
              {finalizedSeries.length ? (finalizedSeries.map(seriesGroup => {
                const userPicks = picks.filter(pick => pick.user_id === user._id);
                return (
                  <Picks
                    key={seriesGroup.dates}
                    user={user}
                    picks={userPicks}
                    seriesGroup={seriesGroup}
                  />
                )
              })) : ""}
            </div>
          )
        })) : ''}
      </div>
    </div>
  )
};

export default Standings;