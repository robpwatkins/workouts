import { createContext, useReducer } from "react";

export const PickContext = createContext();

export const picksReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PICKS': 
      return { picks: action.payload };
    case 'CREATE_PICK':
      return { picks: [action.payload, ...state.picks] };
    case 'DELETE_PICK':
      return { picks: state.picks.filter(pick => pick._id !== action.payload._id) }
    default:
      return state;
  }
}

export const PickContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(picksReducer, { picks: null });

  return (
    <PickContext.Provider value={{ ...state, dispatch }}>
      { children }
    </PickContext.Provider>
  )
}