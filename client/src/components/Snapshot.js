const Snapshot = ({ users }) => {
  return (
    <table className="snapshot">
      <thead>
        <tr>
          <th></th>
          <th>Wins</th>
          <th>Losses</th>
          <th>PCT.</th>
          <th>Sweeps</th>
          <th>Streak</th>
        </tr>
      </thead>
      <tbody>
        {users
          .sort((a, b) => b.win_pct - a.win_pct)
          .map(user => {
            const { username, total_wins, total_losses, win_pct, sweeps } = user;
            
            return (
              <tr key={username}>
                <td>{username}</td>
                <td>{total_wins}</td>
                <td>{total_losses}</td>
                <td>{win_pct.toFixed(3)}</td>
                <td>{sweeps}</td>
                <td>-</td>
              </tr>
            )
          })}
      </tbody>
    </table>
  );
};

export default Snapshot;