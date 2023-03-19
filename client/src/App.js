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
  const { user, loading } = useAuthContext();
  console.log('App user: ', user);

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
            <Route
              path="/username"
              element={<Username />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
