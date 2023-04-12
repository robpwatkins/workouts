import { createContext, useReducer, useEffect } from 'react';
// import { useLogin } from '../hooks/useLogin';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':
      return { user: action.payload, loaded: true };
    case 'LOGOUT':
      return { user: null, loaded: true };
    case 'LOADED':
      return { loaded: action.payload };
    case 'ERROR':
      return { error: action.payload, loaded: true };
    default:
      return state;
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  });
  // const { loginUserWithSession } = useLogin();

  useEffect(() => {
    const loginUserWithSession = async () => {
      dispatch({ type: 'LOADED', payload: false });

      try {
        const response = await fetch('/user', { credentials: 'include' });
        const { user, error } = await response.json();

        if (error) return dispatch({ type: 'ERROR', payload: error });
        if (!user) return dispatch({ type: 'LOADED', payload: true });
        return dispatch({ type: 'LOGIN', payload: user });
      } catch (error) {
        console.log('error: ', error);
        dispatch({ type: 'LOADED', payload: true });
      }
    }

    loginUserWithSession();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  );
};