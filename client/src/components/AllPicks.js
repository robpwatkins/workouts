import teams from '../teams.json';
import Picks from '../components/Picks';

const AllPicks = ({ users, series, picks }) => {
  return (
    <div className="all-picks">
      <div className="series-cards">
        {series.map(seriesGroup => {
          const { dates, series } = seriesGroup;
          return (
            <div key={dates} className="series-group">
              <h4>{dates}</h4>
              {series.map(singleSeries => {
                const { seriesId, seriesInfo } = singleSeries;
                const { visitor, visitorWin, home, homeWin } = seriesInfo;
                const { logo: visitorLogo } = teams.find(team => team.abbreviation === visitor);
                const { logo: homeLogo } = teams.find(team => team.abbreviation === home);
                return (
                  <div key={seriesId} className="series-card">
                    <img src={visitorLogo} alt={`${visitor} logo`} />
                    <span className={visitorWin ? "winner" : ""}>{visitor}</span>
                    <span>@</span>
                    <span className={homeWin ? "winner" : ""}>{home}</span>
                    <img src={homeLogo} alt={`${home} logo`} />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      {users.map(user => {
        return (
          <div key={user.username} className="picks">
            <div className="username-and-record">
              <h3 className="username">{user.username}</h3>
              <h5 className="d-block">{`${user.total_wins}-${user.total_losses}`}</h5>
            </div>
            {series.length ? (series.map(seriesGroup => {
              const userPicks = picks.filter(pick => pick.user_id === user._id);
              return (
                <Picks
                  key={seriesGroup.dates}
                  user={user}
                  picks={userPicks}
                  seriesGroup={seriesGroup}
                />
              )
            })) : ""}
          </div>
        )
      })}
    </div>
  )
};

export default AllPicks;