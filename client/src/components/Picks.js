import Pick from "./Pick";

const Picks = ({ user, picks, seriesGroup }) => {
  const { dates, series } = seriesGroup;

  return (
    <div className="picks">
      <h4>{dates}</h4>
      {series.map(singleSeries => {
        const { visitor, visitorWin, home, homeWin } = singleSeries.seriesInfo;
        return (
          <Pick
            visitor={visitor}
            visitorWin={visitorWin}
            home={home}
            homeWin={homeWin}
          />
        )
      })}
    </div>
  )
};

export default Picks;