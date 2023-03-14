const TeamDetails = ({ team }) => {
  return (
    <div style={{ border: `2px solid ${team.secondary}` }} className="team-details">
      <h1 style={{ color: team.primary }}>{team.name}</h1>
      <h3>{team.abbreviation}</h3>
      <h4>Primary: <span style={{ color: team.primary }}>{team.primary}</span></h4>
      <h4>Secondary: <span style={{ color: team.secondary }}>{team.secondary}</span></h4>
    </div>
  )
}

export default TeamDetails;