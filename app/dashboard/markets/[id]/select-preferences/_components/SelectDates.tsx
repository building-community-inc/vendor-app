"use client";
import {
  TDayWithTable,
  TSanityMarket,
  TTableInDay,
} from "@/sanity/queries/admin/markets/zods";
import { TDateType } from "./SelectOptions";
import { formatDateWLuxon } from "@/utils/helpers";
import Box from "./Box";
import { getAvailableDays } from "@/app/admin/dashboard/markets/[id]/create-booking/SelectDates";


// Reusable function to filter available days
// const getAvailableDays = (market: TSanityMarket, businessCategory: string, maxVendorsPerCategory: number) => {
//   return market.daysWithTables?.filter(day => {
//     const categoryCount = market.vendors?.filter(vendor =>
//       vendor.vendor.businessCategory === businessCategory &&
//       vendor.datesBooked.some(bookedDate => bookedDate.date === day.date)
//     ).length ?? 0;

//     return categoryCount < maxVendorsPerCategory;
//   });
// };

const SelectDates = ({
  market,
  handleDateSelect,
  selectedDates,
  handleOnTableChange,
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

  const availableDays = getAvailableDays(market, businessCategory);

  if (availableDays?.length === 0) {
    return (
      <section className="flex flex-col gap-4 w-full">
        <p className="text-red-500 text-center">No available dates for this market</p>
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
                  className="flex items-center gap-2 h-full w-[160ch]"
                >
                  <input
                    type="checkbox"
                    name={`date-[${index}]`}
                    id={dayObj.date}
                    className="accent-title-color"
                    onChange={() => handleDateSelect(dayObj)}
                    checked={
                      !!selectedDates.find((d) => d && d.date === dayObj.date)
                    }
                  />

                  <div
                    className="w-full justify-between items-center gap-2 flex"
                  >


                    <span
                      className="text-base text-black  font-semibold font-darker-grotesque"
                      onClick={() => handleDateSelect(dayObj)}
                    >
                      {formatDateWLuxon(dayObj.date)}
                    </span>
                    {!!selectedDates.find((d) => d.date === dayObj.date) && (
                      <div className="flex-1 max-w-[170px]">
                        <select
                          name="table"
                          required={
                            !!selectedDates.find((d) => d && d.date === dayObj.date)
                          }
                          id="table"
                          className="text-black w-full rounded-md border border-[#707070]        "
                          onChange={(e) => {
                            const newTable = dayObj.tables.find(
                              (t) => t.table.id === e.target.value
                            );

                            if (newTable === undefined) return;
                            handleOnTableChange(newTable, dayObj);
                          }}
                        >
                          {dayObj.tables
                            .filter((table) => !table.booked).length > 0 ? (
                              <option value="null">Table</option>
                            ) : (
                              <option>No Available Tables</option>
                            )}
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
                      </div>

                    )}
                  </div>
                </div>
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
