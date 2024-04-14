import { useEffect, useState } from 'react';
import SeriesGroup from '../components/SeriesGroup';
import { useAuthContext } from '../hooks/useAuthContext';
import { usePicksContext } from '../hooks/usePicksContexts';

const Home = () => {
  const { user } = useAuthContext();
  const { dispatch } = usePicksContext();
  const [allSeries, setAllSeries] = useState([]);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchAllSeries = async () => {
      const response = await fetch(`${serverUrl}/all-series`);
      const json = await response.json();
      setAllSeries(json.slice(0, 12));
    };

    const fetchPicks = async () => {
      const response = await fetch(`${serverUrl}/api/picks`, { credentials: 'include' });
      const json = await response.json();
      if (response.ok) dispatch({ type: 'SET_PICKS', payload: json });
    };

    fetchAllSeries();
    if (user) fetchPicks();
  }, [dispatch, user, serverUrl]);

  console.log('allSeries: ', allSeries);

  return (
    <div className="home">      
      {allSeries.length ? allSeries.map(seriesGroup => {
        const { dates, series } = seriesGroup;
        return (
          <SeriesGroup key={dates} dates={dates} series={series} />
        )
      }) : ''}
    </div>
  )
};

export default Home;