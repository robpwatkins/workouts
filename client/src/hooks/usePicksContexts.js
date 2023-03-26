import { PickContext } from "../context/PickContext";
import { useContext } from "react";

export const usePicksContext = () => {
  const context = useContext(PickContext);

  if (!context) {
    throw Error('usePicksContext must be used inside a WorkoutsContextProvider');
  }

  return context;
};