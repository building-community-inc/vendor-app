"use client";
import {
  TDayWithTable,
  TSanityMarket,
  TTableInDay,
} from "@/sanity/queries/admin/markets/zods";
import { TDateType } from "./SelectOptions";
import { formatDateWLuxon } from "@/utils/helpers";
import Box from "./Box";

const SelectDates = ({
  market,
  handleDateSelect,
  selectedDates,
  // totalToPay,
  handleOnTableChange,
  // dueNow,
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
    <Box className="mt-5">
      <h2 className="text-xl font-bold font-darker-grotesque text-black self-start">Select Dates and Table Location</h2>
      <span className="font-darker-grotesque text-base text-black self-start">Only available tables will be displayed</span>
      <ul className="flex flex-col gap-3 w-full">
        {availableDays?.map((dayObj, index) => {


          return (
            <li key={dayObj.date}>
              <label
                htmlFor={`date-[${index}]`}
                className="flex items-center justify-between min-h-[2rem]"
              >
                <div
                  className="flex items-center gap-2 h-full relative z-10"
                  onClick={() => handleDateSelect(dayObj)}
                >
                  <input
                    type="checkbox"
                    name={`date-[${index}]`}
                    id={dayObj.date}
                    className="pointer-events-none accent-title-color relative z-[2] checked:bg-purple-500"
                    onChange={() => handleDateSelect(dayObj)}
                    checked={
                      !!selectedDates.find((d) => d && d.date === dayObj.date)
                    }
                  />

         

                  <span className="text-base text-black font-semibold font-darker-grotesque">
                    {formatDateWLuxon(dayObj.date)}
                  </span>
                </div>
                {!!selectedDates.find((d) => d.date === dayObj.date) ? (
                  <select 
                    name="table"
                    required={
                      !!selectedDates.find((d) => d && d.date === dayObj.date)
                    }
                    id="table"
                    className="text-black w-fit rounded-md border border-[#707070]        "
                    onChange={(e) => {
                      const newTable = dayObj.tables.find(
                        (t) => t.table.id === e.target.value
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
                          value={table.table.id}
                        >
                          Table: {table.table.id} Price: ${table.table.price}
                        </option>
                      ))}
                  </select>
                ) : (
                  <div className="w-[178px] h-[10px]"></div>
                )}
              </label>
            </li>
          )
        })}
      </ul>
      <span>{"Note: Table selection is subject to change at administrator's discretion."}</span>
    </Box>
  );
};

export default SelectDates;
