import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { usePicksContext } from '../hooks/usePicksContexts';
import teams from '../teams.json';

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

  const handleClick = async (e) => {
    if (!user) return;

    const [series_id, pick] = (e.target.matches('img') ? e.target.parentElement : e.target).classList;

    const currentPick = picks.find(pick => pick.series_id === series_id);

    const options = {
      method: currentPick ? 'PATCH' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pick, ...!currentPick && { series_id } })
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
              const visitorClassList = `${seriesId} ${visitor} visitor ${pick === visitor ? " picked" : ""}${visitorWin === 'TRUE' ? " winner" : ""}`;
              const homeClassList = `${seriesId} ${home} home ${pick === home ? " picked" : ""}${homeWin === 'TRUE' ? " winner": ""}`;
              const {
                logo: visitorLogo,
                colors: { first: visitorPrimary }
              } = teams.find(team => team.abbreviation === visitor);
              const {
                logo: homeLogo,
                colors: { first: homePrimary }
              } = teams.find(team => team.abbreviation === home);
              return (
                <div key={seriesId} className="series-card">
                  <button className={visitorClassList} onClick={handleClick} style={{ borderBottomColor: visitorPrimary }}>
                    <div className="overlay"></div>
                    <img src={visitorLogo} alt="" />
                    {visitor}
                  </button>
                  <span>@</span>
                  <button className={homeClassList} onClick={handleClick} style={{ borderBottomColor: homePrimary }}>
                    {home}
                    <img src={homeLogo} alt="" />
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