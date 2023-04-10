import Pick from "./Pick";

const Picks = ({ user, picks, seriesGroup }) => {
  const { series } = seriesGroup;

  return (
    <div className="series-picks">
      <div className="spacer"></div>
      {series.map(singleSeries => {
        const { seriesId, seriesInfo } = singleSeries;
        const { visitor, visitorWin, home, homeWin } = seriesInfo;
        const { pick } = picks.find(pick => pick.series_id === seriesId);

        return (
          <Pick
            key={seriesId}
            visitor={visitor}
            visitorWin={visitorWin}
            home={home}
            homeWin={homeWin}
            pick={pick}
          />
        )
      })}
    </div>
  )
};

export default Picks;