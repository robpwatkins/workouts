import { useState } from 'react';
// import { useAuthContext } from '../hooks/useAuthContext';
import { usePicksContext } from '../hooks/usePicksContexts';

const Team = ({ seriesId, team, type, win, record, logo, primary, successfulPick, opponentPrimary }) => {
  // const { user } = useAuthContext();
  const { picks, dispatch } = usePicksContext();
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    // if (win) return;
    setHovered(true);
  };

  const handleMouseLeave = () => {
    // if (win) return;
    setHovered(false);
  };

  const handleClick = async (e) => {
    // if (!user || win) return;

    const pick = (e.target.matches('img') ? e.target.parentElement : e.target).classList[1];
    const currentSeriesPick = picks.find(pick => pick.series_id === seriesId);
    const url = `/api/picks${currentSeriesPick ? `/${currentSeriesPick._id}` : ''}`;
    const response = await fetch(url, {
      method: currentSeriesPick ? 'PATCH' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pick, ...!currentSeriesPick && { series_id: seriesId } })
    });

    if (response.ok) {
      const json = await response.json();

      if (!currentSeriesPick) {
        const [seriesGroupDates] = seriesId.split(':');
        const currentSeriesGroupPick = picks
          .find(pick => pick.series_id.includes(seriesGroupDates));
        
        if (currentSeriesGroupPick) {
          const response = await fetch(`/api/picks/${currentSeriesGroupPick._id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
    
          if (!response.ok) return;

          dispatch({ type: 'DELETE_PICK', payload: currentSeriesGroupPick });
        }

        dispatch({ type: 'CREATE_PICK', payload: json });
      } else {
        const updatedPicks = picks.map(pick => pick._id === json._id ? json : pick);
        dispatch({ type: 'SET_PICKS', payload: updatedPicks });
      }
    }
  };

  const { pick } = (picks && picks.length) ? (picks.find(pick => pick.series_id === seriesId) || {}) : {};

  return (
    <button 
      className={`${seriesId} ${team} ${type} ${win ? " winner" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {type === "visitor" && <img src={logo} alt={`${team} logo`} />}
      <div className="team-and-record">
        <p className="team">{team}</p>
        <h5 className={`${win ? "record d-block" : "d-none"}`}>{record}</h5>
      </div>
      {type === "home" && <img src={logo} alt={`${team} logo`} />}
      <div
        className={`bar top${successfulPick ? " d-block" : " d-none"}`}
        style={{ backgroundColor: opponentPrimary || primary }}
      >
      </div>
      <div
        className={`bar${type === "visitor" ? " left" : " right"}${successfulPick ? " d-block" : " d-none"}`}
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