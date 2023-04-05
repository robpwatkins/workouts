import { useState, useEffect } from 'react';
import Series from './Series';

const SeriesGroup = ({ dates, series }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(!(series.some(series => (series[1] === 'FALSE' && series[3] === 'FALSE'))));
  }, [series]);

  return (
    <div className="series-group">
      <h3 className={`${completed ? "opaque": ""}`}>{dates}</h3>
      {series.map(series => {
        const [visitor, visitorWinStr, home, homeWinStr, record] = series;
        const seriesId = `${dates}:${visitor}@${home}`;

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