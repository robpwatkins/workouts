import { useState, useEffect } from 'react';
import Series from './Series';
import { useAuthContext } from '../hooks/useAuthContext';
import { usePicksContext } from '../hooks/usePicksContexts';

const SeriesGroup = ({ dates, series }) => {
  const [locked, setLocked] = useState(false);
  const [wins, setWins] = useState('');
  const [losses, setLosses] = useState('');
  const { user } = useAuthContext();
  const { picks } = usePicksContext();

  useEffect(() => {
    const [startingDayStr] = dates.split('-');
    const [month, day] = startingDayStr.split('/').map(str => str.length === 1 ? `0${str}` : str);
    const startingDate = new Date(`2024-${month}-${day}T00:00:00.000-05:00`);
    const startingDateNoon = startingDate.setHours(startingDate.getHours() + 12);

    setLocked(startingDateNoon <= Date.now().valueOf());
  }, [series, dates]);

  useEffect(() => {
    if (picks && picks.length) {
      let winCount = 0;
      let lossCount = 0;
      let update = false;
  
      series.forEach(singleSeries => {
        const { seriesId } = singleSeries;
        const { finalized, successful } = picks.find(pick => pick.series_id === seriesId) || {};
        if (finalized) {
          update = true;
          if (successful) winCount++;
          else lossCount++;
        }
      })
  
      if (update) {
        setWins(winCount);
        setLosses(lossCount);
      }
    }
  }, [series, picks]);

  return (
    <div className="series-group">
      <div className="dates-and-record">
        <h3 className={`${user ? "user" : "no-user"}${locked ? " locked opaque" : " incomplete"}`}>{dates}</h3>
        <h5 className={`${user ? "d-block": "d-none"}${locked ? " opaque" : ""}`}>{`${wins}-${losses}`}</h5>
      </div>
      {series.map(singleSeries => {
        const { seriesId, seriesInfo } = singleSeries;
        const { visitor, visitorWin, home, homeWin, record, gameCount } = seriesInfo;

        return (
          <Series
            key={seriesId}
            seriesId={seriesId}
            visitor={visitor}
            visitorWin={visitorWin}
            home={home}
            homeWin={homeWin}
            record={record}
            gameCount={gameCount}
            locked={locked}
          />
        )
      })}
    </div>
  )
};

export default SeriesGroup;