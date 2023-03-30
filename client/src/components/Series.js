import { usePicksContext } from '../hooks/usePicksContexts';
import teams from '../teams.json';
import Team from './Team';

const Series = ({ dates, series }) => {
  const { picks } = usePicksContext();

  return (
    <>
      {series.map(series => {
        const [visitor, visitorWinStr, home, homeWinStr] = series;
        const visitorWin = visitorWinStr === 'TRUE';
        const homeWin = homeWinStr === 'TRUE';
        const seriesId = `${dates}:${visitor}@${home}`;
        const { pick } = picks ? (picks.find(pick => pick.series_id === seriesId) || {}) : {};
        const visitorClassList = `${seriesId} ${visitor} visitor ${visitorWin ? " winner" : ""}`;
        const homeClassList = `${seriesId} ${home} home ${homeWin ? " winner": ""}`;
        const successfulPick =  (visitorWin && pick === visitor) || (homeWin && pick === home);
        const {
          logo: visitorLogo,
          colors: { first: visitorPrimary }
        } = teams.find(team => team.abbreviation === visitor);
        const {
          logo: homeLogo,
          colors: { first: homePrimary }
        } = teams.find(team => team.abbreviation === home);
        return (
          <div key={seriesId} className={`series-card${(visitorWin || homeWin) ? " opaque" : ''}`}>
            <Team
              classList={visitorClassList}
              teamPrimary={visitorPrimary}
              logo={visitorLogo}
              team={visitor}
              type="visitor"
              pick={pick}
            />
            <span>@</span>
            <Team 
              classList={homeClassList}
              teamPrimary={homePrimary}
              logo={homeLogo}
              team={home}
              type="home"
              pick={pick}
            />
          </div>
        );
      })}
    </>
  )
};

export default Series;