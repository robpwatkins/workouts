import { useEffect, useState } from 'react';
import SeriesGroup from '../components/SeriesGroup';
import { useAuthContext } from '../hooks/useAuthContext';
import { usePicksContext } from '../hooks/usePicksContexts';

const Home = () => {
  const { user } = useAuthContext();
  const { picks, dispatch } = usePicksContext();
  const [allSeries, setAllSeries] = useState([]);

  useEffect(() => {
    const fetchAllSeries = async () => {
      const response = await fetch('http://localhost:4001/all-series');
      const json = await response.json();
      setAllSeries(json.slice(0, 5));
    };

    const fetchPicks = async () => {
      const response = await fetch('http://localhost:4001/api/picks', { credentials: 'include' });
      const json = await response.json();
      if (response.ok) dispatch({ type: 'SET_PICKS', payload: json });
    };

    fetchAllSeries();
    if (user) fetchPicks();
  }, [dispatch, user]);

  useEffect(() => {
    const setSuccessfulPicks = async () => {
      for (const { series: seriesGroup } of allSeries) {
        for (const singleSeries of seriesGroup) {
          const { seriesId, seriesInfo } = singleSeries;
          const [visitor, visitorWinStr, home, homeWinStr] = seriesInfo;
          if (visitorWinStr === 'TRUE' || homeWinStr === 'TRUE') {
            const winner = visitorWinStr === 'TRUE' ? visitor : home;
            const { _id, finalized, pick } = picks.find(pick => pick.series_id === seriesId);

            if (!finalized) {
              const options = {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  successful: pick === winner,
                  finalized: true
                })
              };
  
              const response = await fetch(`http://localhost:4001/api/picks/${_id}`, options);
              const json = await response.json();

              if (response.ok) dispatch({ type: 'SET_PICKS', payload: json });
            }
          }
        }
      }
    };
    
    if (user && allSeries.length) setSuccessfulPicks();
  }, [allSeries, user, picks, dispatch]);

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