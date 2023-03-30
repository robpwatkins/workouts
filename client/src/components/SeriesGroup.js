import Series from './Series';

const SeriesGroup = ({ allSeries }) => {
  return (
    <>
      {allSeries.length ? allSeries.map(seriesGroup => {
        const { dates, series } = seriesGroup;
        return (
          <div key={dates} className="series-group">
            <h3>{dates}</h3>
            <Series dates={dates} series={series} />
          </div>
        )
      }) : ''}
    </>
  )
};

export default SeriesGroup;