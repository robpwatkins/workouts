import { NavLink } from 'react-router-dom';

const NavItemsMobile = ({ user, loaded, mobileNavOpen, setMobileNavOpen }) => {
  return (
    <div className={`nav-items mobile ${mobileNavOpen ? 'open' : 'closed'}`}>
      {loaded && (
        <div className="tabs">
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? 'active' : 'inactive'}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <p className="home">Home</p>
          </NavLink>
          {/* {user && user.username_customized && (
            <NavLink
              to="/standings" className={({ isActive }) => isActive ? 'active' : 'inactive'}
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              <p className="standings">Standings</p>
            </NavLink>
          )} */}
          {user && user.admin && (
            <NavLink
              to="/admin" className={({ isActive }) => isActive ? 'active' : 'inactive'}
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              <p className="admin">Admin</p>
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
};

export default NavItemsMobile;