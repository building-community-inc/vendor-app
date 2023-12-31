"use client";
import { TDayWithTable, TSanityMarket, TTable, TTableInDay } from "@/sanity/queries/admin/markets";
import SelectDates from "./SelectDates";
import ContinueButton from "../../_components/ContinueButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [selectedTables, setSelectedTables] = useState<TSelectedTableType[]>([]);


  const [newSelectedDates, setNewSelectedDates] = useState<TDayWithTable[]>([]);
  
  const totalToPay = selectedTables.reduce((total, table) => total + table.table.table.price, 0);

  const options = {
    selectedTables,
    totalToPay,
    specialRequest,
    marketId: market._id,
  };

  const handleNewDateSelect = (date: TDayWithTable) => {
    console.log("here", date)
    if (newSelectedDates.includes(date)) {
      setNewSelectedDates((prev) => prev.filter((d) => d !== date));
    } else {
      setNewSelectedDates((prev) => [...prev, date]);
    }
  };
  // const handleDateSelect = (date: string) => {
  //   if (selectedDates.includes(date)) {
  //     setSelectedDates((prev) => prev.filter((d) => d !== date));
  //   } else {
  //     setSelectedDates((prev) => [...prev, date]);
  //   }
  // };

  // const handleOnTableChange = (table: TTableInDay) => {
  //   if (selectedTables.includes(table)) {
  //     setSelectedTables((prev) => prev.filter((t) => t.table.id !== table.table.id));
  //   } else {
  //     setSelectedTables((prev) => [...prev, table]);
  //   }
  // }
  

  const handleOnTableChange = (table: TTableInDay, date: TDateType) => {
    setSelectedTables(prevTables => {
      // Check if the date is already in the selected tables
      const existingDate = prevTables.find(t => t.date === date.date);
  
      if (existingDate) {
        // If the date is already in the selected tables, replace its table with the new table
        return prevTables.map(t => t.date === date.date ? { ...t, table } : t);
      } else {
        // If the date is not in the selected tables, add a new entry with the date and table
        return [...prevTables, { date: date.date, table }];
      }
    });
  };

  const handleProceedToCheckout = (event: React.FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams();
    params.append("options", JSON.stringify(options));
    if (!options.selectedTables || options.selectedTables.length === 0) {
      alert("Please select tables before proceeding to checkout.");
      return;
    }
  
    console.log(params.get("options"));
    push(`/checkout?${params.toString()}`);
  };
  return (
    <form
      onSubmit={handleProceedToCheckout}
      className="w-[40%] min-w-[250px] flex flex-col gap-5 px-5"
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
      {JSON.stringify(options)}
    </form>
  );
};

export default SelectOptions;
