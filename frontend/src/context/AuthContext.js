import { createContext, useReducer, useState, useEffect } from 'react';

export const AuthContext = createContext();

// export const authReducer = (state, action) => {
//   switch(action.type) {
//     case 'LOGIN':
//       return { user: action.payload };
//     case 'LOGOUT':
//       return { user: null };
//     default:
//       return state;
//   }
// }

export const AuthContextProvider = ({ children }) => {
  // const [state, dispatch] = useReducer(authReducer, {
  //   user: null
  // });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch('http://localhost:4001/getuser', {
        credentials: 'include'
      });
      const { user } = await response.json();
      if (user) setUser(user);
    }

    getUser();
  }, []);

  // console.log('AuthContext state: ', state);
  console.log('AuthContext user: ', user);

  return (
    <AuthContext.Provider value={{ user }}>
      { children }
    </AuthContext.Provider>
  );
};