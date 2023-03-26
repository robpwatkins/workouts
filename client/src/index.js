import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { PickContextProvider } from './context/PickContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <PickContextProvider>
      <App />
    </PickContextProvider>
  </AuthContextProvider>
);
