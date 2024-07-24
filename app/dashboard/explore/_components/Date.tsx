import { DateTime } from 'luxon';

const Date = ({ dates }: {
  dates: string[];
}) => {
  if (dates.length === 0) return null;

  // Ensure dates are in the correct format (YYYY-MM-DD)
  const formattedDates = dates.map(date => {
    const [year, month, day] = date.split('-').map(Number);
    return DateTime.fromObject({ year, month, day });
  });

  // Find the earliest and latest dates
  const firstDate = formattedDates.reduce((min, dt) => dt < min ? dt : min, formattedDates[0]);
  const lastDate = formattedDates.reduce((max, dt) => dt > max ? dt : max, formattedDates[0]);
  // Extract the month from the earliest date
  const month = firstDate.toFormat('LLL');
  const firstDay = firstDate.day;
  const lastDay = lastDate.day;


  return (
    <div className="border relative border-[#707070] rounded-b-md">
      <div className="absolute left-2 top-[1px]">
        <CalendarRing />
      </div>
      <div className="absolute right-2 top-[1px]">
        <CalendarRing />
      </div>
      <header className='bg-[#C5B5A4] w-16 border-b border-[#707070] h-7 flex justify-center items-end text-white uppercase font-semibold font-darker-grotesque text-base'>

        {month}
      </header>
      <footer className='flex justify-center items-center'>

        <span className='font-darker-grotesque text-lg font-bold text-black tracking-superTight'>
          {`${firstDay} - ${lastDay}`}
        </span>
      </footer>
      {/* {JSON.stringify(dates)?} */}
    </div>
  );
}

export default Date;

const CalendarRing = () => {
  return (
    <div className="w-[7px] h-[7px] bg-black rounded-full relative">
      <div className="w-[5px] h-[12px] bg-[#5E5E5E] rounded-t-[4px] absolute bottom-[1px] left-[1px] rounded-b -[4px]">
      </div>
    </div>
  )
}