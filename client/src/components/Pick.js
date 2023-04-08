import teams from '../teams.json';

const Pick = ({ visitor, visitorWin, home, homeWin, pick }) => {
  const { logo: visitorLogo, colors: { primary: visitorPrimary } } = teams
    .find(team => team.abbreviation === visitor);
  const { logo: homeLogo, colors: { primary: homePrimary } } = teams
    .find(team => team.abbreviation === home);
  const successfulPick = (visitorWin && pick === visitor) || (homeWin && pick === home);
  const winner = visitorWin ? 'visitor' : 'home';
  const winnerPrimary = visitorWin ? visitorPrimary : homePrimary;
  const loserPrimary = visitorWin ? homePrimary : visitorPrimary;

  return (
    <div className="pick-card">
      <img src={visitorLogo} alt={`${visitor} logo`} />
      <span className={visitorWin ? "winner" : ""}>{visitor}</span>
      <span>@</span>
      <span className={homeWin ? "winner" : ""}>{home}</span>
      <img src={homeLogo} alt={`${home} logo`} />
      <div
        className={`bar top${successfulPick ? " d-block" : " d-none"}`}
        style={successfulPick ? { backgroundColor: winnerPrimary } : null}
      >
      </div>
      <div
        className={`bar right${successfulPick ? " d-block" : " d-none"}`}
        style={successfulPick ? { backgroundColor: winnerPrimary } : null}
      >
      </div>
      <div 
        className={`bar bottom d-block${!successfulPick ? ` ${winner}` : ""}`}
        style={{ backgroundColor: `${successfulPick ? winnerPrimary : loserPrimary}` }}
      ></div>
      <div
        className={`bar left${successfulPick ? " d-block" : " d-none"}`}
        style={successfulPick ? { backgroundColor: winnerPrimary } : null}
      >
      </div>
    </div>
  )
};

export default Pick;