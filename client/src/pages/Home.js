import { useEffect, useState } from 'react';
import SeriesGroup from '../components/SeriesGroup';
import { useAuthContext } from '../hooks/useAuthContext';
import { usePicksContext } from '../hooks/usePicksContexts';

const Home = () => {
  const { user } = useAuthContext();
  const { dispatch } = usePicksContext();
  const [allSeries, setAllSeries] = useState([]);

  useEffect(() => {
    const fetchAllSeries = async () => {
      const response = await fetch('/all-series');
      const json = await response.json();
      setAllSeries(json.slice(0, 5));
    };

    const fetchPicks = async () => {
      const response = await fetch('/api/picks', { credentials: 'include' });
      const json = await response.json();
      if (response.ok) dispatch({ type: 'SET_PICKS', payload: json });
    };

    fetchAllSeries();
    if (user) fetchPicks();
  }, [dispatch, user]);

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