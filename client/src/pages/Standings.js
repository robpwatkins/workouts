import { useEffect, useState } from 'react';
import Picks from '../components/Picks';
import Snapshot from '../components/Snapshot';

const Standings = () => {
  const [users, setUsers] = useState([]);
  const [picks, setPicks] = useState([]);
  const [finalizedSeries, setFinalizedSeries] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/users', { credentials: 'include' });
      const users = await response.json();
      const sortedUsers = users.sort((a, b) => a.total_wins + b.total_wins);
      setUsers(sortedUsers);
    }

    const fetchPicks = async () => {
      const response = await fetch('/api/picks/all', { credentials: 'include' });
      const json = await response.json();
      if (response.ok) setPicks(json);
    };

    fetchUsers();
    fetchPicks();
  }, []);

  useEffect(() => {
    const getFinalizedSeries = async () => {
      const response = await fetch('/all-series');
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
      <Picks
        users={users}
        finalizedSeries={finalizedSeries}
        picks={picks}
      />
    </div>
  )
};

export default Standings;