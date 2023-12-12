"use client";
import { TSanityMarket } from "@/sanity/queries/admin/markets";
import SelectDates from "./SelectDates";
import ContinueButton from "../../_components/ContinueButton";
import { useState } from "react";
import { TUserBase } from "@/zod/user-business";
// import { useRouter } from "next/navigation";

const SelectOptions = ({ market }: { market: TSanityMarket }) => {
  // const { push } = useRouter();
  
  const [specialRequest, setSpecialRequest] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const price = market.price.replace("$", "");
  const totalToPay = selectedDates.length * Number(price);

  const options = {
    selectedDates,
    totalToPay,
    specialRequest,
    marketId: market._id,
  };

  const handleDateSelect = (date: string) => {
    if (selectedDates.includes(date)) {
      setSelectedDates((prev) => prev.filter((d) => d !== date));
    } else {
      setSelectedDates((prev) => [...prev, date]);
    }
  };

  const handleProceedToCheckout = (event: React.FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams();
    params.append("options", JSON.stringify(options));
    console.log(params.get("options"));
    // push(`/checkout?${params.toString()}`);
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
        handleDateSelect={handleDateSelect}
        selectedDates={selectedDates}
        totalToPay={totalToPay}
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
