import { NavLink } from 'react-router-dom';

const NavItemsDesktop = ({ user, loaded }) => {
  return (
    <div className="nav-items desktop">
      {loaded && (
        <div className="tabs">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
            <p className="home">Home</p>
          </NavLink>
          {(user && user.username_customized && user.admin) && (
            <NavLink to="/standings" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
              <p className="standings">Standings</p>
            </NavLink>
          )}
          {user && user.admin && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
              <p className="admin">Admin</p>
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
};

export default NavItemsDesktop;