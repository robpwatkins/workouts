import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { usePicksContext } from '../hooks/usePicksContexts';

const Team = ({ classList, teamPrimary, logo, team, type, pick }) => {
  const { user } = useAuthContext();
  const { picks, dispatch } = usePicksContext();
  const [hovered, setHovered] = useState(false);

  const handleClick = async (e) => {
    if (!user) return;

    const [series_id, pick] = (e.target.matches('img') ? e.target.parentElement : e.target).classList;

    const currentPick = picks.find(pick => pick.series_id === series_id);

    const options = {
      method: currentPick ? 'PATCH' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pick, ...!currentPick && { series_id } })
    }

    const url = `http://localhost:4001/api/picks${currentPick ? `/${currentPick._id}` : ''}`;

    const response = await fetch(url, options);
    const json = await response.json();

    if (!currentPick) dispatch({ type: 'CREATE_PICK', payload: json });
    else {
      const updatedPicks = picks.map(pick => pick._id === json._id ? json : pick);
      dispatch({ type: 'SET_PICKS', payload: updatedPicks });
    }
  };

  return (
    <button 
      className={`${classList}${(user && pick !== team) ? " opaque" : ""}`} 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{ borderBottomColor: teamPrimary }}
    >
      {type === "visitor" && <img src={logo} alt="" />}
      {team}
      {type === "home" && <img src={logo} alt="" />}
      <div 
        className={`bar ${type}${pick === team || hovered ? " d-block" : ""}`} 
        style={{ backgroundColor: teamPrimary }}
      >
      </div>
    </button>
  )
};

export default Team;