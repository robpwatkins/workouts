import { useEffect, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch('/users', { credentials: 'include' });
      const users = await response.json();
      
      setUsers(users);
    }

    getUsers();
  }, []);

  const handleClick = async (e) => {
    const { id: username } = e.target;
    await fetch(`/user/delete/${username}`, {
      method: 'DELETE',
    });
    let tempUsers = users.slice();
    const userIdx = tempUsers.findIndex(user => user.username === username);
    tempUsers.splice(userIdx, 1);
    setUsers(tempUsers);
  }

  return (
    <div>
      {users.length ? users
        .filter(user => user.username_customized)
        .map(user => (
          <div key={user.username} className="home">
            <p>
              <b>{user.username}: </b> {user.email}
            </p>
            <p
              id={user.username}
              className="delete-user"
              onClick={e => handleClick(e)}
            >
              x
            </p>
          </div>
        )
      ) : ''}
    </div>
  )
};

export default Users;