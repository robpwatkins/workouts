import { useAuthContext } from './useAuthContext';
// import { useWorkoutsContext } from './useWorkoutsContext';

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  // const { dispatch: workoutsDispatch } = useWorkoutsContext();

  const logout = async () => {
    try {
      await fetch('http://localhost:4001/logout', {
        method: 'POST',
        credentials: 'include',
      });

      dispatch({ type: 'LOGOUT' });
    } catch (err) {}
    // workoutsDispatch({ type: 'SET_WORKOUTS', payload: null });
  };

  return { logout };
};