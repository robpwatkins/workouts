import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Standings from './pages/Standings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Username from './pages/Username';
import Users from './pages/Users';
import Admin from './pages/Admin';

function App() {
  const { user, loaded } = useAuthContext();
  console.log('user: ', user);

  return (
    <div className="App">
      {loaded && (
        <BrowserRouter>
          <Navbar />
          <div className="pages">
            <Routes>
              <Route
                path="/"
                element={(user && !user.username_customized) ? <Username /> : <Home />}
              />
              <Route
                path="/standings"
                element={user ? (!user.username_customized ? <Username /> : <Standings />) : <Navigate to="/" />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" />}
              />
              <Route
                path="/username"
                element={user ?  <Username /> : <Navigate to="/" />}
              />
              <Route
                path="/users"
                element={<Users />}
              />
              <Route
                path="/admin"
                element={(user && user.admin) ? <Admin /> : <Navigate to="/" />}
              />
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
