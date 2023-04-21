import { useState, useRef, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import useOnClickOutside from '../hooks/useOutsideClick';

const Navbar = () => {
  const { logout } = useLogout();
  const { user, loaded } = useAuthContext();
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
        {loaded && (
          <div className="tabs">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
              <p className="home">Home</p>
            </NavLink>
            {user && user.username_customized && (
              <NavLink to="/standings" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
                <p className="standings">Standings</p>
              </NavLink>
            )}
          </div>
        )}
        <div className="account">
          {(loaded && user) && (
            <div>
              {user.username_customized && (
                <button className="username" onClick={() => setActive(!active)}>
                  <span>{user.username}</span>
                  <FontAwesomeIcon className="down-chevron" icon={faCaretDown} />
                </button>
              )}
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
          {(loaded && !user) && (
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