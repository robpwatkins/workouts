import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faX, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import NavItemsDesktop from './NavItemsDesktop';
import NavItemsMobile from './NavItemsMobile';
import useOnClickOutside from '../hooks/useOutsideClick';

const Navbar = () => {
  const { logout } = useLogout();
  const { user, loaded } = useAuthContext();
  const ref = useRef();
  const [refActive, setRefActive] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useOnClickOutside(ref, useCallback(() => {
    setRefActive(false);
  }, [setRefActive]));

  useEffect(() => {
    if (mobileNavOpen) document.querySelector('body').style.overflow = 'hidden';
    else document.querySelector('body').style.overflow = 'scroll';
  }, [mobileNavOpen]);

  const handleClick = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  return (
    <nav className="container">
      <div className="toggle">
        <FontAwesomeIcon
          className={`fa-solid fa-${mobileNavOpen ? 'bars' : 'x'}`}
          onClick={handleClick}
          icon={mobileNavOpen ? faX : faBars}
        />
      </div>
      <Link to="/" className="title">
        <h1>The Series Challenge</h1>
      </Link>
      <NavItemsMobile
        user={user}
        loaded={loaded}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />
      <NavItemsDesktop user={user} loaded={loaded} />
      <div className="account">
        {(loaded && user) && (
          <div>
            {user.username_customized && (
              <button className="username" onClick={() => setRefActive(!refActive)}>
                <span>{user.username}</span>
                <FontAwesomeIcon className="down-chevron" icon={faCaretDown} />
              </button>
            )}
            <Link
              className={`dropdown-toggle${!refActive ? " d-none" : ""}`}
              to="/username"
              ref={ref}
              onClick={() => setRefActive(false)}
            >
              Update username
            </Link>
            <button onClick={logout} className="logout">Logout</button>
          </div>
        )}
        {(loaded && !user) && (
          <div>
            <Link className="signup" to="/signup">Signup</Link>
            <Link className="login" to="/login">Login</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar;