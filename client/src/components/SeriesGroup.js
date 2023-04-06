import { useState, useEffect } from 'react';
import Series from './Series';
import { useAuthContext } from '../hooks/useAuthContext';
import { usePicksContext } from '../hooks/usePicksContexts';

const SeriesGroup = ({ dates, series }) => {
  const [completed, setCompleted] = useState(false);
  const [wins, setWins] = useState('');
  const [losses, setLosses] = useState('');
  const { user } = useAuthContext();
  const { picks } = usePicksContext();

  useEffect(() => {
    setCompleted(!(series.some(singleSeries => (
      singleSeries.seriesInfo[1] === 'FALSE' && singleSeries.seriesInfo[3] === 'FALSE'
    ))));
  }, [series]);

  useEffect(() => {
    let runningWins = 0;
    let runningLosses = 0;
    let update = false;

    series.forEach(singleSeries => {
      const { seriesId } = singleSeries;
      const { finalized, successful } = picks.find(pick => pick.series_id === seriesId) || {};
      if (finalized) {
        update = true;
        if (successful) runningWins++;
        else runningLosses++;
      }
    })

    if (update) {
      setWins(runningWins);
      setLosses(runningLosses);
    }
  }, [series, picks]);

  return (
    <div className="series-group">
      <div className="dates-and-record">
        <h3 className={`${user ? "user" : "no-user"}${completed ? " completed opaque" : " incomplete"}`}>{dates}</h3>
        <h5 className={`${user ? "d-block": "d-none"}${completed ? " opaque" : ""}`}>{`${wins}-${losses}`}</h5>
      </div>
      {series.map(singleSeries => {
        const { seriesId, seriesInfo } = singleSeries;
        const [visitor, visitorWinStr, home, homeWinStr, record] = seriesInfo;

        return (
          <Series
            key={seriesId}
            seriesId={seriesId}
            visitor={visitor}
            visitorWin={visitorWinStr === 'TRUE'}
            home={home}
            homeWin={homeWinStr === 'TRUE'}
            record={record}
          />
        )
      })}
    </div>
  )
};

export default SeriesGroup;