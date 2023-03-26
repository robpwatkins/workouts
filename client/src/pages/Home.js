import { useEffect, useState } from 'react';
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
      setAllSeries([json[0]]);
    };

    const fetchPicks = async () => {
      const response = await fetch('http://localhost:4001/api/picks', { credentials: 'include' });
      const json = await response.json();
      if (response.ok) dispatch({ type: 'SET_PICKS', payload: json });
    };

    fetchAllSeries();
    if (user) fetchPicks();
  }, [dispatch, user]);

  const handleClick = async (e) => {
    const { className: series_id, innerText: pick } = e.target;

    const currentPick = picks.find(pick => pick.series_id === series_id);

    const options = {
      method: currentPick ? 'PATCH' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...currentPick && { series_id }, pick })
    }

    const url = `http://localhost:4001/api/picks${currentPick ? `/${currentPick._id}` : ''}`;

    const response = await fetch(url, options);
    const json = await response.json();

    if (!currentPick) dispatch({ type: 'CREATE_PICK', payload: json });
    else {
      const updatedPicks = picks.map(pick => pick._id === json._id ? json : pick);
      dispatch({ type: 'SET_PICKS', payload: updatedPicks });
    }
  };

  return (
    <div className="home">
      {allSeries.length ? allSeries.map(seriesGroup => {
        const { date_range, series } = seriesGroup;
        return (
          <div key={date_range} className="series-group">
            <h3>{date_range}</h3>
            {series.map(series => {
              const [visitor, home] = series.teams;
              const seriesId = `${date_range}:${visitor}@${home}`;
              const { pick } = picks ? (picks.find(pick => pick.series_id === seriesId) || {}) : {};
              return (
                <div key={seriesId}>
                  <button
                    className={`${seriesId}${pick === visitor ? " picked" : ""}`}
                    onClick={handleClick}
                  >
                    {visitor}
                  </button>
                  <span>@</span>
                  <button
                    className={`${seriesId}${pick === home ? " picked" : ""}`}
                    onClick={handleClick}
                  >
                    {home}
                  </button>
                </div>
              );
            })}
          </div>
        )
      }) : ''}
    </div>
  )
};

export default Home;