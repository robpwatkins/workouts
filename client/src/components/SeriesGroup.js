import Series from './Series';

const SeriesGroup = ({ dates, series }) => {
  console.log('dates: ', dates);
  return (
    <div key={dates} className="series-group">
      <h3>{dates}</h3>
      <Series dates={dates} series={series} />
    </div>
  )
};

export default SeriesGroup;