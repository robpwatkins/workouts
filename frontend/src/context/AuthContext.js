import { createContext, useReducer, useEffect } from 'react';
// import { useLogin } from '../hooks/useLogin';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOADING':
      return { loading: action.payload }
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
  // const { loginUserWithOauth } = useLogin();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find(row => row.startsWith("x-auth-cookie="))
      ?.split("=")[1];

    if (token) {
      const loginUserWithOauth = async () => {
        dispatch({ type: 'LOADING', payload: true });
  
        try {
          const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          };
      
          const response = await fetch('http://localhost:4001/api/user/me', { headers });
          const { me: user } = await response.json();
  
          dispatch({ type: 'LOGIN', payload: user });
        } catch (error) {
          console.log('error: ', error);
          dispatch({ type: 'LOADING', payload: false });
        }
      }
  
      loginUserWithOauth(token);
    }
  }, []);

  console.log('AuthContext state: ', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  );
};