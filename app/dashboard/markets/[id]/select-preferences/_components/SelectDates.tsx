"use client";
import { TSanityMarket } from "@/sanity/queries/admin/markets";
import { formatMarketDate } from "@/utils/helpers";
import { useState } from "react";

const SelectDates = ({ market }: { market: TSanityMarket }) => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const price = market.price.split("$")[1];
  const totalToPay = selectedDates.length * Number(price);
  // const price = selectedDates.length * market.price;

  const handleDateSelect = (date: string) => {
    if (selectedDates.includes(date)) {
      setSelectedDates((prev) => prev.filter((d) => d !== date));
    } else {
      setSelectedDates((prev) => [...prev, date]);
    }
  };

  return (
    <section>
      <h2>Select Dates</h2>
      <ul className="flex flex-col gap-3">
        {market.dates.map((date, index) => (
          <li key={date}>
            <label
              htmlFor={`date-[${index}]`}
              className="flex items-center gap-4"
            >
              <input
                type="checkbox"
                name={`date-[${index}]`}
                id={date}
                onClick={() => handleDateSelect(date)}
                checked={!!selectedDates.find((d) => d === date)}
              />
              {formatMarketDate(date)}
            </label>
          </li>
        ))}
      </ul>
      {typeof totalToPay === "number" ? (
        totalToPay < 1 ? (
          <span className="text-yellow-400">Please select at least one date</span>
        ) : (
          <>
            <h2>Total To Booking Cost:</h2>
            <span>$ {totalToPay}</span>
          </>
        )
      ) : (
        <span className="text-red-400">Something went wrong</span>
      )}

      <span>Due Now:</span>
      <span>$50</span>
    </section>
  );
};

export default SelectDates;
