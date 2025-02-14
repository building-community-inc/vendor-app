"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SelectCity = ({cities}: {
  cities: string[];
}) => {
  const pathname = usePathname();

  const router = useRouter();

  const searchParams = useSearchParams();
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "select-city");
  
  
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    const params = new URLSearchParams(searchParams.toString())
    setSelectedCity(city);

    if (city === "select-city") return;

    if (city === "all") {
      params.delete("city");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      params.set("city", city);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };
  return (
    <select value={selectedCity} onChange={onChange} className="text-xs text-black py-1 px-2 rounded-lg border border-black md:text-base w-[15ch] md:w-auto">
      <option value="select-city">Select a City</option>
      {cities.map((city) => (
        <option key={city} value={city}>{city}</option>
      ))}
      <option value="all">All Cities</option>
    </select>
  );
}

export default SelectCity;