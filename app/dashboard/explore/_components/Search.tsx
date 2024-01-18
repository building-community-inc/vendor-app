"use client";

import { cn } from "@/utils";
import { useRouter } from "next/navigation";

const Search = ({
  urlForSearch,
  theme = "dark",
}: {
  urlForSearch: string;
  theme?: "dark" | "light";
}) => {
  const { push } = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    push(`${urlForSearch}?search=${value}`);
  };

  return (
    <input
      type="text"
      placeholder="FIND A MARKET"
      onChange={handleSearch}
      className={cn(
        `bg-background text-white rounded-full px-3 py-2 max-w-[654px] w-[100%]`,
        theme === "light" && "bg-white text-black border border-black"
      )}
    />
  );
};

export default Search;
