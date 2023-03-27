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
      setAllSeries(json.slice(0, 2));
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
      body: JSON.stringify({ ...!currentPick && { series_id }, pick })
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
        const { dates, series } = seriesGroup;
        return (
          <div key={dates} className="series-group">
            <h3>{dates}</h3>
            {series.map(series => {
              const [visitor, visitorWin, home, homeWin] = series;
              const seriesId = `${dates}:${visitor}@${home}`;
              const { pick } = picks ? (picks.find(pick => pick.series_id === seriesId) || {}) : {};
              const visitorClassList = `${seriesId}${pick === visitor ? " picked" : ""}${visitorWin === 'TRUE' ? " winner" : ""}`;
              const homeClassList = `${seriesId}${pick === home ? " picked" : ""}${homeWin === 'TRUE' ? " winner": ""}`;
              return (
                <div key={seriesId}>
                  <button className={visitorClassList} onClick={handleClick}>
                    {visitor}
                  </button>
                  <span>@</span>
                  <button className={homeClassList} onClick={handleClick}>
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