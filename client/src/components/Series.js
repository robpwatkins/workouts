import Team from './Team';
import { usePicksContext } from '../hooks/usePicksContexts';
import teams from '../teams.json';

const Series = ({ seriesId, visitor, visitorWin, home, homeWin, record }) => {
  const { picks } = usePicksContext();

  const { pick } = (picks && picks.length) ? (picks.find(pick => pick.series_id === seriesId) || {}) : {};
  const { logo: visitorLogo, colors: { primary: visitorPrimary } } = teams
    .find(team => team.abbreviation === visitor);
  const { logo: homeLogo, colors: { primary: homePrimary } } = teams
    .find(team => team.abbreviation === home);
  const successfulPick = (visitorWin && pick === visitor) || (homeWin && pick === home);

  return (
    <div className={`series-card${(visitorWin || homeWin) ? " opaque" : ''}`}>
      <Team
        key={`${seriesId}-${visitor}`}
        seriesId={seriesId}
        team={visitor}
        type="visitor"
        win={visitorWin}
        record={record}
        logo={visitorLogo}
        primary={visitorPrimary}
        successfulPick={successfulPick}
        opponentPrimary={(successfulPick && pick === home) ? homePrimary : null}
      />
      <span className="at">@</span>
      <Team
        key={`${seriesId}-${home}`}
        seriesId={seriesId}
        team={home}
        type="home"
        win={homeWin}
        record={record}
        logo={homeLogo}
        primary={homePrimary}
        successfulPick={successfulPick}
        opponentPrimary={(successfulPick && pick === visitor) ? visitorPrimary : null}
      />
    </div>
  )
};

export default Series;