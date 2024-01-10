"use client";

import { createUrl, getKeyByValue } from "@/utils/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";


function createSortOptions<T extends { [key: string]: K }, K extends string>(
  obj: T
) {
  return obj;
}

const sortOptions = createSortOptions({
  "Date: coming up": "date_upcoming",
  "Highest Price": "price_highest",
  "Lowest Price": "price_lowest",
  "Venue: A-Z": "venue_az",
  "Venue: Z-A": "venue_za",
});

export type SortOption = (typeof sortOptions)[keyof typeof sortOptions] | undefined;
export type SortOptionKey = keyof typeof sortOptions;

const SortBy = () => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const searchParams = useSearchParams();

  const { push } = useRouter();


  const onOptionClick = (option: SortOptionKey) => {
    const newParams = new URLSearchParams();

    newParams.set("sort", sortOptions[option]);

    push(createUrl("/dashboard/explore", newParams), { scroll: false });

    setIsSortOpen(false);
  };
  console.log({ searchParams: searchParams.toString()})
  return (
    <div className="absolute bottom-0 right-0">
      <button
        type="button"
        className="text-black"
        onClick={() => setIsSortOpen(!isSortOpen)}
      >
      Sort by: {getKeyByValue(searchParams.get("sort") as SortOption, sortOptions) || "Date: coming up"}
      </button>
      {isSortOpen && (
        <ul className="flex flex-col absolute w-fit top-full left-0 bg-white">
          {Object.keys(sortOptions).map((option) => (
            <li key={option} className="w-full">
              <button
                type="button"
                className="text-left px-1 text-black w-full whitespace-nowrap hover:bg-slate-300"
                onClick={() => onOptionClick(option as SortOptionKey)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortBy;