const Pick = ({ visitor, visitorWin, home, homeWin, pick }) => {
  const successfulPick = (visitorWin && pick === visitor) || (homeWin && pick === home);

  return (
    <div className="pick">
      <span>{successfulPick ? "✓" : "✕"}</span>
    </div>
  )
};

export default Pick;