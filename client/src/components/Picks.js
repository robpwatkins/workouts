import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import teams from '../teams.json';

const Picks = ({ users, finalizedSeries, picks }) => {
  return (
    <table className="picks">
      <thead>
        <tr>
          <th className="series-count">21</th>
          {users.map(user => (
            <th key={user.username}>{user.username}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="invisible"></td>
          {users.map(user => {
            const { username, total_wins, total_losses } = user;
            return (
              <td
                key={`${username}:${total_wins}:${total_losses}`}
              >
                {total_wins}-{total_losses}
              </td>
            )
          })}
        </tr>
        {finalizedSeries.map(seriesGroup => {
          const { dates, series } = seriesGroup;
          return (
            <Fragment key={dates}>
              <tr className="dates">
                <td>{dates}</td>
                {users.map((_, idx) => <td key={idx}></td>)}
              </tr>
              {series.map(singleSeries => {
                const { seriesId, seriesInfo } = singleSeries;
                const { visitor, visitorWin, home, homeWin } = seriesInfo;
                const { logo: visitorLogo } = teams
                  .find(team => team.abbreviation === visitor);
                const { logo: homeLogo } = teams
                  .find(team => team.abbreviation === home);

                return (
                  <tr key={seriesId}>
                    <td className="series-td">
                      <img src={visitorLogo} alt={`${visitor} logo`} />
                      <span className={visitorWin ? "winner": ""}>{visitor}</span>
                      <span>@</span>
                      <span className={homeWin ? "winner" : ""}>{home}</span>
                      <img src={homeLogo} alt={`${home} logo`} />
                    </td>
                    {users.map(user => {
                      const { successful } = picks
                        .find(pick => (pick.series_id === seriesId && pick.user_id === user._id));

                      return (
                        <td key={`${user.username}:${seriesId}`}>
                          {successful
                            ? <FontAwesomeIcon icon={faCheck} />
                            : <FontAwesomeIcon icon={faXmark} />}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </Fragment>
          )
        })}
      </tbody>
    </table>
  )
};

export default Picks;