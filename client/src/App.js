import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Standings from './pages/Standings';
import Picks from './pages/Picks';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Username from './pages/Username';

function App() {
  const { user, loaded } = useAuthContext();

  return (
    <div className="App">
      {loaded && (
        <BrowserRouter>
          <Navbar />
          <div className="pages">
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/standings"
                element={<Standings />}
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
                path="/picks"
                element={user ? <Picks /> : <Navigate to="/" />}
              />
              <Route
                path="/username"
                element={user ?  <Username /> : <Navigate to="/" />}
              />
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
