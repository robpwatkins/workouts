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
      <span>{successfulPick ? "✓" : "✕"}</span>
    </div>
  )
};

export default Pick;