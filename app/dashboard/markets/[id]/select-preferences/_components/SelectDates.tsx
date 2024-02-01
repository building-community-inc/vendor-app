"use client";
import {
  TDayWithTable,
  TSanityMarket,
  TTableInDay,
} from "@/sanity/queries/admin/markets";
import { formatMarketDate } from "@/utils/helpers";
import { TDateType } from "./SelectOptions";

const SelectDates = ({
  market,
  handleDateSelect,
  selectedDates,
  totalToPay,
  handleOnTableChange,
  dueNow,
  businessCategory
}: {
  market: TSanityMarket;
  handleDateSelect: (date: TDayWithTable) => void;
  handleOnTableChange: (table: TTableInDay, date: TDateType) => void;
  selectedDates: TDayWithTable[];
  totalToPay: number | null;
  dueNow: number;
  businessCategory: string;
}) => {
  const safeFormatMarketDate = (date: string) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const dateArray = date.split("-");
    const monthIndex = parseInt(dateArray[1]) - 1;
    const day = parseInt(dateArray[2]);
    const year = parseInt(dateArray[0]);
  
    // Create a new Date object
    const dateObject = new Date(year, monthIndex, day);
  
    // Get the day of the week
    const dayOfWeek = days[dateObject.getDay()];
  
    return `${dayOfWeek}, ${months[monthIndex]} ${day}, ${year}`;
  };


  // Filter out the days that already have a business with the same category
  const availableDays = market.daysWithTables?.filter(day => {
    // Check if there is a vendor with the same category that has booked this day
    const isBooked = market.vendors?.some(vendor =>
      vendor.vendor.businessCategory === businessCategory &&
      vendor.datesBooked.some(bookedDate => bookedDate.date === day.date)
    );

    // Return true if the day is not booked, false otherwise
    return !isBooked;
  });

  if (availableDays?.length === 0) {
    return (
      <section className="flex flex-col gap-4 w-full">
        <p className="text-red-500">No available dates for this market</p>
      </section>
    )
  }
  return (
    <section className="flex flex-col gap-4 w-full">
      <h2>Select Dates</h2>
      <ul className="flex flex-col gap-3 w-full">
        {availableDays?.map((date, index) => (
          <li key={date.date}>
            <label
              htmlFor={`date-[${index}]`}
              className="flex items-center justify-between"
            >
              <div
                className="flex items-center gap-2"
                onClick={() => handleDateSelect(date)}
              >
                <input
                  type="checkbox"
                  name={`date-[${index}]`}
                  id={date.date}
                  className=""
                  onChange={() => handleDateSelect(date)}
                  checked={
                    !!selectedDates.find((d) => d && d.date === date.date)
                  }
                />
                <span className="whitespace-nowrap">
                  {safeFormatMarketDate(date.date)}
                </span>
              </div>
              {!!selectedDates.find((d) => d.date === date.date) && (
                <select
                  name="table"
                  required={
                    !!selectedDates.find((d) => d && d.date === date.date)
                  }
                  id="table"
                  className="text-black w-fit"
                  onChange={(e) => {
                    const newTable = date.tables.find(
                      (t) => t.table.id === e.target.value
                    );

                    if (newTable === undefined) return;
                    handleOnTableChange(newTable, date);
                  }}
                >
                  <option value="null">Table</option>
                  {date.tables
                    .filter((table) => !table.booked)
                    .map((table, index) => (
                      <option
                        key={`${table.table}-${index}`}
                        value={table.table.id}
                      >
                        Table: {table.table.id} Price: ${table.table.price}
                      </option>
                    ))}
                </select>
              )}
            </label>
          </li>
        ))}
      </ul>

    </section>
  );
};

export default SelectDates;
