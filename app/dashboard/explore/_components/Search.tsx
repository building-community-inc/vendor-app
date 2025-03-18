"use client";

import { cn } from "@/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const Search = ({
  // urlForSearch,
  theme = "dark",
  placeholder = "FIND A MARKET",
}: {
  urlForSearch: string;
  theme?: "dark" | "light";
  placeholder?: string;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname()
  const search = searchParams.get("search");
  const { push } = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )
  const updateParam = (name: string, value: string) => {
    push(`${pathname}?${createQueryString(name, value)}`)
  }
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    updateParam("search", value)
  }
  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={handleSearch}
      defaultValue={search || ''}
      className={cn(
        `bg-background text-black border border-button-border-color rounded-full px-3 py-2 w-[100%]`,
        theme === "light" && "bg-white text-black border border-black"
      )}
    />
  );
};

export default Search;
