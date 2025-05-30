"use client";
import {
  TDayWithTable,
  TSanityMarket,
  TTableInDay,
} from "@/sanity/queries/admin/markets/zods";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import { useState } from "react";
import {
  TDateType,
  TSelectedTableType,
} from "@/app/dashboard/markets/[id]/select-preferences/_components/SelectOptions";
import SelectPaymentOptions from "./SelectPaymentOptions";
import SelectDates from "./SelectDates";
import { useSearchParams } from "next/navigation";
import Button from "@/app/_components/Button";

const SelectDetails = ({
  market,
  user,
}: {
  market: TSanityMarket;
  user: TUserWithOptionalBusinessRef;
}) => {
  const [newSelectedDates, setNewSelectedDates] = useState<TDayWithTable[]>([]);
  const [selectedTables, setSelectedTables] = useState<TSelectedTableType[]>(
    []
  );
  const [isPayNowSelected, setIsPayNowSelected] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const selectedBusinessCategory = searchParams.get("businessCategory");
  const selectedVendor = searchParams.get("selectedVendor");

  const handleNewDateSelect = (date: TDayWithTable) => {
    if (newSelectedDates.some((d) => d.date === date.date)) {
      setNewSelectedDates((prev) => prev.filter((d) => d.date !== date.date));
      setSelectedTables((prevTables) =>
        prevTables.filter((t) => t.date !== date.date)
      );
    } else {
      setNewSelectedDates((prev) => [...prev, date]);
    }
  };
  const totalToPay = selectedTables.reduce(
    (total, table) => total + table.table.table.price,
    0
  );
  const handleOnTableChange = (table: TTableInDay, date: TDateType) => {
    setSelectedTables((prevTables) => {
      // Check if the date is already in the selected tables
      const existingDate = prevTables.find((t) => t.date === date.date);
      if (existingDate) {
        // If the date is already in the selected tables, replace its table with the new table
        return prevTables.map((t) =>
          t.date === date.date ? { ...t, table } : t
        );
      } else {
        // If the date is not in the selected tables, add a new entry with the date and table
        return [...prevTables, { date: date.date, table }];
      }
    });
  };
  const dueNow = isPayNowSelected ? totalToPay : selectedTables.length * 50;

  if (!selectedVendor) return;

  return (
    <>
      <SelectDates
        market={market}
        handleDateSelect={handleNewDateSelect}
        selectedDates={newSelectedDates}
        handleOnTableChange={handleOnTableChange}
        businessCategory={selectedBusinessCategory ?? ""}
      />

      <SelectPaymentOptions setIsPayNowSelected={setIsPayNowSelected} />

      <h2 className="font-bold">Subtotal:</h2>
      <span>${totalToPay}</span>
      <input hidden type="text" value={totalToPay} name="total" readOnly />

      <h2 className="font-bold">Total:</h2>
      <span>${(+dueNow + dueNow * 0.13).toFixed(2)}</span>
      <input
        hidden
        type="text"
        value={(+dueNow + dueNow * 0.13).toFixed(2)}
        name="paid"
        readOnly
      />
      <h2 className="font-bold">HST:</h2>
      <span>${(dueNow * 0.13).toFixed(2)}</span>
      <input
        hidden
        type="text"
        value={(dueNow * 0.13).toFixed(2)}
        name="hst"
        readOnly
      />

      <p>Amount Owing:</p>
      <span>${totalToPay - dueNow}</span>
      <input
        hidden
        type="text"
        value={totalToPay - dueNow}
        name="owed"
        readOnly
      />
      <input hidden type="text" value={market._id} name="marketId" readOnly />

      <Button
        className="rounded-none bg-black text-white py-4 px-6 text-lg mx-auto my-10"
        type="submit"
      >
        Complete Booking
      </Button>
    </>
  );
};

export default SelectDetails;
