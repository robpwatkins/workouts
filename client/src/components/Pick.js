import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

const Pick = ({ visitor, visitorWin, home, homeWin, pick }) => {
  const successfulPick = (visitorWin && pick === visitor) || (homeWin && pick === home);

  return (
    <div className="pick">
      {successfulPick 
        ? <FontAwesomeIcon icon={faCheck} />
        : <FontAwesomeIcon icon={faXmark} />}
    </div>
  )
};

export default Pick;