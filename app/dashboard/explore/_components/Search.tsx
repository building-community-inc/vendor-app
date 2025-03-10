"use client";

import { cn } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";

const Search = ({
  urlForSearch,
  theme = "dark",
  placeholder = "FIND A MARKET",
}: {
  urlForSearch: string;
  theme?: "dark" | "light";
  placeholder?: string;
}) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
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
      value={search || ''}
      className={cn(
        `bg-background text-black border border-button-border-color rounded-full px-3 py-2 w-[100%]`,
        theme === "light" && "bg-white text-black border border-black"
      )}
    />
  );
};

export default Search;
