import { Link } from 'react-router-dom';
// import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  // const { logout } = useLogout();
  const { user } = useAuthContext();

  // const handleClick = () => logout();

  const logout = async () => {
    const response = await fetch('http://localhost:4001/auth/logout', {
      credentials: 'include'
    })
    console.log('response: ', response);

    const json = await response.json();
    if (json === 'done') window.location.href = '/';

    // axios.get("http://localhost:4001/auth/logout", {
    //     withCredentials: true
    // }).then((res: AxiosResponse) => {
    //     if (res.data === "done") {
    //         window.location.href = "/"
    //     }
    // })
}

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>MLB Fantasy</h1>
        </Link>
        <nav>
          {user && (
            <div>
              <span>{user.email}</span>
              <button onClick={logout}>Logout</button>
            </div>
          )}
          {!user && (
            <div>
              <Link className="signup" to="/signup">Signup</Link>
              <Link className="login" to="/login">Login</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar;