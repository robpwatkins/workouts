import { useState, useRef, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import useOnClickOutside from '../hooks/useOutsideClick';

const Navbar = () => {
  const { logout } = useLogout();
  const { user, loading } = useAuthContext();
  const [active, setActive] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, useCallback(() => {
    setActive(false);
  }, []));

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
              <span className="username" onClick={() => setActive(!active)}>
                {user.username}
                <FontAwesomeIcon className="down-chevron" icon={faCaretDown} />
              </span>
              <Link
                className={`dropdown-toggle${!active ? " d-none" : ""}`}
                to="/username"
                ref={ref}
                onClick={() => setActive(false)}
              >
                Update username
              </Link>
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