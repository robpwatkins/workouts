import { useEffect, useState } from 'react';
import Picks from '../components/Picks';
import Snapshot from '../components/Snapshot';

const Standings = () => {
  const [users, setUsers] = useState([]);
  const [picks, setPicks] = useState([]);
  const [finalizedSeries, setFinalizedSeries] = useState([]);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`${serverUrl}/users`, { credentials: 'include' });
      const users = await response.json();
      const sortedUsers = users.sort((a, b) => a.total_wins + b.total_wins);
      
      setUsers(
        sortedUsers.filter(user => (
          ['robpwatkins@gmail.com', 'r.watkins@zollege.com'].includes(user.email)
        ))
      );
    }

    const fetchPicks = async () => {
      const response = await fetch(`${serverUrl}/api/picks/all`, { credentials: 'include' });
      const json = await response.json();

      if (response.ok) setPicks(json);
    };

    fetchUsers();
    fetchPicks();
  }, [serverUrl]);

  useEffect(() => {
    const getFinalizedSeries = async () => {
      const allSeries = await (await fetch(`${serverUrl}/all-series`)).json();

      setFinalizedSeries(
        allSeries.filter(seriesGroup => seriesGroup.series.some(singleSeries => {
          const { finalized } = picks.find(pick => pick.series_id === singleSeries.seriesId) || {};

          return finalized ? singleSeries : null;
        }))
      );

      // allSeries.filter(seriesGroup => {
      //   const groupFinalized = seriesGroup.series.every(singleSeries => {
      //     const { finalized } = picks.find(pick => pick.series_id === singleSeries.seriesId) || {};

      //     return finalized ? singleSeries : null;
      //   });
        
      //   return groupFinalized ? seriesGroup : null;
      // })
    };

    getFinalizedSeries();
  }, [picks, serverUrl]);

  console.log({ finalizedSeries });

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