import { useState } from 'react';
// import { useAuthContext } from '../hooks/useAuthContext';
import { isMobile } from 'react-device-detect';
import { usePicksContext } from '../hooks/usePicksContexts';

const Team = ({ seriesId, team, type, win, record, logo, primary, successfulPick, opponentPrimary, concluded }) => {
  // const { user } = useAuthContext();
  const { picks, dispatch } = usePicksContext();
  const [hovered, setHovered] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const handleMouseEnter = () => {
    if (concluded || isMobile) return;
    setHovered(true);
  };

  const handleMouseLeave = () => {
    // if (win) return;
    setHovered(false);
  };

  const handleClick = async (e) => {
    // if (!user) {
    //   const confirmation = window.confirm('You need to be logged in to make picks!\nClick OK to log in / sign up.');
    //   return confirmation ? window.location.href = '/login' : null;
    // }

    if (concluded) return;

    const pick = e.currentTarget.classList[1];
    const currentSeriesPick = picks.find(pick => pick.series_id === seriesId);
    const currentTeamPicks = picks.filter(pick => pick.pick === team);

    if (currentTeamPicks.length === 2) return alert(`You've already picked ${team} twice!`);

    if (!currentSeriesPick) {
      const [seriesGroupDates] = seriesId.split(':');
      const currentSeriesGroupPick = picks
        .find(pick => pick.series_id.includes(seriesGroupDates));
      
      if (currentSeriesGroupPick) {
        const response = await fetch(`${serverUrl}/api/picks/${currentSeriesGroupPick._id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
  
        if (!response.ok) return;

        dispatch({ type: 'DELETE_PICK', payload: currentSeriesGroupPick });
      }
    }

    const response = await fetch(
      `${serverUrl}/api/picks${currentSeriesPick ? `/${currentSeriesPick._id}` : ''}`,
      {
        method: currentSeriesPick ? 'PATCH' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pick, ...!currentSeriesPick && { series_id: seriesId } })
      }
    );

    if (response.ok) dispatch({ type: 'CREATE_PICK', payload: await response.json() });
  };

  const { pick } = (picks && picks.length) ? (picks.find(pick => pick.series_id === seriesId) || {}) : {};

  return (
    <button 
      className={`${seriesId} ${team} ${type}${!concluded ? " in-play" : ""} ${win ? " winner" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={() => setHovered(false)}
      onClick={handleClick}
      style={((pick === team && !concluded) || hovered || successfulPick) ? { backgroundColor: opponentPrimary ? `${opponentPrimary}55` : `${primary}55` } : {}}
    >
      {type === "visitor" && <img src={logo} alt={`${team} logo`} />}
      <div className="team-and-record">
        <p className="team">{team}</p>
        <h5 className={`${win ? "record d-block" : "d-none"}`}>{record}</h5>
      </div>
      {type === "home" && <img src={logo} alt={`${team} logo`} />}
      <div
        className={`bar top ${type}${pick === team || hovered || successfulPick ? " d-block" : ""}`}
        style={{ backgroundColor: opponentPrimary || primary }}
      >
      </div>
      <div
        className={`bar ${type}${type === "visitor" ? " left" : " right"}${pick === team || hovered || successfulPick ? " d-block" : " d-none"}`}
        style={{ backgroundColor: opponentPrimary || primary }}
      >
      </div>
      <div 
        className={`bar bottom ${type}${pick === team || hovered || successfulPick ? " d-block" : ""}`} 
        style={{ backgroundColor: opponentPrimary || primary }}
      >
      </div>
    </button>
  )
};

export default Team;