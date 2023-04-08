import { useEffect, useState } from 'react';
import Picks from '../components/Picks';
import Snapshot from '../components/Snapshot';

const Standings = () => {
  const [users, setUsers] = useState([]);
  const [picks, setPicks] = useState([]);
  const [allSeries, setAllSeries] = useState([]);

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

    const fetchAllSeries = async () => {
      const response = await fetch('http://localhost:4001/all-series');
      const json = await response.json();
      setAllSeries(json.slice(0, 5));
    };

    fetchUsers();
    fetchPicks();
    fetchAllSeries();
  }, []);

  return (
    <div className="standings">
      <Snapshot users={users} />
      <div className="all-picks">
        {users.length ? (users.map(user => {
          return (
            <div key={user.username} className="picks">
              <h3 className="username">{user.username}</h3>
              {allSeries.length ? (allSeries.map(seriesGroup => {
                const userPicks = picks.find(pick => pick.user_id === user._id);
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