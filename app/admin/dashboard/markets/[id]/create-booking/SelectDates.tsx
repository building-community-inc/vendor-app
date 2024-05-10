"use client";
import {
  TDayWithTable,
  TSanityMarket,
  TTableInDay,
} from "@/sanity/queries/admin/markets";
import { areDatesSame, formatDateWLuxon } from "@/utils/helpers";
import { TDateType } from "@/app/dashboard/markets/[id]/select-preferences/_components/SelectOptions";

const SelectDates = ({
  market,
  handleDateSelect,
  selectedDates,
  handleOnTableChange,
  businessCategory,

}: {
  market: TSanityMarket;
  handleDateSelect: (date: TDayWithTable) => void;
  handleOnTableChange: (table: TTableInDay, date: TDateType) => void;
  selectedDates: TDayWithTable[];
  businessCategory: string;

}) => {
  // Filter out the days that already have a business with the same category
  const availableDays = market.daysWithTables?.filter(day => {
    // Check if there is a vendor with the same category that has booked this day
    const isBooked = market.vendors?.some(vendor => {
      return (
        vendor.vendor.businessCategory === businessCategory &&
        vendor.datesBooked.some(bookedDate => areDatesSame(bookedDate.date, day.date))
      )
    }
    );

    // Return true if the day is not booked, false otherwise
    return !isBooked;
  });

  if (availableDays?.length === 0) {
    return (
      <section className="flex flex-col gap-4 w-full">
        <p className="text-red-700">No available dates for this vendor</p>
      </section>
    )
  }
  return (
    <section className="flex mt-5 flex-col gap-4 w-full">
      <h2 className="font-bold">Select Dates</h2>
      <ul className="flex flex-col gap-3 w-full">
        {availableDays?.map((dayObj, index) => {


          return (
            <li key={dayObj.date}>
              <label
                htmlFor={dayObj.date}
                className="flex items-center justify-between min-h-[2rem]"
              >
                <div
                  className="flex items-center gap-2 h-full relative z-10"
                // onClick={() => handleDateSelect(dayObj)}
                >
                  <input
                    type="checkbox"
                    name={`date-${dayObj.date}`}
                    id={dayObj.date}
                    className="pointer-events-none relative z-[2]"
                    onChange={() => handleDateSelect(dayObj)}
                    checked={
                      !!selectedDates.find((d) => d && d.date === dayObj.date)
                    }
                  />
                  <span className="whitespace-nowrap">
                    {formatDateWLuxon(dayObj.date)}
                  </span>
                </div>
                {!!selectedDates.find((d) => d.date === dayObj.date) && (
                  <select
                    name={`table-${dayObj.date}`}
                    required={
                      !!selectedDates.find((d) => d && d.date === dayObj.date)
                    }
                    id="table"
                    className="text-black w-fit"
                    onChange={(e) => {
                      const newTable = dayObj.tables.find(
                        (t) => t.table.id === e.target.value.split("-")[0]
                      );

                      if (newTable === undefined) return;
                      handleOnTableChange(newTable, dayObj);
                    }}
                  >
                    <option value="null">Table</option>
                    {dayObj.tables
                      .filter((table) => !table.booked)
                      .map((table, index) => (
                        <option
                          key={`${table.table}-${index}`}
                          value={`${table.table.id}-${table.table.price}`}
                        >
                          Table: {table.table.id} Price: ${table.table.price}
                        </option>
                      ))}
                  </select>
                )}
              </label>
            </li>
          )
        })}
      </ul>

    </section>
  );
};

export default SelectDates;
