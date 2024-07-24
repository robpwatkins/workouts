import { useState, useEffect, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import teams from '../teams.json';
import activeUsers from '../activeUsers.json';

const Picks = ({ users, finalizedSeries, picks }) => {
  // const [seriesCount, setSeriesCount] = useState('');
  const [finalizedSeriesByTeam, setFinalizedSeriesByTeam] = useState([]);
  const [userFirstPicks, setUserFirstPicks] = useState([]);
  const [userSecondPicks, setUserSecondPicks] = useState([]);

  // useEffect(() => {
  //   let count = 0;
  //   finalizedSeries.forEach(seriesGroup => count += seriesGroup.series.length);
  //   setSeriesCount(count);
  // }, [finalizedSeries]);

  useEffect(() => {
    const firstPicks = [];
    const secondPicks = [];

    if (picks.length) {
      const orderedPicks = picks
        .filter(pick => activeUsers.some(user => pick.user_id === user._id))
        .sort((a, b) => {
          const [aDate, bDate] = [a.series_id, b.series_id].map(seriesId => {
            const [startingDayStr] = seriesId.split('-');
            const [month, day] = startingDayStr
              .split('/')
              .map(str => str.length === 1 ? `0${str}` : str);

            return new Date(`2024-${month}-${day}`);
          });
  
          return aDate - bDate;
        });

      teams.forEach((team) => {
        users.forEach((user) => {
          const currentTeamPicks = orderedPicks
            .filter(pick => pick.pick === team.abbreviation && pick.user_id === user._id);
          
          if (currentTeamPicks.length) {
            const [firstPick, secondPick] = currentTeamPicks;
  
            if (firstPick) firstPicks.push(firstPick);
            if (secondPick) secondPicks.push(secondPick);
          }
        });
      });

      setUserFirstPicks(firstPicks);
      setUserSecondPicks(secondPicks);
      setFinalizedSeriesByTeam(teams.map(team => {
        const currentFinalizedSeries = finalizedSeries
        .filter(seriesGroup => seriesGroup.series.some(singleSeries => {
          return singleSeries.seriesId.includes(team.abbreviation);
        }))
        .map(seriesGroup => {
          return seriesGroup.series.find(singleSeries => {
            return singleSeries.seriesId.includes(team.abbreviation);
          });
        });
        const wins = currentFinalizedSeries
          .filter(series => series.seriesInfo.winner === team.abbreviation).length;

        return {
          team: team.abbreviation,
          series: currentFinalizedSeries,
          wins,
          losses: currentFinalizedSeries.length - wins
        };
      }));
    }
  }, [picks, finalizedSeries]);

  return (
    <table className="picks">
      <thead>
        <tr>
          <th className="team-column"></th>
          <th className="game-count-column"></th>
          {users.map(user => (
            <th colSpan={"2"} className="username" key={user.username}>{user.username}</th>
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
              <td colSpan={"2"} className="wins-losses" key={`${username}:${total_wins}:${total_losses}`}>
                <b><i>{total_wins}-{total_losses}</i></b>
              </td>
            )
          })}
        </tr>
        <tr>
          <td className="team"><b><i>Team</i></b></td>
          <td></td>
          {users.map(user => (
            <>
              <td className="oppo" key={`${user.username}1`}><b>Oppo.</b></td>
              <td className="date" key={`${user.username}2`}><b>Date</b></td>
            </>
          ))}
        </tr>
        {[...Array(teams.length * 2)].map((_, idx) => {
          const { mascot, abbreviation, logo } = idx % 2 === 0
            ? teams[idx / 2]
            : teams[(idx - 1) / 2];
          const { wins, losses } = finalizedSeriesByTeam.length
            ? finalizedSeriesByTeam.find(series => series.team === abbreviation)
            : { wins: 0, losses: 0 };

          return (
            <tr key={`${mascot}${idx}`}>
              {idx % 2 === 0 && (
                <>
                  <td
                    rowSpan={2}
                    className="team-and-logo"
                    style={{ backgroundImage: `url(${logo})`}}
                  >
                    <span>{mascot}</span>
                  </td>
                  <td rowSpan={2}>{wins}-{losses} (0-0)</td>
                </>
              )}
              {users.map(user => {
                const currentPicks = idx % 2 === 0 ? userFirstPicks : userSecondPicks;
                const currentPick = currentPicks
                  .find(pick => pick.pick === abbreviation && pick.user_id === user._id);
                const { pick, series_id, successful } = currentPick || {};
                const [dates, teams] = series_id?.split(':') || [];
                const [visitor] = teams?.split('@') || [];

                let outcome = '';

                if (successful) outcome = 'win';
                else if (successful === false) outcome = 'loss';

                return (
                  <>
                    <td
                      key={`${user.username}1`}
                      className={`current-oppo ${outcome}`}
                    >
                      {(!!pick && pick === visitor) ? '@' : ''}{pick || ''}
                    </td>
                    <td
                      key={`${user.username}2`}
                      className={`current-date ${outcome}`}
                    >
                      {dates || ''}
                    </td>
                  </>
                );
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