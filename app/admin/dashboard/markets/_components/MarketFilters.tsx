"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const MarketFilters = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // const marketFilter = searchParams.get("marketFilter")
  const [marketFilter, setMarketFilter] = useState(searchParams.get("marketFilter") || "active")

  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (newValue === "all") {
      params.delete("marketFilter")
      setMarketFilter(newValue)
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      params.set("marketFilter", newValue);
      setMarketFilter(newValue)
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("marketFilter", "active");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [])
  return (
    <div className="flex">
      <label>Market Status:</label>
      <select onChange={onSelect} value={marketFilter}>
        <option value="archived">Archived</option>
        <option value="active">Active</option>
        <option value="all">All</option>
      </select>
    </div>
  );
}

export default MarketFilters;