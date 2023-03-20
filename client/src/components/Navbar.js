import { Link, NavLink } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const { logout } = useLogout();
  const { user, loading } = useAuthContext();

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>MLB Fantasy</h1>
        </Link>
        <div className="tabs">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
            <p>Home</p>
          </NavLink>
          <NavLink to="/standings" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
            <p>Standings</p>
          </NavLink>
          {(!loading && user) && (
            <NavLink to="/picks" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
              <p>Picks</p>
            </NavLink>
          )}
        </div>
        <div className="account">
          {(!loading && user) && (
            <div>
              <span>{user.username}</span>
              <button onClick={logout}>Logout</button>
            </div>
          )}
          {(!loading && !user) && (
            <div>
              <Link className="signup" to="/signup">Signup</Link>
              <Link className="login" to="/login">Login</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar;