import { useState, useEffect, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import teams from '../teams.json';

const Picks = ({ users, finalizedSeries, picks }) => {
  const [seriesCount, setSeriesCount] = useState('');

  useEffect(() => {
    let count = 0;
    finalizedSeries.forEach(seriesGroup => count += seriesGroup.series.length);
    setSeriesCount(count);
  }, [finalizedSeries]);

  return (
    <table className="picks">
      <thead>
        <tr>
          <th className="team-column"></th>
          <th className="game-count-column"></th>
          {users.map(user => (
            <th className="username" key={user.username}>{user.username}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td className="series-count">52</td>
          {users.map(user => {
            const { username, total_wins, total_losses } = user;
            return (
              <td className="wins-losses" key={`${username}:${total_wins}:${total_losses}`}>
                <b><i>{total_wins}-{total_losses}</i></b>
              </td>
            )
          })}
        </tr>
        <tr>
          <td className="team"><b><i>Team</i></b></td>
          <td></td>
          {users.map(user => (
            <td className="oppo-date" key={user.username}><b>Oppo. / Date</b></td>
          ))}
        </tr>
        {teams.map(team => {
          const { mascot, abbreviation, logo } = team;
          return (
            <tr key={mascot}>
              <td className="team-and-logo">
                <img src={logo} alt={`${mascot} logo`} />
                <span>{mascot}</span>
              </td>
              <td></td>
              {users.map(user => {
                const { username } = user;
                return (
                  <td key={`${username}:${abbreviation}`} className="oppo-date"></td>
                )
              })}
            </tr>
          )
        })}
        {/* {finalizedSeries.map(seriesGroup => {
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
                        .find(pick => (pick.series_id === seriesId && pick.user_id === user._id)) || {};

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
        })} */}
      </tbody>
    </table>
  )
};

export default Picks;