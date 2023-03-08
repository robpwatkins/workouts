import { createContext, useReducer, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  });

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem('user'));

    // if (user) dispatch({ type: 'LOGIN', payload: user });
    const loginUserWithOauth = async (token) => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        };
    
        const response = await fetch('http://localhost:4001/api/user/me', { headers });
        const user = await response.json();

        if (user) dispatch({ type: 'LOGIN', payload: user });
      } catch (error) {
        console.log('error: ', error);
      }
    }

    const token = document.cookie
      .split("; ")
      .find(row => row.startsWith("x-auth-cookie="))
      ?.split("=")[1];

    console.log('token: ', token);

    loginUserWithOauth(token);
  }, []);

  console.log('AuthContext state: ', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  );
};