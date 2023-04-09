import { useState, useEffect } from 'react';
import Pick from "./Pick";

const Picks = ({ user, picks, seriesGroup }) => {
  const [wins, setWins] = useState('');
  const [losses, setLosses] = useState('');

  const { dates, series } = seriesGroup;

  useEffect(() => {
    const seriesPicks = picks.filter(pick => {
      const [pickDates] = pick.series_id.split(':');
      return (pick.user_id === user._id && pickDates === seriesGroup.dates)
        ? pick
        : null;
    });

    if (seriesPicks.length) {
      let winCount = 0;
      let lossCount = 0;
      let update = false;
  
      series.forEach(singleSeries => {
        const { seriesId } = singleSeries;
        const { finalized, successful } = seriesPicks.find(pick => pick.series_id === seriesId) || {};
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
  }, [picks, series, seriesGroup.dates, user._id]);

  return (
    <div className="series-picks">
      <div className="dates-and-record">
        <h5>{wins}-{losses}</h5>
      </div>
      {series.map(singleSeries => {
        const { seriesId, seriesInfo } = singleSeries;
        const { visitor, visitorWin, home, homeWin } = seriesInfo;
        const { pick } = picks.find(pick => pick.series_id === seriesId);

        return (
          <Pick
            key={seriesId}
            visitor={visitor}
            visitorWin={visitorWin}
            home={home}
            homeWin={homeWin}
            pick={pick}
          />
        )
      })}
    </div>
  )
};

export default Picks;