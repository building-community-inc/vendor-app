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
import { useEffect } from "react";

const SelectDates = ({
  market,
  handleDateSelect,
  selectedDates,
  handleOnTableChange,
  businessCategory,
  setSelectedDates // Assuming you have a setter for selectedDates in the parent
}: {
  market: TSanityMarket;
  handleDateSelect: (date: TDayWithTable) => void;
  handleOnTableChange: (table: TTableInDay, date: TDateType) => void;
  selectedDates: TDayWithTable[];
  totalToPay: number | null;
  dueNow: number;
  businessCategory: string;
  setSelectedDates: (dates: TDayWithTable[]) => void;
}) => {

  const availableDays = getAvailableDays(market, businessCategory);

  useEffect(() => {
    if (market?.allDaysMandatory && availableDays) {
      // Ensure all available days are selected
      const allAvailableSelected = availableDays.every(day =>
        selectedDates.some(selectedDay => selectedDay.date === day.date)
      );
      if (!allAvailableSelected) {
        setSelectedDates(availableDays);
      }
    }
  }, [market?.allDaysMandatory, availableDays, setSelectedDates, selectedDates]);

  if (availableDays?.length === 0) {
    return (
      <section className="flex flex-col gap-4 w-full">
        <p className="text-red-500 text-center">No available dates for this market</p>
      </section>
    );
  }

  return (
    <Box className="mt-5 gap-2">
      <h2 className="text-xl font-bold font-darker-grotesque text-black self-start">Select Dates and Table Location</h2>
      <span className="font-darker-grotesque text-base text-black self-start">Only available tables will be displayed</span>
      <ul className="flex flex-col gap-3 w-full">
        {availableDays?.map((dayObj, index) => {
          const isChecked = !!selectedDates.find((d) => d && d.date === dayObj.date);
          const isMandatory = market?.allDaysMandatory;

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
                    onChange={() => !isMandatory && handleDateSelect(dayObj)}
                    checked={isMandatory || isChecked}
                    disabled={isMandatory ?? false}
                  />

                  <div
                    className="w-full justify-between items-center gap-2 flex"
                  >


                    <span
                      className="text-base text-black   font-semibold font-darker-grotesque cursor-pointer"
                      onClick={() => !isMandatory && handleDateSelect(dayObj)}
                    >
                      {formatDateWLuxon(dayObj.date)}
                    </span>
                    {isChecked && (
                      <div className="flex-1 max-w-[170px]">
                        <select
                          name="table"
                          required={isChecked}
                          id="table"
                          className="text-black w-full rounded-md border border-[#707070]       "
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
          );
        })}
      </ul>
      <span>{"Note: Table selection is subject to change at administrator's discretion."}</span>
      {market.allDaysMandatory && (
          <div className="text-xs">
          <p className="">* All days are mandatory</p>
          <p className="">* La participation à tous les jours de l'événement est obligatoire</p>
        </div>      )}
    </Box>
  );
};

export default SelectDates;