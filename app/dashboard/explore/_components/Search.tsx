"use client";

import { useRouter } from "next/navigation";

const Search = () => {
  const { push } = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    push(`/dashboard/explore?search=${value}`);
  };
  return (
    <input
      type="text"
      placeholder="FIND A MARKET"
      onChange={handleSearch}
      className="bg-background rounded-full px-3 py-2 max-w-[654px] w-[100%]"
    />
  );
};

export default Search;
