import { useEffect, useState } from 'react';

const Standings = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch('http://localhost:4001/users', { credentials: 'include' });
      const users = await response.json();
      
      setUsers(users);
    }

    getUsers();
  }, []);

  return (
    <div className="standings">
      {users.length ? users.map(user => (
        <h3 key={user.username}>{user.username}</h3>
      )) : ''}
    </div>
  )
};

export default Standings;