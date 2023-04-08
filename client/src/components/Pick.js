const Pick = ({ visitor, visitorWin, home, homeWin }) => {
  return (
    <div className="pick">
      <span>{visitor}</span>
      <span>@</span>
      <span>{home}</span>
    </div>
  )
};

export default Pick;