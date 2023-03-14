import { useEffect, useState } from 'react';
// import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
// import { useAuthContext } from '../hooks/useAuthContext';

// import WorkoutDetails from '../components/WorkoutDetails';
// import WorkoutForm from '../components/WorkoutForm';
import TeamDetails from '../components/TeamDetails';
import TeamForm from '../components/TeamsForm';

const Home = () => {
  // const { workouts, dispatch } = useWorkoutsContext();
  // const { user } = useAuthContext();
  const [teams, setTeams] = useState([]);

  // useEffect(() => {
  //   const fetchWorkouts = async () => {
  //     const response = await fetch('/api/workouts', {
  //       headers: { 'Authorization': `Bearer ${user.token}` }
  //     });
  //     const json = await response.json();

  //     if (response.ok) dispatch({ type: 'SET_WORKOUTS', payload: json });
  //   }

  //   if (user) fetchWorkouts();
  //   if (user) console.log('Home user: ', user);
  // }, [dispatch, user]);

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch('/api/teams');
      const json = await response.json();

      if (response.ok) setTeams(json);
    }

    fetchTeams();
  }, [teams]);

  return (
    <div className="home">
      {/* <div className="workouts">
        {workouts && workouts.map(workout => (
          <WorkoutDetails key={workout._id} workout={workout} />
        ))}
      </div>
      <WorkoutForm /> */}
      <div className="teams">
        {teams && teams.map(team => (
          <TeamDetails key={team._id} team={team} />
        ))}
      </div>
      <TeamForm />
    </div>
  )
}

export default Home;