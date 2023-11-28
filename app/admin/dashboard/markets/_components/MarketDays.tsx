"use client";

import { formatMarketDate } from "@/utils/helpers";
import { useState } from "react";

const MarketDays = ({ dates }: { dates: string[] }) => {
  const [selectedDay, setSelectedDay] = useState<string |  null>(null);
  return (
    <div className="flex gap-4 w-fit mx-auto">
      {dates.map((date) => {
        return (
          <button type="button" onClick={() => setSelectedDay(date)} className={`flex flex-col justify-center gap-4 w-fit border-4 border-black p-2 rounded-[20px] ${selectedDay === date ? "border-black" : "border-slate-200"} `}>
            <h2 className="font-bold text-xl max-w-[8ch] text-center">{formatMarketDate(date).replace(",", "")}</h2>
          </button>
        );
      })}
    </div>
  );
};

export default MarketDays;