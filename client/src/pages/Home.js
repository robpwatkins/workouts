import { useEffect, useState } from 'react';

const Home = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch('http://localhost:4001/users', { credentials: 'include' });
      const users = await response.json();
      
      setUsers(users);
    }

    getUsers();
  }, []);

  const handleClick = async (e) => {
    const { id: username } = e.target;
    await fetch(`http://localhost:4001/user/delete/${username}`, {
      method: 'DELETE',
    });
    let tempUsers = users.slice();
    tempUsers.splice(e.target.classList[0], 1);
    setUsers(tempUsers);
  }

  return (
    <div>
      {users.length ? users.map((user, idx) => (
        <p
          key={user.username}
          id={user.username}
          className={`${idx} user`}
          onClick={e => handleClick(e)}
        >
          {user.username}
        </p>
      )) : ''}
    </div>
  )
};

export default Home;