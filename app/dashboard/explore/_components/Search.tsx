"use client";

import { cn } from "@/utils";
import { useRouter } from "next/navigation";

const Search = ({
  urlForSearch,
  theme = "dark",
  placeholder = "FIND A MARKET",
}: {
  urlForSearch: string;
  theme?: "dark" | "light";
  placeholder?: string;
}) => {
  const { push } = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    push(`${urlForSearch}?search=${value}`);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={handleSearch}
      className={cn(
        `bg-background text-black border border-button-border-color rounded-full px-3 py-2 w-[100%]`,
        theme === "light" && "bg-white text-black border border-black"
      )}
    />
  );
};

export default Search;
