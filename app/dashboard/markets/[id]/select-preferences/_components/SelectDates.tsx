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
}: {
  market: TSanityMarket;
  handleDateSelect: (date: TDayWithTable) => void;
  handleOnTableChange: (table: TTableInDay, date: TDateType) => void;
  selectedDates: TDayWithTable[];
  totalToPay: number | null;
}) => {
  return (
    <section className="flex flex-col gap-4 w-full">
      <h2>Select Dates</h2>
      <ul className="flex flex-col gap-3 w-full">
        {market.daysWithTables?.map((date, index) => (
          <li key={date.date}>
            <label
              htmlFor={`date-[${index}]`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
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
                  {formatMarketDate(date.date)}
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

                    console.log({ newTable });
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
      {typeof totalToPay === "number" ? (
        totalToPay < 1 ? (
          <span className="">Please select at least one date and a table</span>
        ) : (
          <>
            <h2>Total To Booking Cost:</h2>
            <span>$ {totalToPay}</span>
          </>
        )
      ) : (
        <span className="text-red-400">Something went wrong</span>
      )}
      <div className="w-full">
        <span>Due Now:</span>
        <span> $50</span>
      </div>
    </section>
  );
};

export default SelectDates;
