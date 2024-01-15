"use client";
import {
  TDayWithTable,
  TSanityMarket,
  TTable,
  TTableInDay,
} from "@/sanity/queries/admin/markets";
import SelectDates from "./SelectDates";
import ContinueButton from "../../_components/ContinueButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodBookMarketOptionsSchema } from "@/zod/checkout";
// import { useRouter } from "next/navigation";
type TSelectedTableType = {
  date: string;
  table: TTableInDay;
};
export type TDateType = {
  date: string;
  tables: TTableInDay[];
};
const SelectOptions = ({ market }: { market: TSanityMarket }) => {
  const { push } = useRouter();

  const [specialRequest, setSpecialRequest] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTables, setSelectedTables] = useState<TSelectedTableType[]>(
    []
  );

  const [newSelectedDates, setNewSelectedDates] = useState<TDayWithTable[]>([]);

  const totalToPay = selectedTables.reduce(
    (total, table) => total + table.table.table.price,
    0
  );

  const options = {
    selectedTables,
    totalToPay,
    specialRequest,
    market,
  };

  const handleNewDateSelect = (date: TDayWithTable) => {
    if (newSelectedDates.includes(date)) {
      setNewSelectedDates((prev) => prev.filter((d) => d !== date));
    } else {
      setNewSelectedDates((prev) => [...prev, date]);
    }
  };

  const handleOnTableChange = (table: TTableInDay, date: TDateType) => {
    setSelectedTables((prevTables) => {
      // Check if the date is already in the selected tables
      const existingDate = prevTables.find((t) => t.date === date.date);
      console.log({ existingDate })
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

  const handleProceedToCheckout = async (event: React.FormEvent) => {
    event.preventDefault();

    
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]'
    );
    const selects = document.querySelectorAll<HTMLSelectElement>('select');
  
    let uncheckedTableDate = '';
    const isAnyCheckboxCheckedWithoutSelect = Array.from(checkboxes).some((checkbox, index) => {
      const correspondingSelect = selects[index];
      if (checkbox.checked && (!correspondingSelect || correspondingSelect.value === null || correspondingSelect.value === undefined || correspondingSelect.value === 'null')) {
        uncheckedTableDate = checkbox.nextSibling?.textContent || '';
        return true;
      }
      return false;
    });

    if (isAnyCheckboxCheckedWithoutSelect) {
      alert(`Please select a table for the date ${uncheckedTableDate} before proceeding to checkout.`);
      return;
    }


    if (!options.selectedTables || options.selectedTables.length === 0) {
      alert("Please select tables before proceeding to checkout.");
      return;
    }

    try {
      // const res = await fetch("/dashboard/checkout/api/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(options),
      // });

      const parsedOptions = zodBookMarketOptionsSchema.safeParse(options);
      const params = new URLSearchParams();

      if (!parsedOptions.success) {
        console.error(parsedOptions.error);
        return;
      }


      for (const [key, value] of Object.entries(parsedOptions.data)) {
        params.append(key, JSON.stringify(value));
      }
      

      // console.log({parsedOptions, params: params.toString()})
      push(`/dashboard/checkout?${params.toString()}`);
    } catch (error) {
      console.error(error);
    }

  };

  // console.log({ options })
  return (
    <form
      onSubmit={handleProceedToCheckout}
      className="w-full md:w-[40%] min-w-[250px] flex flex-col gap-5 md:p-5"
    >
      <header>
        <h1>Select Table Location preference</h1>
        <span>Note: Table selection is not guaranteed</span>
      </header>
      <SelectDates
        market={market}
        handleDateSelect={handleNewDateSelect}
        selectedDates={newSelectedDates}
        totalToPay={totalToPay}
        handleOnTableChange={handleOnTableChange}
      />
      <textarea
        rows={2}
        placeholder="Special Requests"
        className="rounded-3xl py-5 px-3 text-black"
        value={specialRequest}
        onChange={(e) => setSpecialRequest(e.target.value)}
      />
      <ContinueButton type="submit">Checkout</ContinueButton>
      {/* {JSON.stringify(options)} */}
    </form>
  );
};

export default SelectOptions;
