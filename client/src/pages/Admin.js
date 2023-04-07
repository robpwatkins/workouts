const Admin = () => {
  const updateUserRecords = async (id) => {

  };

  const handleClick = async (e) => {
    e.preventDefault();

    const seriesResponse = await fetch('http://localhost:4001/all-series');
    const allSeries = await seriesResponse.json();
    
    const picksResponse = await fetch('http://localhost:4001/api/picks', { credentials: 'include' });
    const picks = await picksResponse.json();

    for (const { series: seriesGroup } of allSeries) {
      for (const singleSeries of seriesGroup) {
        const { seriesId, seriesInfo } = singleSeries;
        const { visitor, visitorWin, home, homeWin } = seriesInfo;
        if (visitorWin || homeWin) {
          const winner = visitorWin ? visitor : home;
          const seriesPicks = picks.filter(pick => pick.series_id === seriesId);

          for (const { _id, pick, user_id } of seriesPicks) {
            try {
              const options = {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  successful: pick === winner,
                  finalized: true
                })
              };
    
              const pickResponse = await fetch(`http://localhost:4001/api/picks/${_id}`, options);
  
              if (pickResponse.ok) console.log('Pick updated!');

              // const getUserResponse = await fetch('http://localhost:4001/')

              const updateUserResponse = await fetch('http://localhost:4001/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ total_wins: 4, total_losses: 6 })
              });
            } catch (error) {
              console.log('error: ', error);
            }
          }
        }
      }
    }
  };

  return (
    <form className="admin">
      <button onClick={handleClick}>UPDATE PICKS</button>
    </form>
  )
};

export default Admin;