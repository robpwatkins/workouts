import { useAuthContext } from './useAuthContext';
// import { useWorkoutsContext } from './useWorkoutsContext';
import { deleteAllCookies } from '../store/actions/authActions';

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  // const { dispatch: workoutsDispatch } = useWorkoutsContext();

  const logout = async () => {
    try {
      deleteAllCookies();
  
      dispatch({ type: 'LOGOUT' });
      // if (history) history.push('/');
    } catch (err) {}
    // workoutsDispatch({ type: 'SET_WORKOUTS', payload: null });
  };

  return { logout };
};