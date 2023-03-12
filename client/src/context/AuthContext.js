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
    case 'ERROR':
      return { error: action.payload }
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
    const loginUserWithOauth = async () => {
      dispatch({ type: 'LOADING', payload: true });

      try {
        const response = await fetch('http://localhost:4001/getuser', { credentials: 'include' });
        const { user, error } = await response.json();

        if (error) dispatch({ type: 'ERROR', payload: error });
        else dispatch({ type: 'LOGIN', payload: user });
      } catch (error) {
        console.log('error: ', error);
        dispatch({ type: 'LOADING', payload: false });
      }
    }

    loginUserWithOauth();
  }, []);

  console.log('AuthContext state: ', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  );
};