import { useEffect, useState } from 'react';

const Standings = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch('http://localhost:4001/users', { credentials: 'include' });
      const users = await response.json();
      
      const sortedUsers = users.sort((a, b) => a.total_wins + b.total_wins);

      setUsers(sortedUsers);
    }

    getUsers();
  }, []);

  return (
    <div className="standings">
      <div className="snapshot">
        <div className="headings">
          <h4></h4>
          <h4>Wins</h4>
          <h4>Losses</h4>
          <h4>PCT.</h4>
          <h4>Streak</h4>
        </div>
        {users.length ? (users.map(user => (
          <p key={user.username}><b>{user.username}</b></p>)
        )) : ''}
      </div>
    </div>
  )
};

export default Standings;