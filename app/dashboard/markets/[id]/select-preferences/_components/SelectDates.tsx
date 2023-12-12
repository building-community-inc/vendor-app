"use client";
import { TSanityMarket } from "@/sanity/queries/admin/markets";
import { formatMarketDate } from "@/utils/helpers";
import { useState } from "react";

const SelectDates = ({
  market,
  handleDateSelect,
  selectedDates,
  totalToPay,
}: {
  market: TSanityMarket;
  handleDateSelect: (date: string) => void;
  selectedDates: string[];
  totalToPay: number | null;
}) => {
  return (
    <section className="flex flex-col gap-4">
      <h2>Select Dates</h2>
      <ul className="flex flex-col gap-3">
        {market.daysWithTables?.map((date, index) => (
          <li key={date.date}>
            <label
              htmlFor={`date-[${index}]`}
              className="flex items-center gap-4"
            >
              <input
                type="checkbox"
                name={`date-[${index}]`}
                id={date.date}
                onChange={() => handleDateSelect(date.date)}
                checked={!!selectedDates.find((d) => d === date.date)}
              />
              {formatMarketDate(date.date)}
              {!!selectedDates.find((d) => d === date.date) && (
                <select name="table" id="table" className="text-black">
                  <option value="null">Table</option>
                  {date.tables
                    .filter((table) => table.available)
                    .map((table) => (
                      <option value={table.table}>{table.table}</option>
                    ))}
                </select>
              )}
            </label>
          </li>
        ))}
      </ul>
      {typeof totalToPay === "number" ? (
        totalToPay < 1 ? (
          <span className="">Please select at least one date</span>
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
        <span>$50</span>
      </div>
    </section>
  );
};

export default SelectDates;
