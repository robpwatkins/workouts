const Snapshot = ({ users }) => {
  return (
    <table className="snapshot">
      <thead>
        <tr>
          <th></th>
          <th>Wins</th>
          <th>Losses</th>
          <th>PCT.</th>
          <th>Streak</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.username}>
            <td>{user.username}</td>
            <td>{user.total_wins}</td>
            <td>{user.total_losses}</td>
            <td>{(user.total_wins / (user.total_wins + user.total_losses)).toFixed(3)}</td>
            <td>-</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Snapshot;