import Series from './Series';
import teams from '../teams.json';
import { usePicksContext } from '../hooks/usePicksContexts';

const SeriesGroup = ({ dates, series }) => {
  const { picks } = usePicksContext();

  return (
    <div className="series-group">
      <h3>{dates}</h3>
      {series.map(series => {
        const [visitor, visitorWinStr, home, homeWinStr] = series;
        const visitorWin = visitorWinStr === 'TRUE';
        const homeWin = homeWinStr === 'TRUE';
        const seriesId = `${dates}:${visitor}@${home}`;
        const { pick } = picks ? (picks.find(pick => pick.series_id === seriesId) || {}) : {};
        const visitorClassList = `${seriesId} ${visitor} visitor ${visitorWin ? " winner" : ""}`;
        const homeClassList = `${seriesId} ${home} home ${homeWin ? " winner": ""}`;
        // const successfulPick =  (visitorWin && pick === visitor) || (homeWin && pick === home);
        const {
          logo: visitorLogo,
          colors: { first: visitorPrimary }
        } = teams.find(team => team.abbreviation === visitor);
        const {
          logo: homeLogo,
          colors: { first: homePrimary }
        } = teams.find(team => team.abbreviation === home);
        return (
          <Series
            key={seriesId}
            seriesId={seriesId}
            pick={pick}
            visitor={visitor}
            visitorWin={visitorWin}
            visitorClassList={visitorClassList}
            visitorLogo={visitorLogo}
            visitorPrimary={visitorPrimary}
            home={home}
            homeWin={homeWin}
            homeClassList={homeClassList}
            homeLogo={homeLogo}
            homePrimary={homePrimary}
          />
        )
      })}
    </div>
  )
};

export default SeriesGroup;