const TeamDetails = ({ team }) => {
  return (
    <div style={{ border: `4px solid ${team.colors.second || team.colors.first}` }} className="team-details">
      <h1 style={{ color: team.colors.first }}>{team.name}</h1>
      <h2>{team.abbreviation}</h2>
      <h3>First: <span style={{ color: team.colors.first }}>{team.colors.first}</span></h3>
      {team.colors.second && (
        <h3>Second: <span style={{ color: team.colors.second }}>{team.colors.second}</span></h3>
      )}
      {team.colors.third && (
        <h3>Third: <span style={{ color: team.colors.third }}>{team.colors.third}</span></h3>
      )}
      {team.colors.fourth && (
        <h3>Fourth: <span style={{ color: team.colors.fourth }}>{team.colors.fourth}</span></h3>
      )}
      {team.colors.fifth && (
        <h3>Fifth: <span style={{ color: team.colors.fifth }}>{team.colors.fifth}</span></h3>
      )}
    </div>
  )
}

export default TeamDetails;