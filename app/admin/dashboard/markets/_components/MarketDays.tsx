"use client";

import { TVendor } from "@/sanity/queries/admin/markets";
import { formatMarketDate } from "@/utils/helpers";
import { useState } from "react";

const MarketDays = ({
  dates,
  vendors,
}: {
  dates: string[];
  vendors: TVendor[];
}) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  console.log({ dates, vendors });

  const vendorsForSelectedDay = vendors.filter((vendor) => {
    return vendor.datesBooked.some(
      (bookedDate) => bookedDate.date === selectedDay
    );
  });

  console.log({ vendorsForSelectedDay });
  return (
    <>
      <div className="flex gap-4 w-fit mx-auto">
        {dates.map((date, i) => {
          return (
            <button
              key={date + i}
              type="button"
              onClick={() => setSelectedDay(date)}
              className={`flex flex-col justify-center gap-4 w-fit border-4 border-black p-2 rounded-[20px] ${
                selectedDay === date ? "border-black" : "border-slate-200"
              } `}
            >
              <h2 className="font-bold text-xl max-w-[8ch] text-center">
                {formatMarketDate(date).replace(",", "")}
              </h2>
            </button>
          );
        })}
      </div>
      {selectedDay && vendorsForSelectedDay.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Category</th>
              <th>Table Selection</th>
            </tr>
          </thead>
          <tbody>
            {vendorsForSelectedDay.map((vendor) => {
              const vendorDates = vendor.datesBooked.filter(
                (date) => date.date === selectedDay
              );
              return (
                <tr key={vendor.vendor.businessName} className="text-center capitalize py-2">
                  <td>{vendor.vendor.businessName}</td>
                  <td>{vendor.vendor.businessCategory}</td>
                  <td>
                    {vendorDates.map((date) => (
                      <>{date.tableId}</>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default MarketDays;
