import { useEffect, useState } from 'react';
import Picks from '../components/Picks';
import Snapshot from '../components/Snapshot';
import activeUsers from '../activeUsers.json';

const Standings = () => {
  const [users, setUsers] = useState([]);
  const [picks, setPicks] = useState([]);
  const [finalizedSeries, setFinalizedSeries] = useState([]);
  const [teams, setTeams] = useState([]);
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
    const getSeriesData = async () => {
      const allSeries = await (await fetch(`${serverUrl}/all-series`)).json();

      setFinalizedSeries(
        allSeries.filter(seriesGroup => {
          return seriesGroup.series.some(singleSeries => !!singleSeries.seriesInfo.winner);
        })
      );
    };

    getSeriesData();
  }, [picks, serverUrl]);

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