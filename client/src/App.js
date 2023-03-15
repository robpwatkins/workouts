import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

import Home from './pages/Home';
import Standings from './pages/Standings';
import Picks from './pages/Picks';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';

function App() {
  const { user, loading } = useAuthContext();

  return (
    <div className="App">
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
              path="/picks"
              element={<Picks />}
            />
            <Route
              path="/login"
              element={!loading && (!user ? <Login /> : <Navigate to="/" />)}
              />
            <Route
              path="/signup"
              element={!loading && (!user ? <Signup /> : <Navigate to="/" />)}
              />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
