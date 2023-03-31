import Team from './Team';

const Series = ({
  seriesId,
  pick,
  visitor,
  visitorWin,
  visitorClassList,
  visitorPrimary,
  visitorLogo,
  home,
  homeWin,
  homeClassList,
  homePrimary,
  homeLogo,
}) => {

  return (
    <div className={`series-card${(visitorWin || homeWin) ? " opaque" : ''}`}>
      <Team
        key={`${seriesId}-${visitor}`}
        classList={visitorClassList}
        teamPrimary={visitorPrimary}
        logo={visitorLogo}
        team={visitor}
        type="visitor"
        pick={pick}
      />
      <span>@</span>
      <Team
        key={`${seriesId}-${home}`}
        classList={homeClassList}
        teamPrimary={homePrimary}
        logo={homeLogo}
        team={home}
        type="home"
        pick={pick}
      />
    </div>
  )
};

export default Series;