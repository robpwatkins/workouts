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

    const [series_id, pick] = (e.target.matches('img') ? e.target.parentElement : e.target).classList;

    const currentPick = picks.find(pick => pick.series_id === series_id);

    const options = {
      method: currentPick ? 'PATCH' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pick, ...!currentPick && { series_id } })
    }

    const url = `${process.env.REACT_APP_SERVER_URL}/api/picks${currentPick ? `/${currentPick._id}` : ''}`;

    const response = await fetch(url, options);
    const json = await response.json();

    if (!currentPick) dispatch({ type: 'CREATE_PICK', payload: json });
    else {
      const updatedPicks = picks.map(pick => pick._id === json._id ? json : pick);
      dispatch({ type: 'SET_PICKS', payload: updatedPicks });
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