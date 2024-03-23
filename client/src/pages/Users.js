import { useEffect, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(`${serverUrl}/users`, { credentials: 'include' });
      const users = await response.json();
      
      setUsers(users);
    }

    getUsers();
  }, [serverUrl]);

  const handleClick = async (e) => {
    const { id: username } = e.target;
    await fetch(`${serverUrl}/user/delete/${username}`, { method: 'DELETE' });
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