const Snapshot = ({ users }) => {
  return (
    <div className="snapshot">
      <div className="headings">
        <p className="heading"></p>
        <p className="heading">Wins</p>
        <p className="heading">Losses</p>
        <p className="heading">PCT.</p>
        <p className="heading">Streak</p>
      </div>
      {users.length ? (users.map(user => (
        <div key={`snapshot-${user.username}`} className="values">
          <p>{user.username}</p>
          <p>{user.total_wins}</p>
          <p>{user.total_losses}</p>
          <p>{(user.total_wins / (user.total_wins + user.total_losses)).toFixed(3)}</p>
          <p>-</p>
        </div>
      ))) : ''}
    </div>
  )
};

export default Snapshot;