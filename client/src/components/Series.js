import Team from './Team';

const Series = ({ dates, series }) => {

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
};

export default Series;